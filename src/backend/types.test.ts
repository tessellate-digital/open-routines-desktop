import { describe, it, expect } from 'vitest';
import { RoutineCreateSchema, RoutineUpdateSchema } from './types';

const base = { name: 'My Routine', prompt: 'Do something' };

// ── RoutineCreateSchema ───────────────────────────────────────────────────────

describe('RoutineCreateSchema – permissions', () => {
  it('defaults to empty object when not provided', () => {
    expect(RoutineCreateSchema.parse(base).permissions).toEqual({});
  });

  it('accepts all valid permission levels', () => {
    const result = RoutineCreateSchema.parse({
      ...base,
      permissions: { edit: 'allow', bash: 'deny', webfetch: 'ask' },
    });
    expect(result.permissions).toEqual({ edit: 'allow', bash: 'deny', webfetch: 'ask' });
  });

  it('accepts doom_loop permission', () => {
    const result = RoutineCreateSchema.parse({ ...base, permissions: { doom_loop: 'allow' } });
    expect(result.permissions.doom_loop).toBe('allow');
  });

  it('accepts external_directory permission', () => {
    const result = RoutineCreateSchema.parse({
      ...base,
      permissions: { external_directory: 'ask' },
    });
    expect(result.permissions.external_directory).toBe('ask');
  });

  it('accepts bash as a record mapping patterns to levels', () => {
    const result = RoutineCreateSchema.parse({
      ...base,
      permissions: { bash: { 'npm*': 'allow', 'rm*': 'deny' } },
    });
    expect(result.permissions.bash).toEqual({ 'npm*': 'allow', 'rm*': 'deny' });
  });

  it('rejects invalid permission levels', () => {
    expect(() => RoutineCreateSchema.parse({ ...base, permissions: { edit: 'maybe' } })).toThrow();
  });
});

describe('RoutineCreateSchema – temperature', () => {
  it('defaults to null when not provided', () => {
    expect(RoutineCreateSchema.parse(base).temperature).toBeNull();
  });

  it('accepts null explicitly', () => {
    expect(RoutineCreateSchema.parse({ ...base, temperature: null }).temperature).toBeNull();
  });

  it.each([0, 0.1, 0.5, 1])('accepts temperature %s', (value) => {
    expect(RoutineCreateSchema.parse({ ...base, temperature: value }).temperature).toBe(value);
  });

  it('rejects values above 1', () => {
    expect(() => RoutineCreateSchema.parse({ ...base, temperature: 1.1 })).toThrow();
  });

  it('rejects values below 0', () => {
    expect(() => RoutineCreateSchema.parse({ ...base, temperature: -0.1 })).toThrow();
  });
});

// ── RoutineUpdateSchema ───────────────────────────────────────────────────────

describe('RoutineUpdateSchema – permissions', () => {
  it('accepts a partial permissions object', () => {
    const result = RoutineUpdateSchema.parse({ permissions: { edit: 'deny' } });
    expect(result.permissions?.edit).toBe('deny');
  });

  it('accepts an empty permissions object', () => {
    const result = RoutineUpdateSchema.parse({ permissions: {} });
    expect(result.permissions).toEqual({});
  });

  it('is optional — omitting permissions leaves it undefined', () => {
    const result = RoutineUpdateSchema.parse({ name: 'New name' });
    expect(result.permissions).toBeUndefined();
  });
});

describe('RoutineUpdateSchema – temperature', () => {
  it('accepts null', () => {
    expect(RoutineUpdateSchema.parse({ temperature: null }).temperature).toBeNull();
  });

  it('accepts a value in range', () => {
    expect(RoutineUpdateSchema.parse({ temperature: 0.3 }).temperature).toBe(0.3);
  });

  it('is optional — omitting temperature leaves it undefined', () => {
    expect(RoutineUpdateSchema.parse({}).temperature).toBeUndefined();
  });

  it('rejects out-of-range values', () => {
    expect(() => RoutineUpdateSchema.parse({ temperature: 2 })).toThrow();
  });
});
