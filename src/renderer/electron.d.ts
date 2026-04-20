interface ElectronAPI {
  getServerPort(): Promise<number>;
  selectDirectory(): Promise<string | null>;
  openExternal(url: string): Promise<void>;
  platform: string;
}

interface Window {
  electronAPI?: ElectronAPI;
}
