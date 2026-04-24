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

## Child Intent Nodes

- [`src/backend/AGENTS.md`](src/backend/AGENTS.md) — services, repositories, routes, conventions
- [`src/renderer/AGENTS.md`](src/renderer/AGENTS.md) — React frontend: pages, components, stores, hooks
