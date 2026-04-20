import { describe, it, expect } from 'vitest';
import { flattenProviderModels } from './modelUtils';

describe('flattenProviderModels', () => {
  it('returns an empty array for no providers', () => {
    expect(flattenProviderModels([])).toEqual([]);
  });

  it('flattens a single provider into providerID/modelID strings', () => {
    const result = flattenProviderModels([
      { id: 'anthropic', models: { 'claude-sonnet-4-6': {}, 'claude-haiku-4-5': {} } },
    ]);
    expect(result).toContain('anthropic/claude-sonnet-4-6');
    expect(result).toContain('anthropic/claude-haiku-4-5');
  });

  it('flattens multiple providers', () => {
    const result = flattenProviderModels([
      { id: 'anthropic', models: { 'claude-sonnet-4-6': {} } },
      { id: 'openai', models: { 'gpt-4o': {} } },
    ]);
    expect(result).toContain('anthropic/claude-sonnet-4-6');
    expect(result).toContain('openai/gpt-4o');
    expect(result).toHaveLength(2);
  });

  it('returns results sorted alphabetically', () => {
    const result = flattenProviderModels([
      { id: 'openai', models: { 'gpt-4o': {} } },
      { id: 'anthropic', models: { 'claude-sonnet-4-6': {} } },
    ]);
    expect(result).toEqual(['anthropic/claude-sonnet-4-6', 'openai/gpt-4o']);
  });

  it('handles a provider with no models', () => {
    const result = flattenProviderModels([{ id: 'anthropic', models: {} }]);
    expect(result).toEqual([]);
  });
});
