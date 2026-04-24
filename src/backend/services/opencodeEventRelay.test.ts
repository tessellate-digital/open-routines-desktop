import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockDbRun, mockFetch, mockPush } = vi.hoisted(() => ({
  mockDbRun: vi.fn(),
  mockFetch: vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve('') }),
  mockPush: vi.fn(),
}));

vi.mock('../database', () => ({
  db: {
    prepare: vi
      .fn()
      .mockReturnValue({ run: mockDbRun, get: vi.fn(), all: vi.fn().mockReturnValue([]) }),
  },
}));
vi.mock('./runStreamStore', () => ({
  push: mockPush,
  streamText: vi.fn(),
  openRun: vi.fn(),
  close: vi.fn(),
  hasErrorEvents: vi.fn().mockReturnValue(false),
}));
vi.mock('../util/logger', () => ({
  logger: { info: vi.fn(), debug: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

// Replace the global fetch used by respondToPermission
vi.stubGlobal('fetch', mockFetch);

import {
  subscribeRun,
  unsubscribeRun,
  closeServerRelay,
  waitForDrain,
  hadErrors,
  answerPermission,
} from './opencodeEventRelay';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Build a mock opencode client whose `global.event()` emits a fixed sequence
 * of events and then ends the stream.
 */
function makeClient(events: Array<Record<string, unknown>>) {
  const queue = [...events];
  return {
    global: {
      event: vi.fn().mockResolvedValue({
        stream: {
          [Symbol.asyncIterator]() {
            return {
              async next() {
                if (queue.length === 0) {
                  return { done: true, value: undefined };
                }
                await Promise.resolve(); // yield to microtask queue
                return { done: false, value: queue.shift() };
              },
              return: vi.fn().mockResolvedValue({ done: true, value: undefined }),
            };
          },
        },
      }),
    },
  };
}

function makePermissionEvent(
  overrides: Record<string, unknown> = {},
  eventType = 'permission.asked'
) {
  return {
    payload: {
      type: eventType,
      properties: {
        id: 'perm-1',
        sessionID: 'sess-1',
        permission: 'bash',
        patterns: ['rm -rf /tmp/x'],
        metadata: {},
        ...overrides,
      },
    },
  };
}

// ── Public API tests (no relay loop needed) ───────────────────────────────────

describe('subscribeRun / hadErrors / waitForDrain / unsubscribeRun', () => {
  it('waitForDrain resolves immediately when session has no subscriber', async () => {
    await expect(waitForDrain('nonexistent-session')).resolves.toBeUndefined();
  });

  it('hadErrors returns false for unknown sessions', () => {
    expect(hadErrors('nonexistent-session')).toBe(false);
  });

  it('unsubscribeRun is safe to call for an unknown session', () => {
    expect(() => unsubscribeRun('nonexistent-session')).not.toThrow();
  });

  it('closeServerRelay is a no-op for unknown clients', () => {
    expect(() => closeServerRelay({})).not.toThrow();
  });
});

// ── Relay loop — permission.asked / permission.updated event handling ─────────

describe('relay loop – permission events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve('') });
  });

  it('pushes a permission event to runStreamStore for permission.asked', async () => {
    const client = makeClient([makePermissionEvent()]);
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await vi.waitFor(() => expect(mockPush).toHaveBeenCalled());

    const [runId, event] = mockPush.mock.calls[0] as [string, { type: string; data: string }];
    expect(runId).toBe('run-1');
    expect(event.type).toBe('permission');
    const parsed = JSON.parse(event.data) as Record<string, unknown>;
    expect(parsed).toMatchObject({ id: 'perm-1', permission: 'bash', patterns: ['rm -rf /tmp/x'] });

    closeServerRelay(client);
  });

  it('also handles permission.updated events', async () => {
    const client = makeClient([makePermissionEvent({ id: 'perm-upd' }, 'permission.updated')]);
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await vi.waitFor(() => expect(mockPush).toHaveBeenCalled());

    const [, event] = mockPush.mock.calls[0] as [string, { type: string; data: string }];
    expect(event.type).toBe('permission');

    closeServerRelay(client);
  });

  it('normalises a single pattern string into an array', async () => {
    const client = makeClient([
      makePermissionEvent({ id: 'perm-str', patterns: undefined, pattern: '~/projects/**' }),
    ]);
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await vi.waitFor(() => expect(mockPush).toHaveBeenCalled());

    const [, event] = mockPush.mock.calls[0] as [string, { type: string; data: string }];
    const parsed = JSON.parse(event.data) as Record<string, unknown>;
    expect(parsed.patterns).toEqual(['~/projects/**']);

    closeServerRelay(client);
  });

  it('uses "bash" as default permissionType when permission/type field is missing', async () => {
    const event = makePermissionEvent({ id: 'perm-notype' });
    delete (event.payload.properties as Record<string, unknown>).permission;
    const client = makeClient([event]);
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await vi.waitFor(() => expect(mockPush).toHaveBeenCalled());

    const [, evt] = mockPush.mock.calls[0] as [string, { type: string; data: string }];
    const parsed = JSON.parse(evt.data) as Record<string, unknown>;
    expect(parsed.permission).toBe('bash');

    closeServerRelay(client);
  });

  it('skips the event when permId is missing', async () => {
    const event = makePermissionEvent({ id: 'perm-noid' });
    delete (event.payload.properties as Record<string, unknown>).id;
    const client = makeClient([event]);
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await new Promise((r) => setTimeout(r, 30));

    expect(mockPush).not.toHaveBeenCalled();

    closeServerRelay(client);
  });

  it('skips the event when sessionID is missing', async () => {
    const event = makePermissionEvent({ id: 'perm-nosid' });
    delete (event.payload.properties as Record<string, unknown>).sessionID;
    const client = makeClient([event]);
    subscribeRun(client, 'sess-other', 'run-1', 'http://localhost:1234');

    await new Promise((r) => setTimeout(r, 30));

    expect(mockPush).not.toHaveBeenCalled();

    closeServerRelay(client);
  });

  it('skips the event when there is no subscriber for the session', async () => {
    const client = makeClient([makePermissionEvent({ id: 'perm-nosub', sessionID: 'sess-gone' })]);
    subscribeRun(client, 'sess-other', 'run-1', 'http://localhost:1234');

    await new Promise((r) => setTimeout(r, 30));

    expect(mockPush).not.toHaveBeenCalled();

    closeServerRelay(client);
  });

  it('deduplicates: only pushes once for the same permId', async () => {
    const event = makePermissionEvent({ id: 'perm-dup' });
    const client = makeClient([event, event]); // same event twice
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await vi.waitFor(() => expect(mockPush).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 30));

    const permPushes = mockPush.mock.calls.filter(
      ([, e]: [string, { type: string }]) => e.type === 'permission'
    );
    expect(permPushes).toHaveLength(1);

    closeServerRelay(client);
  });
});

