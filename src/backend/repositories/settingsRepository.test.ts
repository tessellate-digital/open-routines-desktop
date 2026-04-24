import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockRun, mockGet, mockAll, mockPrepare, mockEncryptIfSecret, mockDecryptIfSecret } =
  vi.hoisted(() => {
    const mockRun = vi.fn().mockReturnValue({ changes: 1 });
    const mockGet = vi.fn();
    const mockAll = vi.fn().mockReturnValue([]);
    const mockPrepare = vi.fn().mockReturnValue({ run: mockRun, get: mockGet, all: mockAll });
    return {
      mockRun,
      mockGet,
      mockAll,
      mockPrepare,
      mockEncryptIfSecret: vi.fn((value: string) => value),
      mockDecryptIfSecret: vi.fn((value: string) => value),
    };
  });

vi.mock('../database', () => ({
  db: { prepare: mockPrepare },
}));

vi.mock('../services/secureStorage', () => ({
  encryptIfSecret: mockEncryptIfSecret,
  decryptIfSecret: mockDecryptIfSecret,
}));

import { settingsRepository } from './settingsRepository';
import type { SettingRow } from '../types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fakeRow(overrides: Partial<SettingRow> = {}): SettingRow {
  return {
    key: 'ANTHROPIC_API_KEY',
    value: 'sk-plaintext',
    is_secret: 1,
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

// ── upsert ────────────────────────────────────────────────────────────────────

describe('settingsRepository – upsert', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrepare.mockReturnValue({ run: mockRun, get: mockGet, all: mockAll });
    mockGet.mockReturnValue(fakeRow());
    mockEncryptIfSecret.mockImplementation((value: string) => value);
  });

  it('calls encryptIfSecret with the value and is_secret flag', () => {
    settingsRepository.upsert({ key: 'ANTHROPIC_API_KEY', value: 'sk-ant-123', is_secret: true });

    expect(mockEncryptIfSecret).toHaveBeenCalledWith('sk-ant-123', true);
  });

  it('passes the encrypted value to the INSERT statement', () => {
    mockEncryptIfSecret.mockReturnValue('ENCRYPTED_BASE64');

    settingsRepository.upsert({ key: 'ANTHROPIC_API_KEY', value: 'sk-ant-123', is_secret: true });

    const insertArgs: unknown[] = mockRun.mock.calls[0];
    expect(insertArgs).toContain('ENCRYPTED_BASE64');
    expect(insertArgs).not.toContain('sk-ant-123');
  });

  it('passes the original value when is_secret is false', () => {
    settingsRepository.upsert({ key: 'LOG_LEVEL', value: 'debug', is_secret: false });

    expect(mockEncryptIfSecret).toHaveBeenCalledWith('debug', false);
    const insertArgs: unknown[] = mockRun.mock.calls[0];
    expect(insertArgs).toContain('debug');
  });

  it('stores is_secret as 1 for secret values', () => {
    settingsRepository.upsert({ key: 'ANTHROPIC_API_KEY', value: 'sk-ant-123', is_secret: true });

    const insertArgs: unknown[] = mockRun.mock.calls[0];
    expect(insertArgs).toContain(1);
  });

  it('stores is_secret as 0 for non-secret values', () => {
    settingsRepository.upsert({ key: 'LOG_LEVEL', value: 'debug', is_secret: false });

    const insertArgs: unknown[] = mockRun.mock.calls[0];
    expect(insertArgs).toContain(0);
  });
});

// ── findByKey ─────────────────────────────────────────────────────────────────

describe('settingsRepository – findByKey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrepare.mockReturnValue({ run: mockRun, get: mockGet, all: mockAll });
    mockDecryptIfSecret.mockImplementation((value: string) => value);
  });

  it('returns undefined when row is not found', () => {
    mockGet.mockReturnValue(undefined);

    const result = settingsRepository.findByKey('MISSING_KEY');

    expect(result).toBeUndefined();
    expect(mockDecryptIfSecret).not.toHaveBeenCalled();
  });

  it('calls decryptIfSecret with the stored value and is_secret flag', () => {
    mockGet.mockReturnValue(fakeRow({ value: 'ENCRYPTED_BASE64', is_secret: 1 }));

    settingsRepository.findByKey('ANTHROPIC_API_KEY');

    expect(mockDecryptIfSecret).toHaveBeenCalledWith('ENCRYPTED_BASE64', true);
  });

  it('returns the decrypted value in the row', () => {
    mockGet.mockReturnValue(fakeRow({ value: 'ENCRYPTED_BASE64', is_secret: 1 }));
    mockDecryptIfSecret.mockReturnValue('sk-ant-123');

    const result = settingsRepository.findByKey('ANTHROPIC_API_KEY');

    expect(result?.value).toBe('sk-ant-123');
  });

  it('passes non-secret values through decryptIfSecret with isSecret=false', () => {
    mockGet.mockReturnValue(fakeRow({ key: 'LOG_LEVEL', value: 'debug', is_secret: 0 }));

    settingsRepository.findByKey('LOG_LEVEL');

    expect(mockDecryptIfSecret).toHaveBeenCalledWith('debug', false);
  });
});

// ── findAll ───────────────────────────────────────────────────────────────────

describe('settingsRepository – findAll', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrepare.mockReturnValue({ run: mockRun, get: mockGet, all: mockAll });
    mockDecryptIfSecret.mockImplementation((value: string) => value);
  });

  it('returns an empty array when no settings exist', () => {
    mockAll.mockReturnValue([]);

    const result = settingsRepository.findAll();

    expect(result).toEqual([]);
  });

  it('decrypts all secret rows', () => {
    mockAll.mockReturnValue([
      fakeRow({ key: 'ANTHROPIC_API_KEY', value: 'ENC_1', is_secret: 1 }),
      fakeRow({ key: 'OPENAI_API_KEY', value: 'ENC_2', is_secret: 1 }),
    ]);
    mockDecryptIfSecret.mockReturnValueOnce('sk-ant-123').mockReturnValueOnce('sk-openai-456');

    const result = settingsRepository.findAll();

    expect(result[0].value).toBe('sk-ant-123');
    expect(result[1].value).toBe('sk-openai-456');
  });

  it('passes non-secret values through without transformation', () => {
    mockAll.mockReturnValue([fakeRow({ key: 'LOG_LEVEL', value: 'debug', is_secret: 0 })]);
    mockDecryptIfSecret.mockReturnValue('debug');

    const result = settingsRepository.findAll();

    expect(result[0].value).toBe('debug');
    expect(mockDecryptIfSecret).toHaveBeenCalledWith('debug', false);
  });

  it('queries with a filter that excludes internal _-prefixed keys', () => {
    settingsRepository.findAll();

    const prepareArg: string = mockPrepare.mock.calls.at(-1)?.[0] as string;
    expect(prepareArg).toMatch(/NOT LIKE/i);
  });
});
