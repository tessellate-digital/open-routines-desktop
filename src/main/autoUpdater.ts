import { autoUpdater, UpdateInfo } from 'electron-updater';
import { BrowserWindow, ipcMain } from 'electron';

let mainWindow: BrowserWindow | null = null;

export function initAutoUpdater(window: BrowserWindow): void {
  mainWindow = window;

  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info: UpdateInfo) => {
    mainWindow?.webContents.send('update-available', {
      version: info.version,
      releaseNotes: info.releaseNotes,
    });
  });

  autoUpdater.on('download-progress', (progress) => {
    mainWindow?.webContents.send('update-download-progress', {
      percent: progress.percent,
      transferred: progress.transferred,
      total: progress.total,
    });
  });

  autoUpdater.on('update-downloaded', () => {
    mainWindow?.webContents.send('update-downloaded');
  });

  autoUpdater.on('error', (error) => {
    console.error('[autoUpdater] Error:', error);
  });

  ipcMain.handle('update:download', () => {
    autoUpdater.downloadUpdate();
  });

  ipcMain.handle('update:install', () => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.checkForUpdates().catch((err) => {
    console.log('[autoUpdater] Check failed (offline or no releases):', err.message);
  });
}
