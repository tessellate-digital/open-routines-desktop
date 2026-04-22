import { describe, it, expect, vi, beforeEach } from 'vitest';

// Each test gets a fresh module so the module-level `handler` singleton is reset.
beforeEach(() => {
  vi.resetModules();
});

describe('permissionBridge', () => {
  it('returns "reject" when no handler is registered', async () => {
    const { showPermissionDialog } = await import('./permissionBridge');
    await expect(
      showPermissionDialog({ title: 'Test', detail: 'some/path', permissionType: 'bash' })
    ).resolves.toBe('reject');
  });

  it('calls the registered handler with the exact request object', async () => {
    const { setPermissionDialogHandler, showPermissionDialog } = await import('./permissionBridge');
    const handler = vi.fn().mockResolvedValue('once');
    setPermissionDialogHandler(handler);

    const req = { title: 'Allow shell?', detail: 'rm -rf /tmp/x', permissionType: 'bash' };
    await showPermissionDialog(req);

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(req);
  });

  it.each([['once'], ['always'], ['reject']] as const)(
    'forwards "%s" response from the handler',
    async (response) => {
      const { setPermissionDialogHandler, showPermissionDialog } =
        await import('./permissionBridge');
      setPermissionDialogHandler(vi.fn().mockResolvedValue(response));
      await expect(
        showPermissionDialog({ title: '', detail: '', permissionType: 'edit' })
      ).resolves.toBe(response);
    }
  );

  it('uses the most recently registered handler when called multiple times', async () => {
    const { setPermissionDialogHandler, showPermissionDialog } = await import('./permissionBridge');
    const first = vi.fn().mockResolvedValue('once');
    const second = vi.fn().mockResolvedValue('always');
    setPermissionDialogHandler(first);
    setPermissionDialogHandler(second);

    await showPermissionDialog({ title: '', detail: '', permissionType: 'bash' });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
  });
});
