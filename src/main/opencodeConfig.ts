import * as fs from 'fs';
import { config } from './config';
import { db } from '../backend/database';
import type { RoutineRow } from '../backend/types';

interface AgentDefinition {
  description?: string;
  mode?: 'subagent' | 'primary' | 'all';
  /** Plain "provider/model" string as required by the opencode config schema. */
  model?: string;
  temperature?: number;
  prompt?: string;
  permission?: {
    edit?: 'ask' | 'allow' | 'deny';
    bash?: 'ask' | 'allow' | 'deny' | Record<string, 'ask' | 'allow' | 'deny'>;
    webfetch?: 'ask' | 'allow' | 'deny';
    doom_loop?: 'ask' | 'allow' | 'deny';
    external_directory?: 'ask' | 'allow' | 'deny';
  };
}

function buildAgentDefinition(routine: RoutineRow): AgentDefinition {
  const def: AgentDefinition = {
    description: routine.name,
    mode: 'primary',
    prompt: routine.prompt,
  };

  // model must be the plain "provider/model" string — NOT an object
  if (routine.model) {
    def.model = routine.model;
  }

  if (routine.temperature != null) {
    def.temperature = routine.temperature;
  }

  let permissions: AgentDefinition['permission'] = {};
  try {
    permissions = JSON.parse(routine.permissions || '{}') as AgentDefinition['permission'];
  } catch {
    /* ignore malformed */
  }

  if (permissions && Object.keys(permissions).length > 0) {
    def.permission = permissions;
  }

  return def;
}

/**
 * Regenerate <userData>/opencode-bin/opencode.json with agent definitions for all routines.
 * Called after DB init and after any routine create/update/delete.
 */
export function regenerateOpencodeConfig(): void {
  const rows = db.prepare('SELECT * FROM routines ORDER BY created_at ASC').all() as RoutineRow[];

  const agent: Record<string, AgentDefinition> = {};
  for (const row of rows) {
    agent[row.id] = buildAgentDefinition(row);
  }

  const configObj = {
    $schema: 'https://opencode.ai/config.json',
    agent,
  };

  fs.writeFileSync(config.opencodeConfigPath, JSON.stringify(configObj, null, 2) + '\n');
}
