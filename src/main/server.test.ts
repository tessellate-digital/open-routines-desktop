import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const {
  mockInitDb,
  mockRegenerateOpencodeConfig,
  mockMarkStaleAsLost,
  mockSchedulerStart,
  mockServe,
} = vi.hoisted(() => ({
  mockInitDb: vi.fn(),
  mockRegenerateOpencodeConfig: vi.fn(),
  mockMarkStaleAsLost: vi.fn().mockReturnValue(0),
  mockSchedulerStart: vi.fn(),
  // Immediately invokes the callback so startServer's Promise resolves
  mockServe: vi.fn().mockImplementation((_opts: unknown, cb: (info: { port: number }) => void) => {
    cb({ port: 4321 });
    return { close: vi.fn() };
  }),
}));

vi.mock('./config', () => ({
  config: {
    workspacesDir: '/tmp/workspaces',
    opencodeConfigPath: '/tmp/opencode.json',
    dbPath: ':memory:',
    port: 0,
  },
}));
vi.mock('./opencodeConfig', () => ({ regenerateOpencodeConfig: mockRegenerateOpencodeConfig }));
vi.mock('../backend/database', () => ({
  initDb: mockInitDb,
  db: {
    exec: vi.fn(),
    prepare: vi.fn().mockReturnValue({ all: vi.fn().mockReturnValue([]) }),
  },
}));
vi.mock('../backend/services/scheduler', () => ({
  schedulerService: { start: mockSchedulerStart },
}));
vi.mock('../backend/services/eventBus', () => ({
  eventBus: {
    subscribe: vi.fn().mockReturnValue({ clientId: 'c1', next: vi.fn() }),
    unsubscribe: vi.fn(),
    broadcast: vi.fn(),
  },
}));
vi.mock('../backend/services/opencodeServerPool', () => ({
  disposeAll: vi.fn(),
  acquireContext: vi.fn(),
  invalidateAll: vi.fn(),
}));
vi.mock('../backend/repositories/runsRepository', () => ({
  runsRepository: { markStaleAsLost: mockMarkStaleAsLost },
}));
vi.mock('../backend/lib/modelUtils', () => ({
  flattenProviderModels: vi.fn().mockReturnValue([]),
}));
vi.mock('../backend/util/logger', () => ({
  logger: { info: vi.fn(), debug: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));
// Router imports — each must be a real Hono instance (app.route() calls internal Hono methods)
vi.mock('../backend/routes/routines', async () => {
  const { Hono } = await import('hono');
  return { default: new Hono() };
});
vi.mock('../backend/routes/triggers', async () => {
  const { Hono } = await import('hono');
  return { default: new Hono() };
});
vi.mock('../backend/routes/runs', async () => {
  const { Hono } = await import('hono');
  return { default: new Hono() };
});
vi.mock('../backend/routes/webhooks', async () => {
  const { Hono } = await import('hono');
  return { default: new Hono() };
});
vi.mock('../backend/routes/settings', async () => {
  const { Hono } = await import('hono');
  return { default: new Hono() };
});
vi.mock('../backend/routes/copilotAuth', async () => {
  const { Hono } = await import('hono');
  return { default: new Hono() };
});
vi.mock('@hono/node-server', () => ({ serve: mockServe }));
vi.mock('fs', () => ({
  mkdirSync: vi.fn(),
  promises: { readdir: vi.fn().mockResolvedValue([]) },
}));

import { startServer } from './server';

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('startServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMarkStaleAsLost.mockReturnValue(0);
    mockServe.mockImplementation((_opts: unknown, cb: (info: { port: number }) => void) => {
      cb({ port: 4321 });
      return { close: vi.fn() };
    });
  });

  it('calls initDb', async () => {
    await startServer();
    expect(mockInitDb).toHaveBeenCalledOnce();
  });

  it('calls regenerateOpencodeConfig', async () => {
    await startServer();
    expect(mockRegenerateOpencodeConfig).toHaveBeenCalledOnce();
  });

  it('calls regenerateOpencodeConfig after initDb', async () => {
    const callOrder: string[] = [];
    mockInitDb.mockImplementation(() => callOrder.push('initDb'));
    mockRegenerateOpencodeConfig.mockImplementation(() => callOrder.push('regenerate'));

    await startServer();

    expect(callOrder.indexOf('initDb')).toBeLessThan(callOrder.indexOf('regenerate'));
  });

  it('calls runsRepository.markStaleAsLost', async () => {
    await startServer();
    expect(mockMarkStaleAsLost).toHaveBeenCalledOnce();
  });

  it('calls schedulerService.start', async () => {
    await startServer();
    expect(mockSchedulerStart).toHaveBeenCalledOnce();
  });

  it('resolves with the port number returned by serve', async () => {
    const port = await startServer();
    expect(port).toBe(4321);
  });
});
