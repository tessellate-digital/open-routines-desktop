import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockAnswerPermission, mockFindById, mockCountByStatus, mockFindAll } = vi.hoisted(() => ({
  mockAnswerPermission: vi.fn().mockResolvedValue(undefined),
  mockFindById: vi.fn(),
  mockCountByStatus: vi.fn().mockReturnValue(0),
  mockFindAll: vi.fn().mockReturnValue([]),
}));

vi.mock('../services/opencodeEventRelay', () => ({
  answerPermission: mockAnswerPermission,
  answerQuestion: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../repositories/runsRepository', () => ({
  runsRepository: {
    findById: mockFindById,
    findAll: mockFindAll,
    findParentChain: vi.fn().mockReturnValue([]),
    countByStatus: mockCountByStatus,
    markAsLost: vi.fn(),
    getRoutineName: vi.fn().mockReturnValue(''),
    create: vi.fn(),
  },
}));

vi.mock('../repositories/routinesRepository', () => ({
  routinesRepository: { findById: vi.fn() },
}));

vi.mock('../services/executor', () => ({
  executor: {
    cancelRun: vi.fn().mockResolvedValue(undefined),
    connectStream: vi.fn().mockReturnValue(null),
    getHistory: vi.fn().mockReturnValue([]),
    startRun: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../services/runStreamStore', () => ({
  openRun: vi.fn(),
  close: vi.fn(),
  push: vi.fn(),
}));

vi.mock('../services/eventBus', () => ({
  eventBus: { broadcast: vi.fn() },
}));

vi.mock('../util/logger', () => ({
  logger: { info: vi.fn(), debug: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

import router from './runs';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRunRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'run-1',
    routine_id: 'routine-1',
    routine_name: 'My Routine',
    trigger_id: null,
    trigger_type: 'manual',
    prompt: 'Do stuff',
    display_prompt: 'Do stuff',
    parent_run_id: null,
    session_id: null,
    assistant_message_id: null,
    status: 'running',
    started_at: '2024-01-01T00:00:00Z',
    finished_at: null,
    exit_code: null,
    stdout: '',
    stderr: '',
    metadata: '{}',
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

async function post(path: string, body: unknown) {
  return router.request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function get(path: string) {
  return router.request(path, { method: 'GET' });
}

// ── answer-permission route ───────────────────────────────────────────────────

describe('POST /:id/answer-permission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAnswerPermission.mockResolvedValue(undefined);
  });

  it('returns 200 { ok: true } when relay.answerPermission succeeds', async () => {
    const res = await post('/run-1/answer-permission', {
      permissionId: 'perm-xyz',
      response: 'once',
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(mockAnswerPermission).toHaveBeenCalledWith('perm-xyz', 'once');
  });

  it('passes "always" to relay.answerPermission', async () => {
    const res = await post('/run-1/answer-permission', {
      permissionId: 'perm-1',
      response: 'always',
    });
    expect(res.status).toBe(200);
    expect(mockAnswerPermission).toHaveBeenCalledWith('perm-1', 'always');
  });

  it('passes "reject" to relay.answerPermission', async () => {
    const res = await post('/run-1/answer-permission', {
      permissionId: 'perm-1',
      response: 'reject',
    });
    expect(res.status).toBe(200);
    expect(mockAnswerPermission).toHaveBeenCalledWith('perm-1', 'reject');
  });

  it('returns 500 with error detail when relay.answerPermission throws', async () => {
    mockAnswerPermission.mockRejectedValue(new Error('No server found for permission perm-1'));
    const res = await post('/run-1/answer-permission', {
      permissionId: 'perm-1',
      response: 'once',
    });
    expect(res.status).toBe(500);
    const body = (await res.json()) as { detail: string };
    expect(body.detail).toContain('No server found for permission perm-1');
  });

  it('returns 400 when permissionId is missing', async () => {
    const res = await post('/run-1/answer-permission', { response: 'once' });
    expect(res.status).toBe(400);
    expect(mockAnswerPermission).not.toHaveBeenCalled();
  });

  it('returns 400 when response is not a valid enum value', async () => {
    const res = await post('/run-1/answer-permission', {
      permissionId: 'perm-1',
      response: 'maybe',
    });
    expect(res.status).toBe(400);
    expect(mockAnswerPermission).not.toHaveBeenCalled();
  });

  it('returns 400 when permissionId is an empty string', async () => {
    const res = await post('/run-1/answer-permission', {
      permissionId: '',
      response: 'once',
    });
    expect(res.status).toBe(400);
    expect(mockAnswerPermission).not.toHaveBeenCalled();
  });

  it('returns 400 when body is entirely missing', async () => {
    const res = await router.request('/run-1/answer-permission', { method: 'POST' });
    expect(res.status).toBe(400);
  });
});

// ── parseStdout (tested indirectly via GET /:id stdout field) ─────────────────

describe('GET /:id – parseStdout behaviour', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('parses valid JSONL stdout into typed event objects', async () => {
    const stdout =
      JSON.stringify({ type: 'text', data: 'Hello' }) +
      '\n' +
      JSON.stringify({ type: 'tool', data: '[tool: read]\nfile.ts' });
    mockFindById.mockReturnValue(makeRunRow({ stdout, status: 'success' }));

    const res = await get('/run-1');
    const body = (await res.json()) as { stdout: Array<{ type: string; data: string }> };
    expect(body.stdout).toEqual([
      { type: 'text', data: 'Hello' },
      { type: 'tool', data: '[tool: read]\nfile.ts' },
    ]);
  });

  it('falls back to { type: "text", data: line } for non-JSON lines', async () => {
    mockFindById.mockReturnValue(makeRunRow({ stdout: 'plain text line', status: 'success' }));

    const res = await get('/run-1');
    const body = (await res.json()) as { stdout: Array<{ type: string; data: string }> };
    expect(body.stdout).toEqual([{ type: 'text', data: 'plain text line' }]);
  });

  it('returns an empty stdout array when stdout is empty', async () => {
    mockFindById.mockReturnValue(makeRunRow({ stdout: '', status: 'success' }));

    const res = await get('/run-1');
    const body = (await res.json()) as { stdout: unknown[] };
    expect(body.stdout).toEqual([]);
  });

  it('skips blank lines when parsing JSONL', async () => {
    const stdout =
      JSON.stringify({ type: 'text', data: 'A' }) +
      '\n\n' +
      JSON.stringify({ type: 'text', data: 'B' });
    mockFindById.mockReturnValue(makeRunRow({ stdout, status: 'success' }));

    const res = await get('/run-1');
    const body = (await res.json()) as { stdout: unknown[] };
    expect(body.stdout).toHaveLength(2);
  });

  it('returns 404 when the run does not exist', async () => {
    mockFindById.mockReturnValue(undefined);
    const res = await get('/nonexistent');
    expect(res.status).toBe(404);
  });
});

// ── GET /stats ────────────────────────────────────────────────────────────────

describe('GET /stats', () => {
  it('returns the count of running runs', async () => {
    mockCountByStatus.mockReturnValue(3);
    const res = await get('/stats');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ running: 3 });
  });
});
