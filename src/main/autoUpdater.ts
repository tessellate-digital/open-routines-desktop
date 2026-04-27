import { autoUpdater, UpdateInfo } from 'electron-updater';
import { app, BrowserWindow, ipcMain } from 'electron';

let mainWindow: BrowserWindow | null = null;

export function initAutoUpdater(window: BrowserWindow): void {
  mainWindow = window;

  if (!app.isPackaged) {
    console.log('[autoUpdater] Skipping — app is not packaged (dev mode)');
    return;
  }

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => {
    console.log('[autoUpdater] Checking for update…');
  });

  autoUpdater.on('update-available', (info: UpdateInfo) => {
    console.log(`[autoUpdater] Update available: ${info.version}`);
    mainWindow?.webContents.send('update-available', {
      version: info.version,
      releaseNotes: info.releaseNotes,
    });
  });

  autoUpdater.on('update-not-available', (info: UpdateInfo) => {
    console.log(`[autoUpdater] Up to date (current: ${app.getVersion()}, latest: ${info.version})`);
  });

  autoUpdater.on('download-progress', (progress) => {
    mainWindow?.webContents.send('update-download-progress', {
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total,
    });
  });

  autoUpdater.on('update-downloaded', () => {
    console.log('[autoUpdater] Update downloaded, ready to install');
    mainWindow?.webContents.send('update-downloaded');
  });

  autoUpdater.on('error', (error) => {
    console.error('[autoUpdater] Error:', error.message);
  });

  ipcMain.handle('update:download', () => {
    autoUpdater.downloadUpdate();
  });

  ipcMain.handle('update:install', () => {
    autoUpdater.quitAndInstall();
  });

  console.log(`[autoUpdater] App version: ${app.getVersion()}`);
  autoUpdater.checkForUpdates().catch((err) => {
    console.error('[autoUpdater] Check failed:', err.message);
  });
}
