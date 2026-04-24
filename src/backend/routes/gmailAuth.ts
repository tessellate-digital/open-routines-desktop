import { Hono } from 'hono';
import { google } from 'googleapis';
import { CodeChallengeMethod } from 'google-auth-library';
import crypto from 'crypto';
import { config } from '../../main/config';
import { settingsRepository } from '../repositories/settingsRepository';
import { logger } from '../util/logger';

const router = new Hono();

// In-memory state store for CSRF protection + PKCE verifier (TTL: 10 minutes)
const pendingStates = new Map<string, { expiresAt: number; codeVerifier: string }>();

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

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

const APP_LOGO_SVG = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
</svg>`;

const CHECK_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0a8a4e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>`;

const CROSS_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#c83b3b" stroke-width="2.5" stroke-linecap="round">
  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
</svg>`;

function page(title: string, body: string, variant: 'success' | 'error' = 'success'): string {
  const iconSvg = variant === 'success' ? CHECK_SVG : CROSS_SVG;
  const iconBg = variant === 'success' ? 'rgba(10,138,78,0.08)' : 'rgba(200,59,59,0.08)';
  const iconBorder = variant === 'success' ? 'rgba(10,138,78,0.15)' : 'rgba(200,59,59,0.15)';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} – Open Routines</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter Tight', system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: #15151a;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .ambient {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }
    .ambient .blob {
      position: absolute;
      border-radius: 50%;
    }
    .ambient .blob-1 {
      width: 800px;
      height: 600px;
      top: -10%;
      left: -15%;
      background: radial-gradient(ellipse, rgba(79,70,229,0.12) 0%, transparent 65%);
    }
    .ambient .blob-2 {
      width: 700px;
      height: 500px;
      top: 5%;
      right: -15%;
      background: radial-gradient(ellipse, rgba(236,72,153,0.10) 0%, transparent 65%);
    }
    .ambient .blob-3 {
      width: 900px;
      height: 700px;
      bottom: -20%;
      left: 10%;
      background: radial-gradient(ellipse, rgba(79,70,229,0.08) 0%, transparent 65%);
    }
    .card {
      position: relative;
      z-index: 1;
      background: rgba(255, 255, 255, 0.78);
      border: 1px solid rgba(20, 20, 30, 0.08);
      border-radius: 20px;
      padding: 40px 44px 44px;
      text-align: center;
      max-width: 380px;
      width: 90%;
      box-shadow: 0 2px 4px rgba(20,20,30,0.04), 0 8px 24px rgba(20,20,30,0.06), 0 1px 0 rgba(255,255,255,0.7) inset;
      backdrop-filter: blur(12px);
    }
    .logo {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, #4f46e5, #ec4899);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 2px 12px rgba(79,70,229,0.3), 0 1px 0 rgba(255,255,255,0.15) inset;
    }
    .status-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${iconBg};
      border: 1px solid ${iconBorder};
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    h2 {
      font-size: 17px;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
      color: #15151a;
    }
    p {
      font-size: 13.5px;
      color: #6b6b75;
      line-height: 1.55;
    }
    strong { color: #15151a; font-weight: 500; }
    .divider {
      height: 1px;
      background: rgba(20,20,30,0.08);
      margin: 24px 0;
    }
    .app-name {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #9a9aa4;
    }
  </style>
</head>
<body>
  <div class="ambient">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>
  <div class="card">
    <div class="logo">${APP_LOGO_SVG}</div>
    <div class="status-icon">${iconSvg}</div>
    <h2>${title}</h2>
    <p>${body}</p>
    <div class="divider"></div>
    <div class="app-name">Open Routines</div>
  </div>
  <script>setTimeout(function(){window.close()},5000)</script>
</body>
</html>`;
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
  const codeVerifier = generateCodeVerifier();
  pendingStates.set(state, {
    expiresAt: Date.now() + 10 * 60 * 1000,
    codeVerifier,
  });

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state,
    prompt: 'consent',
    code_challenge: generateCodeChallenge(codeVerifier),
    code_challenge_method: CodeChallengeMethod.S256,
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
      page('Authorization failed', 'Google returned an error. You can close this tab.', 'error')
    );
  }

  if (!code || !state) {
    return c.html(
      page('Invalid request', 'Missing code or state parameter.', 'error'),
      400
    );
  }

  pruneStates();
  const pending = pendingStates.get(state);
  if (!pending) {
    return c.html(
      page('Link expired', 'This link is no longer valid. Please try connecting again.', 'error'),
      400
    );
  }
  const { codeVerifier } = pending;
  pendingStates.delete(state);

  const host = c.req.header('host');
  if (!host) {
    return c.html(
      page('Server error', 'Could not determine server host.', 'error'),
      500
    );
  }

  try {
    const oauth2Client = makeOAuth2Client(host);
    const { tokens } = await oauth2Client.getToken({ code, codeVerifier });

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
      is_secret: true,
    });

    logger.info(`Gmail connected for ${email}`);

    return c.html(
      page('Gmail connected', `Signed in as <strong>${email}</strong>.<br>You can close this tab.`)
    );
  } catch (err) {
    logger.error('Gmail OAuth token exchange failed:', err);
    return c.html(
      page('Authorization failed', 'Could not exchange the code for tokens. You can close this tab and try again.', 'error'),
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
