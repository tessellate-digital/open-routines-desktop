import { google } from 'googleapis';
import { config } from '../../main/config';
import { settingsRepository } from '../repositories/settingsRepository';
import { logger } from '../util/logger';

/**
 * Ensure the Gmail access token is fresh before handing it to an agent process.
 * If the token is expired (or will expire within 5 minutes), refresh it and
 * persist the new token to the settings table.
 *
 * Returns true if a valid token is available, false if Gmail is not connected.
 */
export async function ensureFreshGmailToken(): Promise<boolean> {
  const refreshToken = settingsRepository.findByKey('GMAIL_REFRESH_TOKEN');
  if (!refreshToken) {
    return false;
  }

  const expiry = settingsRepository.findByKey('GMAIL_TOKEN_EXPIRY');
  const expiryMs = expiry ? Number(expiry.value) : 0;
  const BUFFER_MS = 5 * 60 * 1000; // refresh 5 minutes before expiry

  if (expiryMs > Date.now() + BUFFER_MS) {
    // Token is still fresh
    return true;
  }

  logger.info('[gmailTokenRefresh] Access token expired or expiring soon, refreshing...');

  const oauth2Client = new google.auth.OAuth2(config.gmail.clientId, config.gmail.clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken.value });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();

    if (credentials.access_token) {
      settingsRepository.upsert({
        key: 'GMAIL_ACCESS_TOKEN',
        value: credentials.access_token,
        is_secret: true,
      });
    }
    if (credentials.expiry_date) {
      settingsRepository.upsert({
        key: 'GMAIL_TOKEN_EXPIRY',
        value: String(credentials.expiry_date),
        is_secret: false,
      });
    }

    logger.info('[gmailTokenRefresh] Token refreshed successfully');
    return true;
  } catch (err) {
    logger.error('[gmailTokenRefresh] Failed to refresh token:', err);
    return false;
  }
}
