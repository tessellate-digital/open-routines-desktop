import * as fs from 'fs';
import { config } from './config';
import { db } from '../backend/database';
import type { RoutineRow } from '../backend/types';
import { logger } from '../backend/util/logger';

interface AgentDefinition {
  description?: string;
  mode?: 'subagent' | 'primary' | 'all';
  /** Plain "provider/model" string as required by the opencode config schema. */
  model?: string;
  temperature?: number;
  prompt?: string;
  permission?: Record<string, 'ask' | 'allow' | 'deny' | Record<string, 'ask' | 'allow' | 'deny'>>;
}

function buildAgentDefinition(routine: RoutineRow): AgentDefinition {
  const def: AgentDefinition = {
    description: routine.name,
    mode: 'primary',
    prompt: [
      routine.prompt,
      '',
      'If a tool call is denied or fails due to a permission rule, continue working with the information you do have. Do not stop or abort — complete the task to the best of your ability with the tools and data available to you.',
    ].join('\n'),
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
  } catch (e) {
    logger.warn(`[opencodeConfig] Failed to parse permissions for routine ${routine.id}:`, e);
  }

  logger.debug(`[opencodeConfig] Routine ${routine.id} raw permissions:`, routine.permissions);
  logger.debug(
    `[opencodeConfig] Routine ${routine.id} parsed permissions:`,
    JSON.stringify(permissions)
  );

  // Permissions come in two flavours:
  //   - Flat (webfetch, websearch, …): always a simple "allow"|"ask"|"deny" string.
  //   - Granular (read, edit, bash): can be a simple string OR an object with
  //     pattern rules, e.g. { "*": "deny", "~/projects/**": "allow" }.
  //     When the object only contains a "*" key (no specific rules), flatten it
  //     back to a simple string so OpenCode gets the cleanest config possible.
  const GRANULAR_KEYS = new Set(['read', 'edit', 'bash']);
  const MANAGED_KEYS = new Set(['external_directory', 'doom_loop']);

  if (permissions && Object.keys(permissions).length > 0) {
    const serialized: Record<
      string,
      'ask' | 'allow' | 'deny' | Record<string, 'ask' | 'allow' | 'deny'>
    > = {};
    for (const [key, val] of Object.entries(permissions)) {
      if (MANAGED_KEYS.has(key)) {
        continue;
      }

      if (typeof val === 'string') {
        serialized[key] = val;
      } else if (typeof val === 'object' && val !== null) {
        const entries = Object.entries(val);
        const hasRules = entries.some(([k]) => k !== '*');

        if (GRANULAR_KEYS.has(key) && hasRules) {
          // Has specific pattern rules — keep the object format
          serialized[key] = val as Record<string, 'ask' | 'allow' | 'deny'>;
        } else {
          // Either a flat-only key, or a granular key with only a "*" default — flatten
          serialized[key] =
            ((val as Record<string, string>)['*'] as 'ask' | 'allow' | 'deny') ?? 'ask';
        }
      }
    }
    // Implicit read access: if edit allows a path, read should too.
    // A routine granted write access to a path will almost always need to read it first.
    const editPerm = serialized.edit;
    if (editPerm !== undefined) {
      const editAllowPatterns: string[] =
        editPerm === 'allow'
          ? ['*']
          : typeof editPerm === 'object'
            ? Object.entries(editPerm)
                .filter(([, lvl]) => lvl === 'allow')
                .map(([pat]) => pat)
            : [];

      for (const pattern of editAllowPatterns) {
        const currentRead = serialized.read;
        if (pattern === '*') {
          // Edit is globally allowed — read should be too
          if (!currentRead || currentRead === 'deny' || currentRead === 'ask') {
            serialized.read = 'allow';
          }
        } else {
          // Specific pattern — ensure read allows it
          if (!currentRead || currentRead === 'ask' || currentRead === 'deny') {
            serialized.read = {
              '*': (currentRead as 'ask' | 'allow' | 'deny') ?? 'ask',
              [pattern]: 'allow',
            };
          } else if (currentRead === 'allow') {
            // Already globally allowed — nothing needed
          } else if (typeof currentRead === 'object') {
            (currentRead as Record<string, 'ask' | 'allow' | 'deny'>)[pattern] = 'allow';
          }
        }
      }
    }

    // If Gmail is enabled, grant access to the Gmail API and skill
    let connectedApps: Record<string, boolean> = {};
    try {
      connectedApps = JSON.parse(routine.connected_apps || '{}');
    } catch {
      /* ignore */
    }

    if (connectedApps.gmail) {
      // Allow bash curl for authenticated Gmail API calls (WebFetch can't set headers)
      const currentBash = serialized.bash;
      if (typeof currentBash === 'string' && currentBash !== 'allow') {
        serialized.bash = { '*': currentBash, 'curl *': 'allow' };
      } else if (typeof currentBash === 'object' && currentBash !== null) {
        serialized.bash = { ...currentBash, 'curl *': 'allow' };
      }

      // Allow the gmail skill so the agent can load API docs on demand
      serialized['skill'] = { '*': 'deny', gmail: 'allow' };
    }

    serialized['external_directory'] = 'allow';
    def.permission = serialized;
    logger.debug(
      `[opencodeConfig] Routine ${routine.id} serialized permissions:`,
      JSON.stringify(serialized)
    );
  } else {
    def.permission = { external_directory: 'allow' };
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

  const configJson = JSON.stringify(configObj, null, 2) + '\n';
  logger.debug(`[opencodeConfig] Writing config to ${config.opencodeConfigPath}`);
  logger.debug(`[opencodeConfig] Full config:`, configJson);
  fs.writeFileSync(config.opencodeConfigPath, configJson);
}
