import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { getOpencodePath } from './opencode-installer';

const userData = app.isPackaged
  ? app.getPath('userData')
  : path.join(app.getPath('appData'), 'open-routines-desktop-dev');
fs.mkdirSync(userData, { recursive: true });
const home = app.getPath('home');

export const config = {
  dbPath: path.join(userData, 'routines.db'),
  workspacesDir: path.join(home, 'open-routines-workspaces'),
  adminToken: '', // No auth needed for localhost desktop app
  maxConcurrentRuns: 5,
  opencodePath: process.env.OPENCODE_PATH ?? getOpencodePath(),
  opencodeModel: process.env.OPENCODE_MODEL ?? '',
  port: 0, // OS-assigned
};
