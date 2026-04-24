import { safeStorage } from 'electron';
import { logger } from '../util/logger';

/**
 * Encrypt a value if it's marked as secret and OS-level encryption is available.
 * Returns base64-encoded ciphertext for secrets, plaintext otherwise.
 */
export function encryptIfSecret(value: string, isSecret: boolean): string {
  if (!isSecret) {
    return value;
  }

  if (!safeStorage.isEncryptionAvailable()) {
    logger.warn('safeStorage encryption not available — storing secret in plaintext');
    return value;
  }

  const encrypted = safeStorage.encryptString(value);
  return encrypted.toString('base64');
}

/**
 * Decrypt a value if it's marked as secret and OS-level encryption is available.
 * Handles graceful fallback for values that were stored before encryption was enabled.
 */
export function decryptIfSecret(value: string, isSecret: boolean): string {
  if (!isSecret) {
    return value;
  }

  if (!safeStorage.isEncryptionAvailable()) {
    return value;
  }

  try {
    const buffer = Buffer.from(value, 'base64');
    return safeStorage.decryptString(buffer);
  } catch {
    // Value was likely stored as plaintext before encryption was enabled
    return value;
  }
}
