import { ipcMain, dialog, shell, BrowserWindow, app, nativeImage } from 'electron';
import * as path from 'path';
import { setPermissionDialogHandler } from '../backend/services/permissionBridge';

function getAppIcon() {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'icon.icns')
    : path.join(app.getAppPath(), 'resources', 'icon.png');
  return nativeImage.createFromPath(iconPath);
}

let serverPort = 0;

export function setServerPort(port: number): void {
  serverPort = port;
}

export function registerIpcHandlers(): void {
  ipcMain.handle('get-server-port', () => serverPort);

  // Register the native macOS permission dialog handler
  setPermissionDialogHandler(async ({ title, detail, permissionType }) => {
    const wins = BrowserWindow.getAllWindows();
    const win = BrowserWindow.getFocusedWindow() ?? wins[0] ?? null;
    const result = await dialog.showMessageBox(win!, {
      type: 'question',
      icon: getAppIcon(),
      title: `Permission Required: ${permissionType}`,
      message: title || `${permissionType} permission requested`,
      detail,
      buttons: ['Allow Once', 'Always Allow', 'Deny'],
      defaultId: 0,
      cancelId: 2,
    });
    if (result.response === 0) {
      return 'once';
    }
    if (result.response === 1) {
      return 'always';
    }
    return 'reject';
  });

  ipcMain.handle('dialog:alert', async (_event, message: string) => {
    const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? null;
    await dialog.showMessageBox(win!, {
      type: 'warning',
      message,
      buttons: ['OK'],
      defaultId: 0,
    });
  });

  ipcMain.handle('dialog:confirm', async (_event, message: string) => {
    const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? null;
    const result = await dialog.showMessageBox(win!, {
      type: 'warning',
      message,
      buttons: ['Cancel', 'OK'],
      defaultId: 1,
      cancelId: 0,
    });
    return result.response === 1;
  });

  ipcMain.handle('shell:openExternal', (_event, url: string) => {
    shell.openExternal(url);
  });

  ipcMain.handle('dialog:openDirectory', async () => {
    const win = BrowserWindow.getFocusedWindow();
    const result = await dialog.showOpenDialog(win!, {
      properties: ['openDirectory'],
    });
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    return result.filePaths[0];
  });

  ipcMain.handle('dialog:openFile', async () => {
    const win = BrowserWindow.getFocusedWindow();
    const result = await dialog.showOpenDialog(win!, { properties: ['openFile'] });
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    return result.filePaths[0];
  });

  ipcMain.handle('dialog:openPath', async () => {
    const win = BrowserWindow.getFocusedWindow();
    const result = await dialog.showOpenDialog(win!, {
      properties: ['openFile', 'openDirectory'],
    });
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    return result.filePaths[0];
  });
}
