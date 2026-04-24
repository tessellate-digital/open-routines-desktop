import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, resetBaseUrl } from './api';

// Stub the Electron bridge so getBaseUrl() resolves synchronously
const mockGetServerPort = vi.fn().mockResolvedValue(3000);
vi.stubGlobal('window', {
  electronAPI: { getServerPort: mockGetServerPort },
});

const BASE = 'http://localhost:3000/api';

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  });
}

beforeEach(() => {
  resetBaseUrl();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api.answerPermission', () => {
  it('sends POST to /runs/:id/answer-permission with correct body', async () => {
    const fetchMock = mockFetch(200, { ok: true });
    vi.stubGlobal('fetch', fetchMock);

    const result = await api.answerPermission('run-abc', 'perm-xyz', 'once');

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${BASE}/runs/run-abc/answer-permission`);
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body as string)).toEqual({
      permissionId: 'perm-xyz',
      response: 'once',
    });
    expect(result).toEqual({ ok: true });
  });

  it('sends "always" as response value', async () => {
    const fetchMock = mockFetch(200, { ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await api.answerPermission('run-abc', 'perm-xyz', 'always');

    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(opts.body as string).response).toBe('always');
  });

  it('sends "reject" as response value', async () => {
    const fetchMock = mockFetch(200, { ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await api.answerPermission('run-abc', 'perm-xyz', 'reject');

    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(opts.body as string).response).toBe('reject');
  });

  it('throws on non-2xx response', async () => {
    const fetchMock = mockFetch(500, { detail: 'Internal error' });
    vi.stubGlobal('fetch', fetchMock);

    await expect(api.answerPermission('run-abc', 'perm-xyz', 'once')).rejects.toThrow();
  });

  it('sets Content-Type header to application/json', async () => {
    const fetchMock = mockFetch(200, { ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await api.answerPermission('run-1', 'perm-1', 'once');

    const [, opts] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((opts.headers as Record<string, string>)['Content-Type']).toBe('application/json');
  });
});
