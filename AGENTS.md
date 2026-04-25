# Open Routines Desktop — Agent Context

> READ THIS FIRST. Start here before opening any source file.

## What this project is

An **Electron desktop app** that lets users define AI-powered *Routines* and run them automatically via *Triggers* (cron schedules, GitHub webhooks, API calls, or file-system watchers). Each run invokes the `opencode` AI agent under the hood.

## Process architecture

```
Electron main process
├── src/main/index.ts        — app lifecycle, BrowserWindow creation
├── src/main/server.ts       — Hono HTTP server (all /api/* routes mounted here)
├── src/main/ipc-handlers.ts — Electron IPC bridge (renderer ↔ main)
├── src/main/fileWatcher.ts  — chokidar watcher for "watcher" trigger type
└── src/backend/             — all business logic (runs in main process)

Electron renderer process
└── src/renderer/            — React 19 + React Router + Zustand (see child AGENTS.md)

Preload script
└── src/preload/preload.ts   — contextIsolation bridge (contextIsolation=true, nodeIntegration=false)

Website (separate, not part of the Electron build)
└── src/website/             — marketing site, has its own node_modules
```

The renderer talks to the backend **exclusively over HTTP** (`http://localhost:{port}/api/*`) — never via IPC for data fetching. IPC is used only for narrow system operations (open file dialog, etc.).

## Domain model

```
Routine  —< Trigger   (one routine has many triggers)
Routine  —< Run       (each execution of a routine)
Trigger  —> Run       (a trigger fires → creates a run)
```

- **Routine**: named AI task with a prompt, model, repository, branch, permissions, and run mode (`background` | `foreground`).
- **Trigger**: what fires the routine — `cron` (node-cron schedule), `api` (REST call), `github` (webhook), or `watcher` (chokidar file change).
- **Run**: one execution instance. Status lifecycle: `pending → running → completed | failed | interrupted`.

All types are in `src/backend/types.ts`. Row types (DB) are separate from Zod schemas (validation).

## Backend layer (`src/backend/`)

| Path | Responsibility |
|------|---------------|
| `database.ts` | SQLite singleton (better-sqlite3, WAL mode). Contains inline migrations — add new columns here with `ALTER TABLE IF NOT EXISTS`. Never drop columns. |
| `types.ts` | All shared TS interfaces and Zod schemas. Single source of truth. |
| `services/executor.ts` | Runs a Routine via the opencode SDK. Parses model strings as `providerID/modelID`. Streams events to the SSE bus. |
| `services/scheduler.ts` | node-cron scheduler — fires cron triggers. Started at server boot. |
| `services/opencodeServerPool.ts` | Pool of opencode server contexts. Always `release()` a context in a `finally` block. |
| `services/eventBus.ts` | In-process SSE event bus. Frontend subscribes via `GET /api/events`. |
| `services/secureStorage.ts` | Encrypts secret settings values at rest. |
| `repositories/` | Thin SQLite wrappers — one file per entity (routines, runs, triggers, settings). No business logic here. |
| `routes/` | Hono route handlers — one file per resource. Input validated with `@hono/zod-validator`. |

## API surface

All routes are mounted in `src/main/server.ts`:

| Prefix | Router file |
|--------|------------|
| `/api/routines` | `routes/routines.ts` |
| `/api` (triggers) | `routes/triggers.ts` |
| `/api/runs` | `routes/runs.ts` |
| `/hooks` | `routes/webhooks.ts` |
| `/api/settings` | `routes/settings.ts` |
| `/api/auth/github-copilot` | `routes/copilotAuth.ts` |
| `/api/events` | SSE stream (inline in server.ts) |
| `/api/models` | Model list from opencode (inline in server.ts) |

## Database

SQLite at `config.dbPath` (set in `src/main/config.ts`). WAL mode, foreign keys ON.

Tables: `routines`, `triggers`, `runs`, `settings`.

**Migration pattern**: add columns with `ALTER TABLE … ADD COLUMN IF NOT EXISTS` in `database.ts:initDb()`. Never use a separate migration file.

JSON columns (`env_vars`, `config`, `permissions`, `metadata`) are stored as serialised strings — parse/stringify at the repository layer.

## Testing

```bash
npm run test:frontend    # vitest + jsdom (renderer)
npm run test:backend     # vitest (backend, no DOM)
npm run test             # both
npm run pipeline-checks  # typecheck + lint + format + test
```

