import { describe, it, expect, vi, beforeEach } from 'vitest';

// better-sqlite3 is a native module compiled for Electron's Node.js version,
// which is incompatible with the Node.js version vitest runs under.
// We therefore mock the `db` module entirely and inspect the SQL calls directly.

const { mockRun, mockGet, mockAll } = vi.hoisted(() => ({
  mockRun: vi.fn().mockReturnValue({ changes: 1 }),
  mockGet: vi.fn(),
  mockAll: vi.fn().mockReturnValue([]),
}));

vi.mock('../database', () => ({
  db: { prepare: vi.fn().mockReturnValue({ run: mockRun, get: mockGet, all: mockAll }) },
}));

import { routinesRepository } from './routinesRepository';
import type { RoutineCreate, RoutineUpdate } from '../types';

function base(): RoutineCreate {
  return {
    name: 'Test routine',
    description: '',
    prompt: 'Do stuff',
    model: '',
    repository: '',
    branch: 'main',
    agent: 'build',
    env_vars: {},
    enabled: true,
    run_mode: 'background',
    permissions: {},
    temperature: null,
  };
}

function fakeRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'id-1',
    name: 'Test routine',
    description: '',
    prompt: 'Do stuff',
    model: '',
    repository: '',
    branch: 'main',
    agent: 'build',
    env_vars: '{}',
    enabled: 1,
    run_mode: 'background',
    permissions: '{}',
    temperature: null,
    last_run_status: null,
    triggers_count: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('routinesRepository – create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue(fakeRow());
  });

  it('passes permissions serialized as JSON to the INSERT statement', () => {
    routinesRepository.create('id-1', {
      ...base(),
      permissions: { edit: 'allow', bash: 'deny' },
    });
    const insertArgs: unknown[] = mockRun.mock.calls[0];
    const permissionsArg = insertArgs.find((a) => typeof a === 'string' && a.includes('"edit"'));
    expect(JSON.parse(permissionsArg as string)).toEqual({ edit: 'allow', bash: 'deny' });
  });

  it('passes null temperature to the INSERT statement', () => {
    routinesRepository.create('id-1', { ...base(), temperature: null });
    const insertArgs: unknown[] = mockRun.mock.calls[0];
    expect(insertArgs).toContain(null);
  });

  it('passes a numeric temperature to the INSERT statement', () => {
    routinesRepository.create('id-1', { ...base(), temperature: 0.7 });
    const insertArgs: unknown[] = mockRun.mock.calls[0];
    expect(insertArgs).toContain(0.7);
  });

  it('passes empty permissions as "{}" to the INSERT statement', () => {
    routinesRepository.create('id-1', { ...base(), permissions: {} });
    const insertArgs: unknown[] = mockRun.mock.calls[0];
    expect(insertArgs).toContain('{}');
  });

  it('returns the row fetched after insert', () => {
    const row = fakeRow({ permissions: '{"edit":"allow"}', temperature: 0.5 });
    mockGet.mockReturnValue(row);
    const result = routinesRepository.create('id-1', base());
    expect(result).toEqual(row);
  });
});

describe('routinesRepository – update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue(fakeRow());
  });

  it('serializes permissions to JSON in the UPDATE statement', () => {
    routinesRepository.update('id-1', { permissions: { webfetch: 'ask' } });
    const updateArgs: unknown[] = mockRun.mock.calls[0];
    const permissionsArg = updateArgs.find(
      (a) => typeof a === 'string' && a.includes('"webfetch"')
    );
    expect(JSON.parse(permissionsArg as string)).toEqual({ webfetch: 'ask' });
  });

  it('includes the temperature value in the UPDATE statement', () => {
    routinesRepository.update('id-1', { temperature: 0.3 });
    const updateArgs: unknown[] = mockRun.mock.calls[0];
    expect(updateArgs).toContain(0.3);
  });

  it('includes null temperature in the UPDATE statement', () => {
    routinesRepository.update('id-1', { temperature: null });
    const updateArgs: unknown[] = mockRun.mock.calls[0];
    expect(updateArgs).toContain(null);
  });

  it('does not include permissions in the UPDATE when not provided', () => {
    routinesRepository.update('id-1', { name: 'New name' } as RoutineUpdate);
    const updateArgs: unknown[] = mockRun.mock.calls[0];
    // No JSON-like string with permission keys should appear
    const hasPermissionsArg = updateArgs.some(
      (a) => typeof a === 'string' && /edit|bash|webfetch|doom_loop/.test(a)
    );
    expect(hasPermissionsArg).toBe(false);
  });

  it('does not include temperature in the UPDATE when not provided', () => {
    routinesRepository.update('id-1', { name: 'New name' } as RoutineUpdate);
    const updateArgs: unknown[] = mockRun.mock.calls[0];
    // Only the id and the updated_at timestamp should be non-string-name values
    const numericArgs = updateArgs.filter((a) => typeof a === 'number');
    expect(numericArgs).toHaveLength(0);
  });

  it('skips the UPDATE entirely and issues no SQL when no fields are provided', () => {
    routinesRepository.update('id-1', {});
    expect(mockRun).not.toHaveBeenCalled();
  });
});
