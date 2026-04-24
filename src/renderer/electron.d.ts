interface ElectronAPI {
  getServerPort(): Promise<number>;
  selectDirectory(): Promise<string | null>;
  selectFile(): Promise<string | null>;
  selectPath(): Promise<string | null>;
  openExternal(url: string): Promise<void>;
  alert(message: string): Promise<void>;
  confirm(message: string): Promise<boolean>;
  platform: string;
}

interface Window {
  electronAPI?: ElectronAPI;
}
