import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import type { RoutineRow } from '../backend/types';

// vi.hoisted runs before module initialization — required so `mockAll` is
// defined when the vi.mock factory for '../backend/database' executes.
const { mockAll } = vi.hoisted(() => ({
  mockAll: vi.fn<[], RoutineRow[]>(),
}));

vi.mock('fs', () => ({ writeFileSync: vi.fn() }));
vi.mock('./config', () => ({ config: { opencodeConfigPath: '/tmp/opencode.json' } }));
vi.mock('../backend/database', () => ({
  db: { prepare: () => ({ all: mockAll }) },
}));

import { regenerateOpencodeConfig } from './opencodeConfig';

// ── helpers ──────────────────────────────────────────────────────────────────

function makeRow(overrides: Partial<RoutineRow> = {}): RoutineRow {
  return {
    id: 'r1',
    name: 'My Routine',
    description: '',
    prompt: 'Do something',
    model: '',
    repository: '',
    branch: 'main',
    agent: 'build',
    env_vars: '{}',
    enabled: 1,
    run_mode: 'background',
    permissions: '{}',
    connected_apps: '{}',
    temperature: null,
    last_run_status: null,
    triggers_count: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

function getWrittenConfig(): Record<string, unknown> {
  const calls = (fs.writeFileSync as ReturnType<typeof vi.fn>).mock.calls;
  return JSON.parse(calls[calls.length - 1][1] as string);
}

function getAgent(id = 'r1'): Record<string, unknown> {
  return (getWrittenConfig().agent as Record<string, unknown>)[id] as Record<string, unknown>;
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('regenerateOpencodeConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAll.mockReturnValue([]);
  });

  it('writes to the configured path', () => {
    regenerateOpencodeConfig();
    expect(fs.writeFileSync).toHaveBeenCalledWith('/tmp/opencode.json', expect.any(String));
  });

  it('includes the $schema field', () => {
    regenerateOpencodeConfig();
    expect(getWrittenConfig().$schema).toBe('https://opencode.ai/config.json');
  });

  it('writes an empty agent map when there are no routines', () => {
    regenerateOpencodeConfig();
    expect(getWrittenConfig().agent).toEqual({});
  });

  it('keys each agent entry by routine id', () => {
    mockAll.mockReturnValue([makeRow({ id: 'abc-123' })]);
    regenerateOpencodeConfig();
    expect(getWrittenConfig().agent).toHaveProperty('abc-123');
  });

  it('generates entries for multiple routines', () => {
    mockAll.mockReturnValue([makeRow({ id: 'r1' }), makeRow({ id: 'r2' })]);
    regenerateOpencodeConfig();
    const agent = getWrittenConfig().agent as Record<string, unknown>;
    expect(Object.keys(agent)).toHaveLength(2);
    expect(agent).toHaveProperty('r1');
    expect(agent).toHaveProperty('r2');
  });

  describe('agent definition fields', () => {
    it('sets description from routine name and mode to primary', () => {
      mockAll.mockReturnValue([makeRow({ name: 'Daily sync' })]);
      regenerateOpencodeConfig();
      expect(getAgent()).toMatchObject({ description: 'Daily sync', mode: 'primary' });
    });

    it('starts the prompt with the routine prompt', () => {
      mockAll.mockReturnValue([makeRow({ prompt: 'Run the test suite' })]);
      regenerateOpencodeConfig();
      expect(getAgent().prompt as string).toContain('Run the test suite');
    });

    it('includes model as a plain provider/model string when set', () => {
      mockAll.mockReturnValue([makeRow({ model: 'anthropic/claude-sonnet-4-6' })]);
      regenerateOpencodeConfig();
      expect(getAgent().model).toBe('anthropic/claude-sonnet-4-6');
    });

    it('omits model when the model field is empty', () => {
      mockAll.mockReturnValue([makeRow({ model: '' })]);
      regenerateOpencodeConfig();
      expect(getAgent()).not.toHaveProperty('model');
    });

    it('includes temperature when set', () => {
      mockAll.mockReturnValue([makeRow({ temperature: 0.7 })]);
      regenerateOpencodeConfig();
      expect(getAgent().temperature).toBe(0.7);
    });

    it('omits temperature when null', () => {
      mockAll.mockReturnValue([makeRow({ temperature: null })]);
      regenerateOpencodeConfig();
      expect(getAgent()).not.toHaveProperty('temperature');
    });
  });

  describe('permissions', () => {
    it('includes permission block when permissions are set', () => {
      mockAll.mockReturnValue([makeRow({ permissions: '{"edit":"allow","bash":"deny"}' })]);
      regenerateOpencodeConfig();
      expect(getAgent().permission).toMatchObject({ edit: 'allow', bash: 'deny' });
    });

    it('still injects external_directory: "allow" when permissions object is empty', () => {
      mockAll.mockReturnValue([makeRow({ permissions: '{}' })]);
      regenerateOpencodeConfig();
      expect(getAgent().permission).toEqual({ external_directory: 'allow' });
    });

    it('still injects external_directory: "allow" when permissions JSON is malformed', () => {
      mockAll.mockReturnValue([makeRow({ permissions: 'not-valid-json' })]);
      regenerateOpencodeConfig();
      expect(getAgent().permission).toEqual({ external_directory: 'allow' });
    });

    it('always injects external_directory: "allow" when other permissions exist', () => {
      mockAll.mockReturnValue([makeRow({ permissions: '{"bash":"deny"}' })]);
      regenerateOpencodeConfig();
      expect((getAgent().permission as Record<string, unknown>).external_directory).toBe('allow');
    });

    it('skips external_directory from user-provided permissions (it is always injected)', () => {
      // User sets external_directory: "deny" — it must be overridden to "allow"
      mockAll.mockReturnValue([
        makeRow({ permissions: '{"bash":"allow","external_directory":"deny"}' }),
      ]);
      regenerateOpencodeConfig();
      expect((getAgent().permission as Record<string, unknown>).external_directory).toBe('allow');
    });

    it('skips doom_loop from the serialized output (it is a managed key)', () => {
      mockAll.mockReturnValue([makeRow({ permissions: '{"doom_loop":"ask","bash":"allow"}' })]);
      regenerateOpencodeConfig();
      expect(getAgent().permission as Record<string, unknown>).not.toHaveProperty('doom_loop');
    });

    it('flattens a wildcard-only object { "*": "deny" } to the string "deny"', () => {
      // webfetch is not a granular key, so { "*": "deny" } → "deny"
      mockAll.mockReturnValue([makeRow({ permissions: '{"webfetch":{"*":"deny"}}' })]);
      regenerateOpencodeConfig();
      expect((getAgent().permission as Record<string, unknown>).webfetch).toBe('deny');
    });

    it('keeps object format for granular keys with specific pattern rules', () => {
      // bash is a granular key with a non-"*" rule — object format preserved
      mockAll.mockReturnValue([makeRow({ permissions: '{"bash":{"npm*":"allow","rm*":"deny"}}' })]);
      regenerateOpencodeConfig();
      expect((getAgent().permission as Record<string, unknown>).bash).toEqual({
        'npm*': 'allow',
        'rm*': 'deny',
      });
    });

    it('flattens a granular key with only a "*" default to a string', () => {
      // bash with only "*" key — no specific rules, flatten to string
      mockAll.mockReturnValue([makeRow({ permissions: '{"bash":{"*":"ask"}}' })]);
      regenerateOpencodeConfig();
      expect((getAgent().permission as Record<string, unknown>).bash).toBe('ask');
    });
  });

  describe('prompt injection', () => {
    it('appends the denied-tool graceful-continuation instruction to the prompt', () => {
      mockAll.mockReturnValue([makeRow({ prompt: 'Run the test suite' })]);
      regenerateOpencodeConfig();
      expect(getAgent().prompt as string).toContain(
        'If a tool call is denied or fails due to a permission rule'
      );
    });
  });

  describe('Notion MCP server', () => {
    it('always includes the notion MCP server in the config', () => {
      mockAll.mockReturnValue([]);
      regenerateOpencodeConfig();
      const mcp = getWrittenConfig().mcp as Record<string, unknown>;
      expect(mcp).toHaveProperty('notion');
    });

    it('notion MCP entry uses the remote type and correct URL', () => {
      mockAll.mockReturnValue([]);
      regenerateOpencodeConfig();
      const mcp = getWrittenConfig().mcp as Record<string, unknown>;
      expect(mcp.notion).toMatchObject({ type: 'remote', url: 'https://mcp.notion.com/mcp' });
    });
  });

  describe('Notion connected-app scoping', () => {
    function getPermission(id = 'r1'): Record<string, unknown> {
      return (getAgent(id).permission ?? {}) as Record<string, unknown>;
    }

    it('grants mcp__notion: allow in permission block when connected_apps.notion is true', () => {
      mockAll.mockReturnValue([makeRow({ connected_apps: '{"notion":true}' })]);
      regenerateOpencodeConfig();
      expect(getPermission()).toMatchObject({ mcp__notion: 'allow' });
    });

    it('does not grant mcp__notion when connected_apps.notion is false', () => {
      mockAll.mockReturnValue([makeRow({ connected_apps: '{"notion":false}' })]);
      regenerateOpencodeConfig();
      expect(getPermission()).not.toHaveProperty('mcp__notion');
    });

    it('does not grant mcp__notion when connected_apps is empty', () => {
      mockAll.mockReturnValue([makeRow({ connected_apps: '{}' })]);
      regenerateOpencodeConfig();
      expect(getPermission()).not.toHaveProperty('mcp__notion');
    });

    it('grants mcp__notion on one routine but not another', () => {
      mockAll.mockReturnValue([
        makeRow({ id: 'r1', connected_apps: '{"notion":true}' }),
        makeRow({ id: 'r2', connected_apps: '{}' }),
      ]);
      regenerateOpencodeConfig();
      const agent = getWrittenConfig().agent as Record<string, Record<string, unknown>>;
      expect(agent.r1.permission as Record<string, unknown>).toHaveProperty('mcp__notion', 'allow');
      expect((agent.r2.permission as Record<string, unknown>) ?? {}).not.toHaveProperty(
        'mcp__notion'
      );
    });
  });
});
