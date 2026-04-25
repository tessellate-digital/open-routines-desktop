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
const opencodeBinDir = path.join(userData, 'opencode-bin');
const opencodeConfigPath = path.join(opencodeBinDir, 'opencode.json');
const skillsDir = path.join(opencodeBinDir, 'skills');
const uvDataDir = path.join(userData, 'uv');
// Isolated HOME for opencode processes — prevents global opencode config from leaking in
const opencodeHomeDir = path.join(userData, 'opencode-home');
fs.mkdirSync(opencodeBinDir, { recursive: true });
fs.mkdirSync(skillsDir, { recursive: true });
fs.mkdirSync(uvDataDir, { recursive: true });
fs.mkdirSync(opencodeHomeDir, { recursive: true });
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
  skillsDir,
  uvDataDir,
  opencodeHomeDir,
  opencodeModel: process.env.OPENCODE_MODEL ?? '',
  port: 0, // OS-assigned

  // Google OAuth credentials for Gmail integration — set via .env or CI secrets
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID ?? '',
    clientSecret: process.env.GMAIL_CLIENT_SECRET ?? '',
  },
};
