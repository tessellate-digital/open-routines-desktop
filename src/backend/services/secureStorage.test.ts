import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockIsEncryptionAvailable, mockEncryptString, mockDecryptString } = vi.hoisted(() => ({
  mockIsEncryptionAvailable: vi.fn().mockReturnValue(true),
  mockEncryptString: vi.fn(),
  mockDecryptString: vi.fn(),
}));

vi.mock('electron', () => ({
  safeStorage: {
    isEncryptionAvailable: mockIsEncryptionAvailable,
    encryptString: mockEncryptString,
    decryptString: mockDecryptString,
  },
}));

vi.mock('../util/logger', () => ({
  logger: { warn: vi.fn(), info: vi.fn(), debug: vi.fn(), error: vi.fn() },
}));

import { encryptIfSecret, decryptIfSecret } from './secureStorage';

// ── encryptIfSecret ───────────────────────────────────────────────────────────

describe('encryptIfSecret', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsEncryptionAvailable.mockReturnValue(true);
  });

  it('returns the value unchanged when isSecret is false', () => {
    const result = encryptIfSecret('my-api-key', false);
    expect(result).toBe('my-api-key');
    expect(mockEncryptString).not.toHaveBeenCalled();
  });

  it('encrypts and returns base64 when isSecret is true and encryption is available', () => {
    const fakeEncrypted = Buffer.from('encrypted-bytes');
    mockEncryptString.mockReturnValue(fakeEncrypted);

    const result = encryptIfSecret('my-api-key', true);

    expect(mockEncryptString).toHaveBeenCalledWith('my-api-key');
    expect(result).toBe(fakeEncrypted.toString('base64'));
  });

  it('returns plaintext when isSecret is true but encryption is unavailable', () => {
    mockIsEncryptionAvailable.mockReturnValue(false);

    const result = encryptIfSecret('my-api-key', true);

    expect(result).toBe('my-api-key');
    expect(mockEncryptString).not.toHaveBeenCalled();
  });
});

// ── decryptIfSecret ───────────────────────────────────────────────────────────

describe('decryptIfSecret', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsEncryptionAvailable.mockReturnValue(true);
  });

  it('returns the value unchanged when isSecret is false', () => {
    const result = decryptIfSecret('some-value', false);
    expect(result).toBe('some-value');
    expect(mockDecryptString).not.toHaveBeenCalled();
  });

  it('decrypts base64-encoded value when isSecret is true and encryption is available', () => {
    mockDecryptString.mockReturnValue('my-api-key');
    const base64 = Buffer.from('encrypted-bytes').toString('base64');

    const result = decryptIfSecret(base64, true);

    expect(mockDecryptString).toHaveBeenCalledWith(Buffer.from(base64, 'base64'));
    expect(result).toBe('my-api-key');
  });

  it('returns plaintext when isSecret is true but encryption is unavailable', () => {
    mockIsEncryptionAvailable.mockReturnValue(false);

    const result = decryptIfSecret('my-api-key', true);

    expect(result).toBe('my-api-key');
    expect(mockDecryptString).not.toHaveBeenCalled();
  });

  it('falls back to plaintext when decryption fails (pre-migration stored value)', () => {
    mockDecryptString.mockImplementation(() => {
      throw new Error('decryption failed');
    });

    const result = decryptIfSecret('managed-by-sdk', true);

    expect(result).toBe('managed-by-sdk');
  });
});
