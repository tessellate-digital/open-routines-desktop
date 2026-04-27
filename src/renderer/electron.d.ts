interface UpdateInfo {
  version: string;
  releaseNotes?: string;
}

interface DownloadProgress {
  percent: number;
  transferred: number;
  total: number;
}

interface ElectronAPI {
  getServerPort(): Promise<number>;
  selectDirectory(): Promise<string | null>;
  selectFile(): Promise<string | null>;
  selectPath(): Promise<string | null>;
  openExternal(url: string): Promise<void>;
  alert(message: string): Promise<void>;
  confirm(message: string): Promise<boolean>;
  platform: string;
  onUpdateAvailable(callback: (info: UpdateInfo) => void): void;
  onUpdateDownloadProgress(callback: (progress: DownloadProgress) => void): void;
  onUpdateDownloaded(callback: () => void): void;
  downloadUpdate(): Promise<void>;
  installUpdate(): Promise<void>;
  onNavigate(callback: (route: string) => void): void;
}

interface Window {
  electronAPI?: ElectronAPI;
}