Backend tests mock `better-sqlite3` (it's a native module compiled for Electron's Node version, not the test runner's). See `routinesRepository.test.ts` for the pattern.

## Key invariants

- **Never import renderer code from backend**, and never import backend code from renderer. The boundary is HTTP.
- **JSON columns**: always parse on read, stringify on write — never store raw objects in SQLite.
- **opencode contexts**: always `release()` in a `finally` block (see `opencodeServerPool.ts`).
- **Tailwind**: use CSS `@apply` for reusable patterns — do not export TS class-name strings.
- **Model strings**: format is `providerID/modelID` (e.g. `anthropic/claude-opus-4-5`). Empty string means "let server pick default". See `executor.ts:parseModelString`.

## Process isolation (scope pollution rule)

The `opencode serve` processes spawned by this app must be **fully isolated** from the user's global environment. The user may have their own opencode installation with MCPs, skills, and agent configs — none of that must leak into the app's agents.

**How isolation is enforced** (see `opencodeServerPool.ts:spawnAndWaitForServer`):

| Env var set on child process | Purpose |
|---|---|
| `OPENCODE_CONFIG` | Points to the app-managed `opencode.json` — the only config opencode should load |
| `HOME` | Redirected to `config.opencodeHomeDir` (an empty dir inside `userData`) so opencode cannot discover the user's global config at `~/Library/Application Support/opencode/` |
| `GIT_CONFIG_GLOBAL` | Explicitly re-points to the real `~/.gitconfig` so git identity still works despite the redirected HOME |
| `UV_*` | Scoped to `config.uvDataDir` so Python tooling is isolated too |

**Rules for future changes:**
- Never remove or weaken the `HOME` override — it is the primary guard against global config leakage.
- If new tools/runtimes are added (e.g. a Node global config), scope their data dirs inside `config.userData` and override their env vars in the same block.
- Never write to paths outside `userData` from the main process. The app must leave the user's home directory entirely untouched.

## Adding a new integration (connected app)

Follow these steps in order. Use the Notion integration as the reference implementation.

### 1. OpenCode config — `src/main/opencodeConfig.ts`
- In `regenerateOpencodeConfig()`, always include the MCP server in the config object:
  ```ts
  mcp: { myapp: { type: 'remote', url: 'https://mcp.myapp.com/mcp' } }
  ```
- In `buildAgentDefinition()`, grant the `mcp__myapp` permission only when the routine has `connected_apps.myapp`:
  ```ts
  if (connectedApps.myapp) serialized['mcp__myapp'] = 'allow';
  ```

### 2. Backend route — `src/backend/routes/myappMcp.ts`
Three endpoints proxying to the OpenCode SDK via `acquireContext`:
- `GET /status` — calls `client.mcp.status()`, returns `{ status, error? }`
- `POST /authenticate` — calls `client.mcp.auth.authenticate()`, triggers OAuth in the browser
- `POST /disconnect` — calls `client.mcp.auth.remove()`

### 3. Mount the router — `src/main/server.ts`
```ts
import myappMcpRouter from '../backend/routes/myappMcp';
app.route('/api/mcp/myapp', myappMcpRouter);
```

### 4. API client — `src/renderer/lib/api.ts`
Add three methods: `myappStatus()`, `myappAuthenticate()`, `myappDisconnect()`.

### 5. Settings UI — `src/renderer/pages/settings/ConnectedAppsSettings.tsx`
Add a `MyAppIntegration` component following the `GmailIntegration` / `NotionIntegration` pattern:
- States: `idle | loading | authorizing | connected`
- Poll `api.myappStatus()` while authorizing
- Connect / Disconnect buttons

### 6. Routine form toggle — `src/renderer/pages/RoutineForm.tsx`
- Fetch `api.myappStatus()` on init, store in `myappConnected` state
- Add a checkbox row in the Connected Apps section (gated on `myappConnected`), wired to `form.connected_apps.myapp`

### 7. Executor prompt hint — `src/backend/services/executor.ts`
After the existing connected-apps block (~line 218), add:
```ts
if (connectedApps.myapp) {
  lines.push('Connected apps: MyApp. Tools available via MCP — describe what they do.');
}
```

### 8. Mention actions (@ summon) — `src/renderer/lib/mentions/myappActions.ts`
Create the file exporting a `myappActions: MentionAction[]` array. Each action represents one thing the user can summon with `@`. Each entry needs:
- `id` — stable, unique string (e.g. `'myapp-search'`)
- `label` — shown in the popover (e.g. `'Search workspace'`)
- `group` — must match the brand name exactly as it appears in `groupIconComponents` (e.g. `'MyApp'`)
- `icon` — a Heroicon via `createElement` (20/solid), will be rendered in pink
- `keywords` — array of strings used for fuzzy filtering when the user types after `@`
- `onSelect: async () => '<action-id>'` — returns the serialised value stored in the chip
- `renderer(value)` — short display string shown inside the chip (e.g. `'MyApp: Search'`)
- `feedRenderer(value)` — plain-text fallback used in the agent feed (e.g. `'[MyApp: Search workspace]'`)

The chip is serialised in the prompt as `@customTag:action-id(value)`. The executor receives this as part of the prompt string and the agent interprets it.

### 9. Register actions — `src/renderer/lib/mentions/mentionRegistry.ts`
Import and spread `myappActions` into the `mentionActions` array at the bottom of the file.

### 10. Brand icon in the @ popover — `src/renderer/components/composer/MentionPopover.tsx`
- Add an inline SVG component for the brand logo at the top of the file. Make sure the `viewBox` matches the coordinate space of the path data (not always `0 0 24 24`).
- Add it to the `groupIconComponents` record, keyed by the exact `group` string used in the actions file.
- The icon renders at 16×16 in the group header. Item icons (Heroicons) are styled pink via `.mention-popover-item-icon`.

### 11. Website — `src/website/src/`
If the integration is publicly launched, update:
- The "Hello world" section copy and provider pills in `App.tsx`
- The `SettingsMockup.tsx` if it features this provider

---

## Child Intent Nodes

- [`src/backend/AGENTS.md`](src/backend/AGENTS.md) — services, repositories, routes, conventions
- [`src/renderer/AGENTS.md`](src/renderer/AGENTS.md) — React frontend: pages, components, stores, hooks
