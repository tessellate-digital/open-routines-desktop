import { Hono } from 'hono';
import { config } from '../../main/config';
import { acquireContext, type ServerContext } from '../services/opencodeServerPool';
import { settingsRepository } from '../repositories/settingsRepository';
import { logger } from '../util/logger';

const router = new Hono();

// Hold a context lease during the OAuth flow so the OpenCode server
// stays alive and can receive the OAuth callback.
let pendingAuthContext: ServerContext | null = null;
let pendingAuthTimer: ReturnType<typeof setTimeout> | null = null;

function releasePendingAuth() {
  if (pendingAuthTimer) {
    clearTimeout(pendingAuthTimer);
    pendingAuthTimer = null;
  }
  if (pendingAuthContext) {
    pendingAuthContext.release();
    pendingAuthContext = null;
  }
}

function buildGlobalEnv(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };
  const rows = settingsRepository.findAll();
  for (const row of rows) {
    env[row.key] = row.value;
  }
  return env;
}

router.get('/status', async (c) => {
  let context;
  try {
    const env = buildGlobalEnv();
    context = await acquireContext({ cwd: config.workspacesDir, env });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = context.client as any;
    const result = await client.mcp.status();
    const notion = result?.data?.notion;
    if (!notion) {
      return c.json({ status: 'not_configured' });
    }
    if (notion.status === 'connected' && pendingAuthContext) {
      releasePendingAuth();
    }
    return c.json(notion);
  } catch (err) {
    logger.error('Notion MCP status check failed:', err);
    return c.json({ status: 'failed', error: String(err) }, 500);
  } finally {
    context?.release();
  }
});

router.post('/authenticate', async (c) => {
  releasePendingAuth();

  try {
    const env = buildGlobalEnv();
    const context = await acquireContext({ cwd: config.workspacesDir, env });

    // Keep the context alive so the server can handle the OAuth callback
    pendingAuthContext = context;
    pendingAuthTimer = setTimeout(releasePendingAuth, 5 * 60 * 1000);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = context.client as any;

    // Fire authenticate in the background — it blocks until the OAuth
    // callback is received by the OpenCode server.  The frontend polls
    // /status to detect completion.
    client.mcp.auth
      .authenticate({ path: { name: 'notion' } })
      .then(() => {
        logger.info('Notion MCP authentication completed');
        releasePendingAuth();
      })
      .catch((err: unknown) => {
        logger.error('Notion MCP authentication failed:', err);
        releasePendingAuth();
      });

    // Return the OpenCode server's base URL so the frontend can construct
    // the auth page URL, but the server opens the browser itself.
    return c.json({ ok: true });
  } catch (err) {
    releasePendingAuth();
    logger.error('Notion MCP auth failed:', err);
    return c.json({ error: String(err) }, 500);
  }
});

router.post('/disconnect', async (c) => {
  releasePendingAuth();
  let context;
  try {
    const env = buildGlobalEnv();
    context = await acquireContext({ cwd: config.workspacesDir, env });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = context.client as any;
    await client.mcp.auth.remove({ path: { name: 'notion' } });
    return c.json({ ok: true });
  } catch (err) {
    logger.error('Notion MCP disconnect failed:', err);
    return c.json({ error: String(err) }, 500);
  } finally {
    context?.release();
  }
});

export default router;
