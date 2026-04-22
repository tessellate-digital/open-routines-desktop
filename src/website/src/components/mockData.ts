export interface MockRun {
  id: number;
  routine_name: string;
  trigger_type: string;
  status: string;
  duration: string;
  started: string;
}

export interface MockRoutine {
  id: number;
  name: string;
  model: string;
  triggers_count: number;
  last_run_status: string | null;
  enabled: boolean;
}

export const MOCK_RUNS: MockRun[] = [
  {
    id: 1,
    routine_name: 'PR review digest',
    trigger_type: 'cron',
    status: 'running',
    duration: '—',
    started: 'just now',
  },
  {
    id: 2,
    routine_name: 'Docs drift check',
    trigger_type: 'watcher',
    status: 'success',
    duration: '48s',
    started: '23m ago',
  },
  {
    id: 3,
    routine_name: 'Nightly test report',
    trigger_type: 'cron',
    status: 'success',
    duration: '2m 17s',
    started: '2h ago',
  },
  {
    id: 4,
    routine_name: 'Test http call',
    trigger_type: 'manual',
    status: 'success',
    duration: '3s',
    started: '4h ago',
  },
  {
    id: 5,
    routine_name: 'Test http call',
    trigger_type: 'manual',
    status: 'success',
    duration: '52s',
    started: '4h ago',
  },
  {
    id: 6,
    routine_name: 'Test http call',
    trigger_type: 'manual',
    status: 'failed',
    duration: '1m 3s',
    started: '12h ago',
  },
];

export const MOCK_ROUTINES: MockRoutine[] = [
  {
    id: 1,
    name: 'PR review digest',
    model: 'anthropic/claude-sonnet-4-6',
    triggers_count: 1,
    last_run_status: 'running',
    enabled: true,
  },
  {
    id: 2,
    name: 'Docs drift check',
    model: 'anthropic/claude-sonnet-4-6',
    triggers_count: 1,
    last_run_status: 'success',
    enabled: true,
  },
  {
    id: 3,
    name: 'Nightly test report',
    model: 'openai/gpt-4o',
    triggers_count: 1,
    last_run_status: 'success',
    enabled: true,
  },
  {
    id: 4,
    name: 'Test http call',
    model: 'anthropic/claude-haiku-4-5',
    triggers_count: 0,
    last_run_status: 'failed',
    enabled: false,
  },
];

export const statusColorMap: Record<string, string> = {
  pending: 'text-pending',
  running: 'text-running',
  success: 'text-success',
  failed: 'text-destructive',
  cancelled: 'text-warning',
};
