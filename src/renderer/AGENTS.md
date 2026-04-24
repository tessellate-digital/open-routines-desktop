# Renderer — Agent Context

> READ THIS alongside the root `AGENTS.md` before touching any renderer file.

## Overview

The renderer is a **React 19 + React Router + Zustand** single-page app running in the Electron renderer process. It communicates with the backend exclusively via HTTP (`http://localhost:{port}/api/*`) and SSE (`/api/events`). No direct Node.js or Electron APIs — those are mediated by the preload bridge (`src/preload/preload.ts`).

## Page routing

| Page           | File                      | What it does                     |
| -------------- | ------------------------- | -------------------------------- |
| Dashboard      | `pages/Dashboard.tsx`     | Overview / home                  |
| Routines list  | `pages/RoutinesList.tsx`  | Lists all routines               |
| Routine detail | `pages/RoutineDetail.tsx` | View a single routine            |
| Routine form   | `pages/RoutineForm.tsx`   | Create / edit routine            |
| Routine runs   | `pages/RoutineRuns.tsx`   | Runs scoped to one routine       |
| All runs       | `pages/RunsList.tsx`      | Global runs list                 |
| Run detail     | `pages/run-detail/`       | Streaming run output, tool calls |
| Settings       | `pages/Settings.tsx`      | App settings / API keys          |

The `run-detail` page is a subdirectory because it has its own components and utils.

## State management

**Zustand** for client state. Currently one store:

- `stores/runStore.ts` — tracks live run state (streaming output, status). Updated by SSE events.

Prefer fetching data directly in components/hooks with `fetch()` rather than putting server state in Zustand. Only use Zustand for state that must be shared across unrelated components or that comes from the SSE stream.

## Real-time updates

`hooks/useSSE.ts` — subscribes to `GET /api/events` and dispatches events into the runStore. Components that need live updates should consume the store rather than managing their own SSE connections.

## Components

`components/` has 24+ files. Subdirectory `components/composer/` contains the routine-prompt composer (rich text input with `@mentions` for file paths — see `lib/mentions/`).

Notable components:

- **Composer** (`components/composer/`, `hooks/composer/`) — prompt editor with mention support
- **Run output** — in `pages/run-detail/components/`

## Styling

Tailwind CSS v4 (`@tailwindcss/vite`). Write utility classes directly in JSX. For patterns used in 3+ places, extract with CSS `@apply` in `styles/` — do **not** export TS class-name strings.

## Invariants

- **No Node/Electron imports** in renderer code. Use the preload bridge for any system access.
- **No business logic** in components — fetch data, display it, delegate mutations to the API.
- Streaming run output arrives as JSONL on stdout — parsing lives in the run-detail utils, not in components.
- Tests use `jsdom` + `@testing-library/react`. Run with `npm run test:frontend`.
