import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockAcquireContext, mockMcpStatus, mockMcpAuthenticate, mockMcpRemove, mockFindAll } =
  vi.hoisted(() => ({
    mockAcquireContext: vi.fn(),
    mockMcpStatus: vi.fn(),
    mockMcpAuthenticate: vi.fn(),
    mockMcpRemove: vi.fn(),
    mockFindAll: vi.fn().mockReturnValue([]),
  }));

vi.mock('../../main/config', () => ({
  config: { workspacesDir: '/tmp/workspaces' },
}));

vi.mock('../services/opencodeServerPool', () => ({
  acquireContext: mockAcquireContext,
}));

vi.mock('../repositories/settingsRepository', () => ({
  settingsRepository: { findAll: mockFindAll },
}));

vi.mock('../util/logger', () => ({
  logger: { info: vi.fn(), debug: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

import router from './notionMcp';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeContext(overrides: Record<string, unknown> = {}) {
  return {
    client: {
      mcp: {
        status: mockMcpStatus,
        auth: {
          authenticate: mockMcpAuthenticate,
          remove: mockMcpRemove,
        },
      },
    },
    release: vi.fn(),
    ...overrides,
  };
}

async function get(path: string) {
  return router.request(path, { method: 'GET' });
}

async function post(path: string) {
  return router.request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
}

// ── GET /status ───────────────────────────────────────────────────────────────

describe('GET /status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns not_configured when notion key is missing from mcp.status result', async () => {
    const ctx = makeContext();
    mockAcquireContext.mockResolvedValue(ctx);
    mockMcpStatus.mockResolvedValue({ data: {} });

    const res = await get('/status');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'not_configured' });
  });

  it('returns the notion status object when present', async () => {
    const ctx = makeContext();
    mockAcquireContext.mockResolvedValue(ctx);
    mockMcpStatus.mockResolvedValue({ data: { notion: { status: 'connected' } } });

    const res = await get('/status');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'connected' });
  });

  it('returns needs_auth status when present', async () => {
    const ctx = makeContext();
    mockAcquireContext.mockResolvedValue(ctx);
    mockMcpStatus.mockResolvedValue({ data: { notion: { status: 'needs_auth' } } });

    const res = await get('/status');
    expect(await res.json()).toMatchObject({ status: 'needs_auth' });
  });

  it('releases context after success', async () => {
    const ctx = makeContext();
    mockAcquireContext.mockResolvedValue(ctx);
    mockMcpStatus.mockResolvedValue({ data: { notion: { status: 'connected' } } });

    await get('/status');
    expect(ctx.release).toHaveBeenCalled();
  });

  it('returns 500 when acquireContext throws', async () => {
    mockAcquireContext.mockRejectedValue(new Error('pool exhausted'));

    const res = await get('/status');
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ status: 'failed' });
  });
});

// ── POST /authenticate ────────────────────────────────────────────────────────

describe('POST /authenticate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMcpAuthenticate.mockResolvedValue(undefined);
  });

  it('returns { ok: true } immediately', async () => {
    const ctx = makeContext();
    mockAcquireContext.mockResolvedValue(ctx);

    const res = await post('/authenticate');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('calls mcp.auth.authenticate with notion name', async () => {
    const ctx = makeContext();
    mockAcquireContext.mockResolvedValue(ctx);

    await post('/authenticate');
    // Give the background promise a chance to run
    await new Promise((r) => setTimeout(r, 0));
    expect(mockMcpAuthenticate).toHaveBeenCalledWith({ path: { name: 'notion' } });
  });

  it('returns 500 when acquireContext throws', async () => {
    mockAcquireContext.mockRejectedValue(new Error('no server'));

    const res = await post('/authenticate');
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: expect.stringContaining('no server') });
  });
});

// ── POST /disconnect ──────────────────────────────────────────────────────────

describe('POST /disconnect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMcpRemove.mockResolvedValue(undefined);
  });

  it('returns { ok: true } on success', async () => {
    const ctx = makeContext();
    mockAcquireContext.mockResolvedValue(ctx);

    const res = await post('/disconnect');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('calls mcp.auth.remove with notion name', async () => {
    const ctx = makeContext();
    mockAcquireContext.mockResolvedValue(ctx);

    await post('/disconnect');
    expect(mockMcpRemove).toHaveBeenCalledWith({ path: { name: 'notion' } });
  });

  it('releases context after success', async () => {
    const ctx = makeContext();
    mockAcquireContext.mockResolvedValue(ctx);

    await post('/disconnect');
    expect(ctx.release).toHaveBeenCalled();
  });

  it('returns 500 when mcp.auth.remove throws', async () => {
    const ctx = makeContext();
    mockAcquireContext.mockResolvedValue(ctx);
    mockMcpRemove.mockRejectedValue(new Error('remove failed'));

    const res = await post('/disconnect');
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: expect.stringContaining('remove failed') });
  });

  it('releases context even when mcp.auth.remove throws', async () => {
    const ctx = makeContext();
    mockAcquireContext.mockResolvedValue(ctx);
    mockMcpRemove.mockRejectedValue(new Error('oops'));

    await post('/disconnect');
    expect(ctx.release).toHaveBeenCalled();
  });
});
