import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseModelString, Executor } from './executor';

// ── Hoisted mocks (must be defined before vi.mock factories run) ──────────────

const { mockAcquireContext, mockSessionCreate, mockSessionPrompt, mockDbPrepare } = vi.hoisted(
  () => {
    const mockSessionCreate = vi.fn().mockResolvedValue({ data: { id: 'sess-1' } });
    const mockSessionPrompt = vi.fn().mockResolvedValue({ data: { info: { id: 'msg-1' } } });
    const mockAcquireContext = vi.fn();

    // SQL-dispatching prepare mock — returns appropriate row shapes per query
    const mockDbPrepare = vi.fn().mockImplementation((sql: string) => ({
      run: vi.fn(),
      get: vi.fn().mockImplementation(() => {
        if (sql.includes('SELECT metadata')) {
          return { metadata: '{}' };
        }
        if (sql.includes('SELECT session_id')) {
          return { session_id: null };
        }
        if (sql.includes('SELECT status, exit_code')) {
          return { status: 'success', exit_code: null };
        }
        if (sql.includes('SELECT status')) {
          return { status: 'running' };
        }
        return undefined;
      }),
      all: vi.fn().mockReturnValue([]),
    }));

    return { mockAcquireContext, mockSessionCreate, mockSessionPrompt, mockDbPrepare };
  }
);

vi.mock('../database', () => ({ db: { prepare: mockDbPrepare } }));
vi.mock('../../main/config', () => ({
  config: { workspacesDir: '/tmp/workspaces', opencodeConfigPath: '/tmp/opencode.json' },
}));
vi.mock('./eventBus', () => ({ eventBus: { broadcast: vi.fn() } }));
vi.mock('./runStreamStore', () => ({
  openRun: vi.fn(),
  close: vi.fn(),
  push: vi.fn(),
  streamText: vi.fn(),
  hasErrorEvents: vi.fn().mockReturnValue(false),
  connectStream: vi.fn(),
  getHistory: vi.fn().mockReturnValue([]),
  AsyncQueue: class {},
}));
vi.mock('./opencodeServerPool', () => ({
  acquireContext: mockAcquireContext,
  disposeAll: vi.fn(),
  invalidateAll: vi.fn(),
}));
vi.mock('./opencodeEventRelay', () => ({
  subscribeRun: vi.fn(),
  unsubscribeRun: vi.fn(),
  waitForDrain: vi.fn().mockResolvedValue(undefined),
  hadErrors: vi.fn().mockReturnValue(false),
  closeServerRelay: vi.fn(),
  answerQuestion: vi.fn(),
}));
vi.mock('../repositories/runsRepository', () => ({
  runsRepository: { findParentChain: vi.fn().mockReturnValue([]) },
}));
vi.mock('fs', () => ({
  promises: { mkdir: vi.fn().mockResolvedValue(undefined) },
  existsSync: vi.fn().mockReturnValue(false),
}));
vi.mock('child_process', () => ({ execFile: vi.fn() }));
vi.mock('../util/logger', () => ({
  logger: { info: vi.fn(), debug: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRoutine(overrides: Record<string, unknown> = {}) {
  return {
    id: 'routine-1',
    name: 'Test routine',
    description: '',
    prompt: 'Do stuff',
    model: '',
    repository: '',
    branch: 'main',
    agent: 'build',
    env_vars: '{}',
    enabled: 1,
    run_mode: 'background',
    permissions: '{}',
    temperature: null,
    last_run_status: null,
    triggers_count: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

// ── parseModelString ──────────────────────────────────────────────────────────

describe('parseModelString', () => {
  it('returns null for an empty string (use server default)', () => {
    expect(parseModelString('')).toBeNull();
  });

  it('parses a simple "provider/model" string', () => {
    expect(parseModelString('anthropic/claude-opus-4-6')).toEqual({
      providerID: 'anthropic',
      modelID: 'claude-opus-4-6',
    });
  });

  it('parses a "provider/nested/model" string — provider is first segment only', () => {
    expect(parseModelString('anthropic/claude-3-5/sonnet')).toEqual({
      providerID: 'anthropic',
      modelID: 'claude-3-5/sonnet',
    });
  });

  it('throws when there is no slash', () => {
    expect(() => parseModelString('anthropic')).toThrow(/Malformed model string/);
  });

  it('throws when the slash is at the start (missing provider)', () => {
    expect(() => parseModelString('/claude-opus')).toThrow(/Malformed model string/);
  });

  it('throws when the slash is at the end (missing model)', () => {
    expect(() => parseModelString('anthropic/')).toThrow(/Malformed model string/);
  });

  it('error message includes the bad input', () => {
    expect(() => parseModelString('badformat')).toThrow('badformat');
  });
});

// ── Executor.startRun ─────────────────────────────────────────────────────────

describe('Executor.startRun', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset per-test return values
    mockSessionCreate.mockResolvedValue({ data: { id: 'sess-1' } });
    mockSessionPrompt.mockResolvedValue({ data: { info: { id: 'msg-1' } } });
    mockAcquireContext.mockResolvedValue({
      client: { session: { create: mockSessionCreate, prompt: mockSessionPrompt } },
      baseUrl: 'http://localhost:1234',
      release: vi.fn(),
    });
    // SQL-dispatching prepare is set up globally via mockDbPrepare
  });

  it('sends agent: routine.id in the prompt body', async () => {
    const executor = new Executor();
    await executor.startRun('run-1', makeRoutine({ id: 'my-routine-id' }), 'Run the tests');

    expect(mockSessionPrompt).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({ agent: 'my-routine-id' }),
      })
    );
  });

  it('does not send a model field in the prompt body', async () => {
    const executor = new Executor();
    await executor.startRun('run-1', makeRoutine({ model: 'anthropic/claude-opus-4-6' }), 'Do it');

    const body = mockSessionPrompt.mock.calls[0][0].body as Record<string, unknown>;
    expect(body).not.toHaveProperty('model');
  });

  it('sends the full prompt as a text part', async () => {
    const executor = new Executor();
    await executor.startRun('run-1', makeRoutine(), 'My user prompt');

    const body = mockSessionPrompt.mock.calls[0][0].body as Record<string, unknown>;
    const parts = body.parts as Array<{ type: string; text: string }>;
    expect(parts[0].type).toBe('text');
    expect(parts[0].text).toContain('My user prompt');
  });

  it('uses a new SDK session when no session_id exists', async () => {
    const executor = new Executor();
    await executor.startRun('run-1', makeRoutine(), 'Do stuff');
    expect(mockSessionCreate).toHaveBeenCalledOnce();
  });

  it('reuses an existing session_id from DB without calling session.create', async () => {
    // Override the prepare mock for session_id lookup only
    mockDbPrepare.mockImplementation((sql: string) => ({
      run: vi.fn(),
      get: vi.fn().mockImplementation(() => {
        if (sql.includes('SELECT metadata')) {
          return { metadata: '{}' };
        }
        if (sql.includes('SELECT session_id')) {
          return { session_id: 'existing-sess' };
        }
        if (sql.includes('SELECT status, exit_code')) {
          return { status: 'success', exit_code: null };
        }
        if (sql.includes('SELECT status')) {
          return { status: 'running' };
        }
        return undefined;
      }),
      all: vi.fn().mockReturnValue([]),
    }));

    const executor = new Executor();
    await executor.startRun('run-1', makeRoutine(), 'Do stuff');
    expect(mockSessionCreate).not.toHaveBeenCalled();
    expect(mockSessionPrompt).toHaveBeenCalledWith(
      expect.objectContaining({ path: { id: 'existing-sess' } })
    );
  });
});

