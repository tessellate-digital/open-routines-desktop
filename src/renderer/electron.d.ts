interface ElectronAPI {
  getServerPort(): Promise<number>;
  selectDirectory(): Promise<string | null>;
  platform: string;
}

interface Window {
  electronAPI?: ElectronAPI;
}
