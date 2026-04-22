import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { getOpencodePath } from './opencode-installer';

const userData = app.isPackaged
  ? app.getPath('userData')
  : path.join(app.getPath('appData'), 'open-routines-desktop-dev');
fs.mkdirSync(userData, { recursive: true });
const home = app.getPath('home');

// Write opencode config next to the bundled binary so routines run autonomously.
// Passed to `opencode serve` via OPENCODE_CONFIG env var — never touches the user's
// own ~/.config/opencode.
// Agent definitions are populated later by regenerateOpencodeConfig() once the DB is ready.
const opencodeConfigPath = path.join(userData, 'opencode-bin', 'opencode.json');
fs.mkdirSync(path.dirname(opencodeConfigPath), { recursive: true });
fs.writeFileSync(
  opencodeConfigPath,
  JSON.stringify({ $schema: 'https://opencode.ai/config.json', agent: {} }, null, 2) + '\n'
);

export const config = {
  dbPath: path.join(userData, 'routines.db'),
  workspacesDir: path.join(home, 'open-routines-workspaces'),
  adminToken: '', // No auth needed for localhost desktop app
  maxConcurrentRuns: 5,
  opencodePath: process.env.OPENCODE_PATH ?? getOpencodePath(),
  opencodeConfigPath,
  opencodeModel: process.env.OPENCODE_MODEL ?? '',
  port: 0, // OS-assigned
};
