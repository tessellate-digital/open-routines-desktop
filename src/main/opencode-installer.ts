import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { execFile, execFileSync } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const GITHUB_REPO = 'anomalyco/opencode';

/**
 * Binary lives inside the app's userData directory:
 *   <userData>/opencode-bin/opencode
 */
function getOpencodeDir(): string {
  return path.join(app.getPath('userData'), 'opencode-bin');
}

export function getOpencodePath(): string {
  return path.join(getOpencodeDir(), 'opencode');
}

export function isOpencodeInstalled(): boolean {
  return fs.existsSync(getOpencodePath());
}

/**
 * Detect the platform target string matching the GitHub release asset names.
 * e.g. "darwin-arm64", "darwin-x64", "linux-x64", "linux-arm64"
 */
function detectTarget(): string {
  const platform = process.platform === 'win32' ? 'windows' : process.platform;
  let arch = process.arch === 'x64' ? 'x64' : process.arch === 'arm64' ? 'arm64' : process.arch;

  // Rosetta detection on macOS
  if (platform === 'darwin' && arch === 'x64') {
    try {
      const { stdout } = {
        stdout: execFileSync('sysctl', ['-n', 'sysctl.proc_translated']).toString().trim(),
      };
      if (stdout === '1') {
        arch = 'arm64';
      }
    } catch {
      // Not running under Rosetta
    }
  }

  return `${platform}-${arch}`;
}

/**
 * Download the opencode binary directly from GitHub releases into the app's
 * userData directory. Does not touch ~/.opencode or any global paths.
 */
export async function installOpencode(onProgress?: (message: string) => void): Promise<void> {
  const target = detectTarget();
  const ext = process.platform === 'linux' ? '.tar.gz' : '.zip';
  const filename = `opencode-${target}${ext}`;

  onProgress?.('Downloading opencode...');

  const targetDir = getOpencodeDir();
  const targetBin = getOpencodePath();
  const tmpDir = path.join(os.tmpdir(), `opencode-install-${Date.now()}`);

  fs.mkdirSync(targetDir, { recursive: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  const archivePath = path.join(tmpDir, filename);
  const downloadUrl = `https://github.com/${GITHUB_REPO}/releases/latest/download/${filename}`;

  const env = {
    ...process.env,
    PATH: [process.env.PATH ?? '', '/usr/local/bin', '/opt/homebrew/bin'].join(':'),
  };

  try {
    // Download the archive
    onProgress?.(`Downloading from ${downloadUrl}...`);
    await execFileAsync('curl', ['-fSL', '-o', archivePath, downloadUrl], {
      env,
      timeout: 120_000,
    });

    // Extract
    onProgress?.('Extracting...');
    if (ext === '.tar.gz') {
      await execFileAsync('tar', ['-xzf', archivePath, '-C', tmpDir], { timeout: 30_000 });
    } else {
      await execFileAsync('unzip', ['-q', archivePath, '-d', tmpDir], { timeout: 30_000 });
    }

    // Move binary to app directory
    const extractedBin = path.join(tmpDir, 'opencode');
    if (!fs.existsSync(extractedBin)) {
      throw new Error('Extracted archive does not contain an "opencode" binary');
    }

    fs.copyFileSync(extractedBin, targetBin);
    fs.chmodSync(targetBin, 0o755);

    // Clean up temp files
    fs.rmSync(tmpDir, { recursive: true, force: true });

    if (!fs.existsSync(targetBin)) {
      throw new Error('Installation failed — binary not found at ' + targetBin);
    }

    onProgress?.('opencode installed successfully');
  } catch (err) {
    // Clean up on failure
    fs.rmSync(tmpDir, { recursive: true, force: true });
    throw new Error(`Failed to install opencode: ${(err as Error).message}`);
  }
}
