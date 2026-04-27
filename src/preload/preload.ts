import { contextBridge, ipcRenderer } from 'electron';

console.log('[preload] Preload script loaded');

contextBridge.exposeInMainWorld('electronAPI', {
  getServerPort: (): Promise<number> => ipcRenderer.invoke('get-server-port'),
  selectDirectory: (): Promise<string | null> => ipcRenderer.invoke('dialog:openDirectory'),
  selectFile: (): Promise<string | null> => ipcRenderer.invoke('dialog:openFile'),
  selectPath: (): Promise<string | null> => ipcRenderer.invoke('dialog:openPath'),
  openExternal: (url: string): Promise<void> => ipcRenderer.invoke('shell:openExternal', url),
  alert: (message: string): Promise<void> => ipcRenderer.invoke('dialog:alert', message),
  confirm: (message: string): Promise<boolean> => ipcRenderer.invoke('dialog:confirm', message),
  platform: process.platform,
  onUpdateAvailable: (callback: (info: { version: string; releaseNotes?: string }) => void) => {
    ipcRenderer.on('update-available', (_event, info) => callback(info));
  },
  onUpdateDownloadProgress: (
    callback: (progress: { percent: number; transferred: number; total: number }) => void
  ) => {
    ipcRenderer.on('update-download-progress', (_event, progress) => callback(progress));
  },
  onUpdateDownloaded: (callback: () => void) => {
    ipcRenderer.on('update-downloaded', () => callback());
  },
  downloadUpdate: (): Promise<void> => ipcRenderer.invoke('update:download'),
  installUpdate: (): Promise<void> => ipcRenderer.invoke('update:install'),
});
