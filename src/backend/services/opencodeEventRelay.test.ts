import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockShowPermissionDialog, mockDbRun, mockFetch } = vi.hoisted(() => ({
  mockShowPermissionDialog: vi.fn().mockResolvedValue('once'),
  mockDbRun: vi.fn(),
  mockFetch: vi.fn().mockResolvedValue({ ok: true }),
}));

vi.mock('../database', () => ({
  db: {
    prepare: vi
      .fn()
      .mockReturnValue({ run: mockDbRun, get: vi.fn(), all: vi.fn().mockReturnValue([]) }),
  },
}));
vi.mock('./runStreamStore', () => ({
  push: vi.fn(),
  streamText: vi.fn(),
  openRun: vi.fn(),
  close: vi.fn(),
  hasErrorEvents: vi.fn().mockReturnValue(false),
}));
vi.mock('./permissionBridge', () => ({
  showPermissionDialog: mockShowPermissionDialog,
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

function makePermissionEvent(overrides: Record<string, unknown> = {}) {
  return {
    payload: {
      type: 'permission.updated',
      properties: {
        id: 'perm-1',
        sessionID: 'sess-1',
        title: 'Allow shell command?',
        pattern: 'rm -rf /tmp/x',
        type: 'bash',
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

// ── Relay loop — permission.updated event handling ────────────────────────────

// Each relay loop test resets modules to clear the module-level `handledPermissionIds` set
// so that deduplication state does not leak between tests.
describe('relay loop – permission.updated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockShowPermissionDialog.mockResolvedValue('once');
    mockFetch.mockResolvedValue({ ok: true });
  });

  it('calls showPermissionDialog with title, detail (pattern), and permissionType', async () => {
    const client = makeClient([makePermissionEvent()]);
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await vi.waitFor(() => expect(mockShowPermissionDialog).toHaveBeenCalled());

    expect(mockShowPermissionDialog).toHaveBeenCalledWith({
      title: 'Allow shell command?',
      detail: 'rm -rf /tmp/x',
      permissionType: 'bash',
    });

    closeServerRelay(client);
  });

  it('joins array patterns with ", " before passing to showPermissionDialog', async () => {
    const client = makeClient([
      makePermissionEvent({ pattern: ['*.ts', '*.tsx'], id: 'perm-arr' }),
    ]);
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await vi.waitFor(() => expect(mockShowPermissionDialog).toHaveBeenCalled());

    expect(mockShowPermissionDialog).toHaveBeenCalledWith(
      expect.objectContaining({ detail: '*.ts, *.tsx' })
    );

    closeServerRelay(client);
  });

  it('defaults permissionType to "bash" when type is missing', async () => {
    const event = makePermissionEvent({ id: 'perm-notype' });
    delete (event.payload.properties as Record<string, unknown>).type;
    const client = makeClient([event]);
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await vi.waitFor(() => expect(mockShowPermissionDialog).toHaveBeenCalled());

    expect(mockShowPermissionDialog).toHaveBeenCalledWith(
      expect.objectContaining({ permissionType: 'bash' })
    );

    closeServerRelay(client);
  });

  it('calls respondToPermission with the dialog response', async () => {
    mockShowPermissionDialog.mockResolvedValue('always');
    const client = makeClient([makePermissionEvent({ id: 'perm-resp' })]);
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await vi.waitFor(() => expect(mockFetch).toHaveBeenCalled());

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:1234/session/sess-1/permissions/perm-resp',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ response: 'always' }),
      })
    );

    closeServerRelay(client);
  });

  it('skips the event when permId is missing', async () => {
    const event = makePermissionEvent({ id: 'perm-noid' });
    delete (event.payload.properties as Record<string, unknown>).id;
    const client = makeClient([event]);
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    // Give relay loop time to process
    await new Promise((r) => setTimeout(r, 30));

    expect(mockShowPermissionDialog).not.toHaveBeenCalled();

    closeServerRelay(client);
  });

  it('skips the event when sessionID is missing', async () => {
    const event = makePermissionEvent({ id: 'perm-nosid' });
    delete (event.payload.properties as Record<string, unknown>).sessionID;
    const client = makeClient([event]);
    // Subscribe a different session so the module is active
    subscribeRun(client, 'sess-other', 'run-1', 'http://localhost:1234');

    await new Promise((r) => setTimeout(r, 30));

    expect(mockShowPermissionDialog).not.toHaveBeenCalled();

    closeServerRelay(client);
  });

  it('skips the event when there is no subscriber for the session', async () => {
    const client = makeClient([makePermissionEvent({ id: 'perm-nosub', sessionID: 'sess-gone' })]);
    // Subscribe a DIFFERENT session, not 'sess-gone'
    subscribeRun(client, 'sess-other', 'run-1', 'http://localhost:1234');

    await new Promise((r) => setTimeout(r, 30));

    expect(mockShowPermissionDialog).not.toHaveBeenCalled();

    closeServerRelay(client);
  });

  it('deduplicates: does not show dialog twice for the same permId', async () => {
    const event = makePermissionEvent({ id: 'perm-dup' });
    const client = makeClient([event, event]); // same event twice
    subscribeRun(client, 'sess-1', 'run-1', 'http://localhost:1234');

    await vi.waitFor(() => expect(mockShowPermissionDialog).toHaveBeenCalled());
    // Give extra time in case a second call would occur
    await new Promise((r) => setTimeout(r, 30));

    expect(mockShowPermissionDialog).toHaveBeenCalledOnce();

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
