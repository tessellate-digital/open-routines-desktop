import { Hono } from 'hono';
import { google } from 'googleapis';
import crypto from 'crypto';
import { config } from '../../main/config';
import { settingsRepository } from '../repositories/settingsRepository';
import { logger } from '../util/logger';

const router = new Hono();

// In-memory state store for CSRF protection (TTL: 10 minutes)
const pendingStates = new Map<string, { expiresAt: number }>();

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const GMAIL_KEYS = [
  'GMAIL_ACCESS_TOKEN',
  'GMAIL_REFRESH_TOKEN',
  'GMAIL_TOKEN_EXPIRY',
  'GMAIL_ACCOUNT_EMAIL',
] as const;

function buildRedirectUri(host: string): string {
  return `http://${host}/api/auth/gmail/callback`;
}

function makeOAuth2Client(host: string) {
  return new google.auth.OAuth2(
    config.gmail.clientId,
    config.gmail.clientSecret,
    buildRedirectUri(host)
  );
}

// Prune expired states
function pruneStates() {
  const now = Date.now();
  for (const [key, val] of pendingStates) {
    if (val.expiresAt < now) {
      pendingStates.delete(key);
    }
  }
}

// Step 1: Generate OAuth URL
router.post('/authorize', (c) => {
  const host = c.req.header('host');
  if (!host) {
    return c.json({ error: 'Could not determine server host' }, 500);
  }

  const oauth2Client = makeOAuth2Client(host);

  pruneStates();
  const state = crypto.randomBytes(16).toString('hex');
  pendingStates.set(state, { expiresAt: Date.now() + 10 * 60 * 1000 });

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state,
    prompt: 'consent',
  });

  return c.json({ url });
});

// Step 2: OAuth callback (browser redirect from Google)
router.get('/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const error = c.req.query('error');

  if (error) {
    logger.error('Gmail OAuth error from Google:', error);
    return c.html(
      '<html><body><h2>Authorization failed</h2><p>Google returned an error. You can close this tab.</p></body></html>'
    );
  }

  if (!code || !state) {
    return c.html(
      '<html><body><h2>Invalid request</h2><p>Missing code or state parameter.</p></body></html>',
      400
    );
  }

  pruneStates();
  if (!pendingStates.has(state)) {
    return c.html(
      '<html><body><h2>Invalid or expired state</h2><p>Please try connecting again.</p></body></html>',
      400
    );
  }
  pendingStates.delete(state);

  const host = c.req.header('host');
  if (!host) {
    return c.html(
      '<html><body><h2>Server error</h2><p>Could not determine server host.</p></body></html>',
      500
    );
  }

  try {
    const oauth2Client = makeOAuth2Client(host);
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      throw new Error('No access token received');
    }

    // Store tokens
    settingsRepository.upsert({
      key: 'GMAIL_ACCESS_TOKEN',
      value: tokens.access_token,
      is_secret: true,
    });

    if (tokens.refresh_token) {
      settingsRepository.upsert({
        key: 'GMAIL_REFRESH_TOKEN',
        value: tokens.refresh_token,
        is_secret: true,
      });
    }

    if (tokens.expiry_date) {
      settingsRepository.upsert({
        key: 'GMAIL_TOKEN_EXPIRY',
        value: String(tokens.expiry_date),
        is_secret: false,
      });
    }

    // Fetch user email via Gmail API (gmail.readonly scope covers this)
    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    const email = profile.data.emailAddress || 'unknown';

    settingsRepository.upsert({
      key: 'GMAIL_ACCOUNT_EMAIL',
      value: email,
      is_secret: false,
    });

    logger.info(`Gmail connected for ${email}`);

    return c.html(
      `<html><body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #111; color: #eee;">
        <div style="text-align: center;">
          <h2 style="margin-bottom: 8px;">Gmail connected</h2>
          <p style="color: #999;">Signed in as <strong>${email}</strong>. You can close this tab.</p>
        </div>
      </body></html>`
    );
  } catch (err) {
    logger.error('Gmail OAuth token exchange failed:', err);
    return c.html(
      '<html><body><h2>Authorization failed</h2><p>Could not exchange code for tokens. You can close this tab and try again.</p></body></html>',
      500
    );
  }
});

// Check connection status
router.get('/status', (c) => {
  const refreshToken = settingsRepository.findByKey('GMAIL_REFRESH_TOKEN');
  if (!refreshToken) {
    return c.json({ connected: false });
  }
  const emailRow = settingsRepository.findByKey('GMAIL_ACCOUNT_EMAIL');
  return c.json({
    connected: true,
    email: emailRow?.value || undefined,
  });
});

// Disconnect Gmail
router.post('/disconnect', (c) => {
  for (const key of GMAIL_KEYS) {
    if (settingsRepository.exists(key)) {
      settingsRepository.delete(key);
    }
  }
  logger.info('Gmail disconnected');
  return c.json({ ok: true });
});

export default router;