// ── answerPermission ──────────────────────────────────────────────────────────

describe('answerPermission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true, text: () => Promise.resolve('') });
  });

  it('throws when permissionId was never registered', async () => {
    await expect(answerPermission('no-such-perm', 'once')).rejects.toThrow(
      'No server found for permission no-such-perm'
    );
  });

  it('calls fetch with the correct URL and body after permission.asked', async () => {
    const client = makeClient([makePermissionEvent({ id: 'perm-ans' })]);
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await vi.waitFor(() => expect(mockPush).toHaveBeenCalled());

    await answerPermission('perm-ans', 'once');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:1234/session/sess-1/permissions/perm-ans',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ response: 'once' }),
      })
    );

    closeServerRelay(client);
  });

  it('supports "always" and "reject" response values', async () => {
    for (const response of ['always', 'reject'] as const) {
      vi.clearAllMocks();
      const permId = `perm-${response}`;
      const client = makeClient([makePermissionEvent({ id: permId })]);
      subscribeRun(client, 'sess-1', `run-${response}`, 'http://localhost:1234');

      await vi.waitFor(() => expect(mockPush).toHaveBeenCalled());
      await answerPermission(permId, response);

      const body = JSON.parse(
        (mockFetch.mock.calls[0] as [string, RequestInit])[1].body as string
      ) as { response: string };
      expect(body.response).toBe(response);

      closeServerRelay(client);
    }
  });

  it('removes context after answering so a second call throws', async () => {
    const client = makeClient([makePermissionEvent({ id: 'perm-once' })]);
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await vi.waitFor(() => expect(mockPush).toHaveBeenCalled());
    await answerPermission('perm-once', 'once');

    await expect(answerPermission('perm-once', 'reject')).rejects.toThrow();

    closeServerRelay(client);
  });
});

// ── Relay loop — session.idle / hadErrors / waitForDrain ──────────────────────

describe('relay loop – session.idle and drain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('waitForDrain resolves after session.idle fires', async () => {
    const client = makeClient([
      { payload: { type: 'session.idle', properties: { sessionID: 'sess-drain' } } },
    ]);
    subscribeRun(client, 'sess-drain', 'run-drain', 'http://localhost:1234');

    await expect(waitForDrain('sess-drain')).resolves.toBeUndefined();

    closeServerRelay(client);
  });

  it('hadErrors returns false when no session.error was received', async () => {
    const client = makeClient([
      { payload: { type: 'session.idle', properties: { sessionID: 'sess-ok' } } },
    ]);
    subscribeRun(client, 'sess-ok', 'run-ok', 'http://localhost:1234');
    await waitForDrain('sess-ok');

    expect(hadErrors('sess-ok')).toBe(false);

    closeServerRelay(client);
  });
});
