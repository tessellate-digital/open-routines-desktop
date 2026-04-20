import chokidar, { type FSWatcher } from 'chokidar';
import { extname, relative } from 'path';
import { logger } from '../backend/util/logger';

interface WatcherTrigger {
  triggerId: string;
  secret: string;
  paths: string[];
  events: string[];
  debounce: number;
  recursive: boolean;
  fileFilter?: { mode: 'include' | 'exclude' | 'none'; patterns: string[] };
}

const watchers = new Map<string, FSWatcher>();
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

let serverPort = 0;

export function setFileWatcherPort(port: number): void {
  serverPort = port;
}

const CHOKIDAR_EVENTS = ['add', 'change', 'addDir', 'unlink', 'unlinkDir'] as const;
const FOLDER_EVENTS = new Set(['addDir', 'unlinkDir']);

function matchesFileFilter(
  filePath: string,
  filter: WatcherTrigger['fileFilter'],
  evtType: string
): boolean {
  if (FOLDER_EVENTS.has(evtType)) return true;
  if (!filter || filter.mode === 'none' || filter.patterns.length === 0) return true;
  const ext = extname(filePath).toLowerCase();
  if (!ext) return filter.mode === 'exclude';
  if (filter.mode === 'include') return filter.patterns.includes(ext);
  return !filter.patterns.includes(ext);
}

async function fireEvent(
  triggerId: string,
  secret: string,
  fsEvent: string,
  fsPath: string
): Promise<void> {
  try {
    const res = await fetch(`http://localhost:${serverPort}/hooks/watcher/${triggerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        event: fsEvent,
        path: fsPath,
        container_path: fsPath, // No container/host distinction in desktop mode
        timestamp: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      logger.info(`[watcher] Event rejected for trigger ${triggerId}: ${res.status}`);
    }
  } catch (err) {
    logger.info(`[watcher] Failed to send event to ${triggerId}: ${(err as Error).message}`);
  }
}

function reconcileWatchers(triggers: WatcherTrigger[]): void {
  const neededPaths = new Set(triggers.flatMap((t) => t.paths));

  for (const [p, w] of watchers) {
    if (!neededPaths.has(p)) {
      w.close();
      watchers.delete(p);
      logger.info(`[watcher] Stopped watching: ${p}`);
    }
  }

  for (const p of neededPaths) {
    if (watchers.has(p)) continue;

    const w = chokidar.watch(p, {
      persistent: true,
      ignoreInitial: true,
      usePolling: false,
      awaitWriteFinish: false,
    });

    for (const evtType of CHOKIDAR_EVENTS) {
      w.on(evtType, (filePath: string) => {
        const matching = triggers.filter(
          (t) =>
            t.paths.includes(p) &&
            t.events.includes(evtType) &&
            matchesFileFilter(filePath, t.fileFilter, evtType) &&
            (t.recursive || !relative(p, filePath).includes('/'))
        );
        for (const t of matching) {
          const key = `${t.triggerId}:${evtType}:${filePath}`;
          clearTimeout(debounceTimers.get(key));
          debounceTimers.set(
            key,
            setTimeout(() => {
              debounceTimers.delete(key);
              fireEvent(t.triggerId, t.secret, evtType, filePath);
            }, t.debounce)
          );
        }
      });
    }

    w.on('error', (err: unknown) => logger.info(`[watcher] Error on ${p}: ${err}`));
    watchers.set(p, w);
    logger.info(`[watcher] Watching: ${p}`);
  }
}

interface TriggerResponse {
  id: string;
  config: Record<string, unknown>;
  enabled: boolean;
}

async function fetchAndReconcile(): Promise<void> {
  try {
    const res = await fetch(`http://localhost:${serverPort}/api/triggers?type=watcher`);
    if (!res.ok) return;
    const triggers = (await res.json()) as TriggerResponse[];

    const parsed: WatcherTrigger[] = triggers
      .filter((t) => t.enabled)
      .map((t) => {
        const rawPaths = (t.config.paths as string[]) ?? [];
        const paths = rawPaths.filter(Boolean);

        const rawFilter = t.config.fileFilter as
          | { mode?: string; patterns?: string[] }
          | undefined;
        const fileFilter =
          rawFilter && Array.isArray(rawFilter.patterns) && rawFilter.patterns.length > 0
            ? {
                mode:
                  rawFilter.mode === 'exclude'
                    ? ('exclude' as const)
                    : rawFilter.mode === 'none'
                      ? ('none' as const)
                      : ('include' as const),
                patterns: rawFilter.patterns,
              }
            : undefined;

        return {
          triggerId: t.id,
          secret: String(t.config.secret ?? ''),
          paths,
          events: Array.isArray(t.config.events)
            ? (t.config.events as string[])
            : ['add', 'change', 'addDir'],
          debounce: typeof t.config.debounce === 'number' ? t.config.debounce : 500,
          recursive: t.config.recursive !== false,
          fileFilter,
        };
      })
      .filter((t) => t.paths.length > 0);

    reconcileWatchers(parsed);
  } catch {
    // Server not ready yet or network error — will retry on next poll
  }
}

let pollInterval: ReturnType<typeof setInterval> | null = null;

export function startFileWatcher(): void {
  // Initial poll after a short delay to let the server start
  setTimeout(() => fetchAndReconcile(), 2000);
  pollInterval = setInterval(fetchAndReconcile, 60_000);
}

export function stopFileWatcher(): void {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  for (const [, w] of watchers) {
    w.close();
  }
  watchers.clear();
}
