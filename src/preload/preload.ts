import { contextBridge, ipcRenderer } from 'electron';

console.log('[preload] Preload script loaded');

contextBridge.exposeInMainWorld('electronAPI', {
  getServerPort: (): Promise<number> => ipcRenderer.invoke('get-server-port'),
  selectDirectory: (): Promise<string | null> => ipcRenderer.invoke('dialog:openDirectory'),
  openExternal: (url: string): Promise<void> => ipcRenderer.invoke('shell:openExternal', url),
  platform: process.platform,
});
