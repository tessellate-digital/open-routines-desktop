import 'dotenv/config';
import { app, BrowserWindow, nativeImage } from 'electron';
import * as path from 'path';
import { startServer } from './server';
import { registerIpcHandlers, setServerPort } from './ipc-handlers';
import { startFileWatcher, stopFileWatcher, setFileWatcherPort } from './fileWatcher';
import { disposeAll as disposeServerPool } from '../backend/services/opencodeServerPool';
import { isOpencodeInstalled, installOpencode } from './opencode-installer';
import { writeGmailSkill } from './gmailSkill';

// Set the dock icon at module load time — before app.whenReady() — so macOS never
// gets a chance to show the Electron default icon during launch or quit.
// In packaged mode we read from process.resourcesPath (extraResource copy outside asar).
// In dev mode app.getAppPath() is the project root.
if (process.platform === 'darwin') {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'icon.icns')
    : path.join(app.getAppPath(), 'resources', 'icon.png');
  app.dock?.setIcon(nativeImage.createFromPath(iconPath));
}

let mainWindow: BrowserWindow | null = null;

function createWindow(serverPort: number): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Open Routines',
    show: false,
    // macOS uses the bundle .icns for the Dock — setting icon here on macOS resolves
    // to a bad path in the packaged asar and causes a flash when Electron applies the
    // empty image. Only set it on platforms that actually need it.
    ...(process.platform !== 'darwin' && {
      icon: path.join(app.getAppPath(), 'resources', 'icon.png'),
    }),
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 12, y: 14 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // In production hold the window hidden for 1 s so the app has time to settle
  // before appearing — avoids a jarring flash of half-loaded UI on fast machines.
  // In dev, show immediately so there's no artificial delay while iterating.
  const MIN_SHOW_DELAY = app.isPackaged ? 1000 : 0;
  const readyAt = Date.now();
  mainWindow.once('ready-to-show', () => {
    const elapsed = Date.now() - readyAt;
    const remaining = Math.max(0, MIN_SHOW_DELAY - elapsed);
    setTimeout(() => mainWindow?.show(), remaining);
  });

  // Open DevTools only when DEBUG env var is set
  if (process.env.DEBUG) {
    mainWindow.webContents.openDevTools();
  }

  console.log('[main] preload path:', path.join(__dirname, 'preload.js'));
  console.log('[main] server port:', serverPort);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
}

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

app.whenReady().then(async () => {
  registerIpcHandlers();

  // Check if opencode is installed; install if needed
  if (!isOpencodeInstalled()) {
    console.log('[main] opencode not found, installing...');
    try {
      await installOpencode((msg) => {
        console.log('[main] install:', msg);
        // Send progress to renderer once window is available
        mainWindow?.webContents.send('setup-progress', msg);
      });
      console.log('[main] opencode installed successfully');
    } catch (err) {
      console.error('[main] Failed to install opencode:', err);
      // Continue anyway — the user can configure the path manually in settings
    }
  } else {
    console.log('[main] opencode found');
  }

  // Start the embedded Hono server
  const port = await startServer();
  process.env.OPEN_ROUTINES_API_PORT = String(port);
  writeGmailSkill();
  setServerPort(port);
  setFileWatcherPort(port);

  createWindow(port);

  startFileWatcher();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(port);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  stopFileWatcher();
  await disposeServerPool();
});
