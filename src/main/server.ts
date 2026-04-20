import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamSSE } from 'hono/streaming';
import * as path from 'path';
import * as fs from 'fs';
import { config } from './config';
import { initDb, db } from '../backend/database';
import { schedulerService } from '../backend/services/scheduler';
import { eventBus } from '../backend/services/eventBus';
import {
  disposeAll as disposeServerPool,
  acquireContext,
} from '../backend/services/opencodeServerPool';
import { flattenProviderModels } from '../backend/lib/modelUtils';
import { logger } from '../backend/util/logger';
import { runsRepository } from '../backend/repositories/runsRepository';
import routinesRouter from '../backend/routes/routines';
import triggersRouter from '../backend/routes/triggers';
import runsRouter from '../backend/routes/runs';
import webhooksRouter from '../backend/routes/webhooks';
import settingsRouter from '../backend/routes/settings';
import copilotAuthRouter from '../backend/routes/copilotAuth';

const app = new Hono();

// Allow cross-origin requests from the Vite dev server
app.use('*', cors({ origin: '*' }));

// Routes
app.route('/api/routines', routinesRouter);
app.route('/api', triggersRouter);
app.route('/api/runs', runsRouter);
app.route('/hooks', webhooksRouter);
app.route('/api/settings', settingsRouter);
app.route('/api/auth/github-copilot', copilotAuthRouter);

// Global SSE events endpoint
app.get('/api/events', async (c) => {
  const { clientId, next } = eventBus.subscribe();

  return streamSSE(c, async (stream) => {
    const pingInterval = setInterval(async () => {
      try {
        await stream.writeSSE({ event: 'ping', data: '' });
      } catch {
        clearInterval(pingInterval);
      }
    }, 30_000);

    stream.onAbort(() => {
      clearInterval(pingInterval);
      eventBus.unsubscribe(clientId);
    });

    try {
      while (true) {
        const event = await next();
        if (event === null) break;
        await stream.writeSSE({ event: event.event, data: event.data });
      }
    } finally {
      clearInterval(pingInterval);
      eventBus.unsubscribe(clientId);
    }
  });
});

// Build env that includes stored settings (API keys etc.)
function buildGlobalEnv(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };
  const rows = db.prepare('SELECT key, value FROM settings').all() as Array<{
    key: string;
    value: string;
  }>;
  for (const row of rows) {
    env[row.key] = row.value;
  }
  return env;
}

// Models endpoint
app.get('/api/models', async (c) => {
  let context;
  try {
    const env = buildGlobalEnv();
    context = await acquireContext({ cwd: config.workspacesDir, env });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = context.client as any;
    const result = await client.config.providers();
    if (result.error) {
      return c.json({ models: [], error: String(result.error) });
    }
    const providers = (result?.data?.providers ?? []) as Parameters<
      typeof flattenProviderModels
    >[0];
    const models = flattenProviderModels(providers);
    return c.json({ models });
  } catch (err) {
    return c.json({ models: [], error: String(err) });
  } finally {
    context?.release();
  }
});

// Filesystem browser — in desktop mode, workspacesDir is a local directory
async function getUserMounts(): Promise<string[]> {
  const root = path.resolve(config.workspacesDir);
  try {
    const entries = await fs.promises.readdir(root, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => path.join(root, e.name))
      .sort();
  } catch {
    return [];
  }
}

app.get('/api/fs/mounts', async (c) => {
  const mounts = await getUserMounts();
  return c.json({ mounts });
});

app.get('/api/fs', async (c) => {
  const root = path.resolve(config.workspacesDir);
  const rawPath = c.req.query('path') || '';
  if (!rawPath) {
    return c.json({ detail: 'path query parameter is required' }, 400);
  }
  const resolved = path.resolve(rawPath.replace(/\.\./g, ''));

  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    return c.json({ detail: 'Path is outside the workspaces directory' }, 400);
  }

  if (resolved === root) {
    try {
      const entries = await fs.promises.readdir(resolved, { withFileTypes: true });
      const dirs = entries
        .filter((e) => e.isDirectory())
        .map((e) => ({ name: e.name, path: path.join(resolved, e.name) }))
        .sort((a, b) => a.name.localeCompare(b.name));
      return c.json({ path: resolved, parent: null, root, entries: dirs });
    } catch {
      return c.json({ detail: 'Cannot read directory' }, 400);
    }
  }

  const mounts = await getUserMounts();
  const insideMount = mounts.some(
    (m) => resolved === m || resolved.startsWith(m + path.sep)
  );
  if (!insideMount) {
    return c.json({ detail: 'Path is not inside a mounted workspace' }, 400);
  }

  const mountRoot = mounts.find(
    (m) => resolved === m || resolved.startsWith(m + path.sep)
  )!;

  try {
    const entries = await fs.promises.readdir(resolved, { withFileTypes: true });
    const dirs = entries
      .filter((e) => e.isDirectory())
      .map((e) => ({ name: e.name, path: path.join(resolved, e.name) }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const parent = resolved === mountRoot ? root : path.dirname(resolved);
    return c.json({ path: resolved, parent, root: mountRoot, entries: dirs });
  } catch {
    return c.json({ detail: 'Cannot read directory' }, 400);
  }
});

export async function startServer(): Promise<number> {
  // Ensure workspaces directory exists
  fs.mkdirSync(config.workspacesDir, { recursive: true });

  initDb();
  const staleCount = runsRepository.markStaleAsLost();
  if (staleCount > 0) {
    logger.info(`Marked ${staleCount} stale run(s) as lost`);
  }
  schedulerService.start();

  return new Promise((resolve) => {
    const server = serve(
      { fetch: app.fetch, port: config.port },
      (info) => {
        const port =
          typeof info.port === 'number'
            ? info.port
            : (info as unknown as { address: { port: number } }).address?.port ?? 0;
        logger.info(`Server running on http://localhost:${port}`);
        resolve(port);
      }
    );

    // Cleanup on app quit
    process.on('SIGTERM', async () => {
      await disposeServerPool();
      (server as { close?: () => void }).close?.();
    });
  });
}
