import { ipcMain, dialog, BrowserWindow } from 'electron';

let serverPort = 0;

export function setServerPort(port: number): void {
  serverPort = port;
}

export function registerIpcHandlers(): void {
  ipcMain.handle('get-server-port', () => serverPort);

  ipcMain.handle('dialog:openDirectory', async () => {
    const win = BrowserWindow.getFocusedWindow();
    const result = await dialog.showOpenDialog(win!, {
      properties: ['openDirectory'],
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });
}
