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
});
