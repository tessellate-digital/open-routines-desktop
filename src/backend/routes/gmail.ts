import { Hono } from 'hono';
import { google } from 'googleapis';
import { config } from '../../main/config';
import { settingsRepository } from '../repositories/settingsRepository';
import { logger } from '../util/logger';

const router = new Hono();

/**
 * Build an authenticated Gmail client using stored tokens.
 * Automatically refreshes the access token if expired.
 */
function getGmailClient() {
  const accessToken = settingsRepository.findByKey('GMAIL_ACCESS_TOKEN');
  const refreshToken = settingsRepository.findByKey('GMAIL_REFRESH_TOKEN');
  const expiry = settingsRepository.findByKey('GMAIL_TOKEN_EXPIRY');

  if (!refreshToken) {
    return null;
  }

  const oauth2Client = new google.auth.OAuth2(config.gmail.clientId, config.gmail.clientSecret);

  oauth2Client.setCredentials({
    access_token: accessToken?.value,
    refresh_token: refreshToken.value,
    expiry_date: expiry ? Number(expiry.value) : undefined,
  });

  // Persist refreshed tokens automatically
  oauth2Client.on('tokens', (tokens) => {
    if (tokens.access_token) {
      settingsRepository.upsert({
        key: 'GMAIL_ACCESS_TOKEN',
        value: tokens.access_token,
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
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

// ---------------------------------------------------------------------------
// GET /api/gmail/messages
//
// Query params:
//   q       - Gmail search query (e.g. "from:alice subject:invoice")
//   maxResults - number of messages to return (default 10, max 100)
//   pageToken  - pagination token from previous response
// ---------------------------------------------------------------------------
router.get('/messages', async (c) => {
  const gmail = getGmailClient();
  if (!gmail) {
    return c.json({ error: 'Gmail not connected' }, 401);
  }

  const q = c.req.query('q') || '';
  const maxResults = Math.min(Number(c.req.query('maxResults')) || 10, 100);
  const pageToken = c.req.query('pageToken') || undefined;

  try {
    // List message IDs matching the query
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q,
      maxResults,
      pageToken,
    });

    const messageIds = listRes.data.messages || [];

    if (messageIds.length === 0) {
      return c.json({ messages: [], nextPageToken: null });
    }

    // Fetch each message's metadata + snippet in parallel
    const messages = await Promise.all(
      messageIds.map(async (m) => {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: m.id!,
          format: 'metadata',
          metadataHeaders: ['From', 'To', 'Subject', 'Date'],
        });

        const headers = msg.data.payload?.headers || [];
        const header = (name: string) =>
          headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

        return {
          id: msg.data.id,
          threadId: msg.data.threadId,
          snippet: msg.data.snippet,
          from: header('From'),
          to: header('To'),
          subject: header('Subject'),
          date: header('Date'),
          labelIds: msg.data.labelIds,
        };
      })
    );

    return c.json({
      messages,
      nextPageToken: listRes.data.nextPageToken || null,
    });
  } catch (err) {
    logger.error('Gmail messages.list failed:', err);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

// ---------------------------------------------------------------------------
// GET /api/gmail/messages/:id
//
// Returns the full message content (plain text body preferred, falls back to HTML).
// ---------------------------------------------------------------------------
router.get('/messages/:id', async (c) => {
  const gmail = getGmailClient();
  if (!gmail) {
    return c.json({ error: 'Gmail not connected' }, 401);
  }

  const id = c.req.param('id');

  try {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id,
      format: 'full',
    });

    const headers = msg.data.payload?.headers || [];
    const header = (name: string) =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

    // Extract body — walk MIME parts looking for text/plain, then text/html
    const body = extractBody(msg.data.payload);

    return c.json({
      id: msg.data.id,
      threadId: msg.data.threadId,
      snippet: msg.data.snippet,
      from: header('From'),
      to: header('To'),
      subject: header('Subject'),
      date: header('Date'),
      labelIds: msg.data.labelIds,
      body,
    });
  } catch (err) {
    logger.error('Gmail messages.get failed:', err);
    return c.json({ error: 'Failed to fetch message' }, 500);
  }
});

// ---------------------------------------------------------------------------
// GET /api/gmail/labels
// ---------------------------------------------------------------------------
router.get('/labels', async (c) => {
  const gmail = getGmailClient();
  if (!gmail) {
    return c.json({ error: 'Gmail not connected' }, 401);
  }

  try {
    const res = await gmail.users.labels.list({ userId: 'me' });
    return c.json({ labels: res.data.labels || [] });
  } catch (err) {
    logger.error('Gmail labels.list failed:', err);
    return c.json({ error: 'Failed to fetch labels' }, 500);
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface MimePart {
  mimeType?: string | null;
  body?: { data?: string | null } | null;
  parts?: MimePart[] | null;
}

function extractBody(payload?: MimePart | null): string {
  if (!payload) {
    return '';
  }

  // Try to find text/plain first, then text/html
  const plain = findPart(payload, 'text/plain');
  if (plain) {
    return decodeBase64Url(plain);
  }

  const html = findPart(payload, 'text/html');
  if (html) {
    return decodeBase64Url(html);
  }

  return '';
}

function findPart(part: MimePart, mimeType: string): string | null {
  if (part.mimeType === mimeType && part.body?.data) {
    return part.body.data;
  }
  if (part.parts) {
    for (const child of part.parts) {
      const found = findPart(child, mimeType);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function decodeBase64Url(data: string): string {
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf-8');
}

export default router;
