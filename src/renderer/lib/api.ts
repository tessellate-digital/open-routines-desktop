import type {
  Routine,
  Run,
  Trigger,
  Setting,
  ModelsResponse,
  FsResponse,
  MountsResponse,
  HostMountsResponse,
} from './types';

// In Electron, the backend runs on a dynamic localhost port.
// Resolve it once at startup via the preload-exposed IPC bridge.
let _baseUrl: string | null = null;

async function getBaseUrl(): Promise<string> {
  if (_baseUrl) {
    return _baseUrl;
  }
  console.log('[api] window.electronAPI:', window.electronAPI);
  if (window.electronAPI) {
    const port = await window.electronAPI.getServerPort();
    _baseUrl = `http://localhost:${port}/api`;
    console.log('[api] Using Electron backend at:', _baseUrl);
  } else {
    // Fallback for non-Electron environments (e.g. dev with standalone vite)
    _baseUrl = '/api';
    console.warn('[api] No electronAPI found, falling back to:', _baseUrl);
  }
  return _baseUrl;
}

/** Reset cached base URL (useful if server restarts on a new port). */
export function resetBaseUrl(): void {
  _baseUrl = null;
}

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const base = await getBaseUrl();
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...opts?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

export const api = {
  // Routines
  getRoutines: (params?: { status?: string }) => {
    const sp = new URLSearchParams();
    if (params?.status) {
      sp.set('status', params.status);
    }
    const qs = sp.toString();
    return request<Routine[]>(`/routines${qs ? `?${qs}` : ''}`);
  },
  getRoutine: (id: string) => request<Routine>(`/routines/${id}`),
  createRoutine: (data: Partial<Routine>) =>
    request<Routine>('/routines', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateRoutine: (id: string, data: Partial<Routine>) =>
    request<Routine>(`/routines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  toggleRoutine: (id: string, enabled: boolean) =>
    request<Routine>(`/routines/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    }),
  deleteRoutine: (id: string) => request<void>(`/routines/${id}`, { method: 'DELETE' }),
  runRoutine: (id: string, text?: string) =>
    request<{ run_id: string }>(`/routines/${id}/run`, {
      method: 'POST',
      body: JSON.stringify(text ? { text } : {}),
    }),

  // Triggers
  getTriggers: (routineId: string) => request<Trigger[]>(`/routines/${routineId}/triggers`),
  createTrigger: (routineId: string, data: { type: string; config: Record<string, unknown> }) =>
    request<Trigger>(`/routines/${routineId}/triggers`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteTrigger: (triggerId: string) =>
    request<void>(`/triggers/${triggerId}`, { method: 'DELETE' }),

  // Runs
  getRuns: (params?: { routine_id?: string; status?: string; limit?: number; offset?: number }) => {
    const sp = new URLSearchParams();
    if (params?.routine_id) {
      sp.set('routine_id', params.routine_id);
    }
    if (params?.status) {
      sp.set('status', params.status);
    }
    if (params?.limit) {
      sp.set('limit', String(params.limit));
    }
    if (params?.offset) {
      sp.set('offset', String(params.offset));
    }
    const qs = sp.toString();
    return request<Run[]>(`/runs${qs ? `?${qs}` : ''}`);
  },
  getRun: (id: string) => request<Run>(`/runs/${id}`),
  getRunStats: () => request<{ running: number }>('/runs/stats'),
  getThread: (id: string) => request<Run[]>(`/runs/${id}/thread`),
  cancelRun: (id: string) =>
    request<{ status: string }>(`/runs/${id}/cancel`, {
      method: 'POST',
      body: '{}',
    }),
  replyToRun: (id: string, text: string, displayText?: string) =>
    request<{ run_id: string }>(`/runs/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ text, display_text: displayText }),
    }),
  answerQuestion: (runId: string, questionId: string, answer: string) =>
    request<{ ok: boolean }>(`/runs/${runId}/answer-question`, {
      method: 'POST',
      body: JSON.stringify({ questionId, answer }),
    }),

  // Settings
  getSettings: () => request<Setting[]>('/settings'),
  upsertSetting: (data: { key: string; value: string; is_secret: boolean }) =>
    request<Setting>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSetting: (key: string) =>
    request<void>(`/settings/${encodeURIComponent(key)}`, { method: 'DELETE' }),

  // Data
  resetData: () => request<{ ok: boolean }>('/reset', { method: 'POST', body: '{}' }),

  // Models
  getModels: () => request<ModelsResponse>('/models'),

  // Filesystem browser
  getMounts: () => request<MountsResponse>('/fs/mounts'),
  getHostMounts: () =>
    request<HostMountsResponse>('/host-mounts').catch(() => ({}) as HostMountsResponse),
  browseFs: (dirPath: string) => {
    return request<FsResponse>(`/fs?path=${encodeURIComponent(dirPath)}`);
  },

  // GitHub Copilot OAuth via OpenCode SDK
  copilotAuthorize: () =>
    request<{
      url: string;
      instructions: string;
      method: 'auto' | 'code';
    }>('/auth/github-copilot/authorize', { method: 'POST', body: '{}' }),

  copilotCallback: () =>
    request<{ status: string; error?: string }>('/auth/github-copilot/callback', {
      method: 'POST',
      body: '{}',
    }),

  // Gmail OAuth
  gmailAuthorize: () =>
    request<{ url: string }>('/auth/gmail/authorize', { method: 'POST', body: '{}' }),
  gmailStatus: () =>
    request<{ connected: boolean; email?: string }>('/auth/gmail/status'),
  gmailDisconnect: () =>
    request<{ ok: boolean }>('/auth/gmail/disconnect', { method: 'POST', body: '{}' }),
};