// ── Trigger path context ──────────────────────────────────────────────────────

describe('trigger path in prompt context', () => {
  function makeDbPrepare(metadata: Record<string, unknown>) {
    return vi.fn().mockImplementation((sql: string) => ({
      run: vi.fn(),
      get: vi.fn().mockImplementation(() => {
        if (sql.includes('SELECT metadata')) {
          return { metadata: JSON.stringify(metadata) };
        }
        if (sql.includes('SELECT session_id')) {
          return { session_id: null };
        }
        if (sql.includes('SELECT status, exit_code')) {
          return { status: 'success', exit_code: null };
        }
        if (sql.includes('SELECT status')) {
          return { status: 'running' };
        }
        return undefined;
      }),
      all: vi.fn().mockReturnValue([]),
    }));
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mockSessionCreate.mockResolvedValue({ data: { id: 'sess-1' } });
    mockSessionPrompt.mockResolvedValue({ data: { info: { id: 'msg-1' } } });
    mockAcquireContext.mockResolvedValue({
      client: { session: { create: mockSessionCreate, prompt: mockSessionPrompt } },
      baseUrl: 'http://localhost:1234',
      release: vi.fn(),
    });
  });

  function getPromptText() {
    const body = mockSessionPrompt.mock.calls[0][0].body as Record<string, unknown>;
    const parts = body.parts as Array<{ type: string; text: string }>;
    return parts[0].text;
  }

  it('includes fs_path and fs_event as informational context', async () => {
    mockDbPrepare.mockImplementation(
      makeDbPrepare({ fs_path: '/Users/loic/Desktop/photo.jpg', fs_event: 'add' })
    );

    await new Executor().startRun('run-1', makeRoutine(), 'Process the image');

    const text = getPromptText();
    expect(text).toContain('Changed path: /Users/loic/Desktop/photo.jpg');
    expect(text).toContain('Filesystem event: add');
  });

  it('does not add hard filesystem restrictions from the trigger path', async () => {
    mockDbPrepare.mockImplementation(
      makeDbPrepare({ fs_path: '/Users/loic/Desktop', fs_event: 'add' })
    );

    await new Executor().startRun('run-1', makeRoutine(), 'Do stuff');

    const text = getPromptText();
    expect(text).not.toContain('HARD REQUIREMENTS');
    expect(text).not.toContain('You MUST only access');
    expect(text).not.toContain('do NOT descend');
    expect(text).not.toContain('only touch files of type');
  });

  it('omits trigger lines entirely when no fs metadata is present', async () => {
    mockDbPrepare.mockImplementation(makeDbPrepare({}));
    await new Executor().startRun('run-1', makeRoutine(), 'Manual run');

    const text = getPromptText();
    expect(text).not.toContain('Changed path:');
    expect(text).not.toContain('Filesystem event:');
  });
});
