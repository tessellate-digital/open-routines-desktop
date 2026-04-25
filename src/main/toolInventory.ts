import { execFile } from 'child_process';
import { promisify } from 'util';
import { logger } from '../backend/util/logger';

const execFileAsync = promisify(execFile);

const TOOLS_TO_CHECK = [
  'python',
  'python3',
  'node',
  'npm',
  'npx',
  'uv',
  'bun',
  'deno',
  'ruby',
  'go',
  'cargo',
  'rustc',
  'docker',
  'curl',
  'wget',
  'jq',
  'sqlite3',
  'git',
  'make',
  'pip',
  'pip3',
  'pipx',
  'java',
  'mvn',
];

interface ToolInventory {
  installed: string[];
  missing: string[];
}

let cache: ToolInventory | null = null;

async function checkTool(name: string): Promise<boolean> {
  try {
    await execFileAsync('which', [name], { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

export async function detectTools(): Promise<void> {
  const results = await Promise.all(
    TOOLS_TO_CHECK.map(async (tool) => ({ tool, found: await checkTool(tool) }))
  );
  const installed = results.filter((r) => r.found).map((r) => r.tool);
  const missing = results.filter((r) => !r.found).map((r) => r.tool);
  cache = { installed, missing };
  logger.info(`[toolInventory] Installed: ${installed.join(', ') || 'none'}`);
  logger.info(`[toolInventory] Not found: ${missing.join(', ') || 'none'}`);
}

export function formatToolInventoryBlock(): string {
  if (!cache) {
    return '';
  }
  return [
    '[Available CLI Tools]',
    `Installed: ${cache.installed.join(', ') || 'none'}`,
    `Not found: ${cache.missing.join(', ') || 'none'}`,
    'Only use tools listed as "Installed". Do not attempt to use or install tools listed as "Not found".',
  ].join('\n');
}
