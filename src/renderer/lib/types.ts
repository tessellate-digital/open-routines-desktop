// API response types (matches backend JSON responses)

export type PermissionLevel = 'allow' | 'ask' | 'deny';

/** A permission can be a flat level or an object with granular pattern rules. */
export type PermissionValue = PermissionLevel | Record<string, PermissionLevel>;

export interface RoutinePermissions {
  read?: PermissionValue;
  edit?: PermissionValue;
  bash?: PermissionValue;
  webfetch?: PermissionValue;
  websearch?: PermissionValue;
  [key: string]: PermissionValue | undefined;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  prompt: string;
  model: string;
  repository: string;
  branch: string;
  agent: string;
  env_vars: Record<string, string>;
  enabled: boolean;
  run_mode: 'background' | 'foreground';
  permissions: RoutinePermissions;
  temperature: number | null;
  created_at: string;
  updated_at: string;
  triggers_count: number;
  last_run_status: string | null;
}

export interface Trigger {
  id: string;
  routine_id: string;
  type: 'cron' | 'api' | 'github' | 'watcher';
  config: Record<string, unknown>;
  enabled: boolean;
  created_at: string;
}

export interface Run {
  id: string;
  routine_id: string;
  routine_name: string;
  trigger_id: string | null;
  trigger_type: string;
  prompt: string;
  display_prompt: string;
  parent_run_id: string | null;
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled' | 'lost';
  started_at: string | null;
  finished_at: string | null;
  exit_code: number | null;
  stdout: Array<{ type: string; data: string }>;
  stderr: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
  is_secret: boolean;
  updated_at: string;
}

export interface ModelsResponse {
  models: string[];
  error?: string;
}

export interface FsEntry {
  name: string;
  path: string;
}

export interface FsResponse {
  path: string;
  parent: string | null;
  root: string;
  entries: FsEntry[];
}

export interface MountsResponse {
  mounts: string[];
}

// containerPath -> hostPath, pushed by the host agent
export type HostMountsResponse = Record<string, string>;

// SSE event types for global events stream
export interface SSEEvent {
  type: 'run_started' | 'run_updated' | 'run_finished' | 'routine_updated' | 'routine_deleted';
  data: Record<string, unknown>;
}
