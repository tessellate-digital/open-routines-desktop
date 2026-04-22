/**
 * permissionBridge — decouples the backend relay from the Electron dialog API.
 *
 * The main process registers a handler via setPermissionDialogHandler() at startup.
 * The event relay calls showPermissionDialog() when a permission.asked event fires.
 */

export type PermissionDialogResponse = 'once' | 'always' | 'reject';

interface PermissionDialogRequest {
  title: string;
  detail: string;
  permissionType: string;
}

type PermissionDialogHandler = (req: PermissionDialogRequest) => Promise<PermissionDialogResponse>;

let handler: PermissionDialogHandler | null = null;

export function setPermissionDialogHandler(fn: PermissionDialogHandler): void {
  handler = fn;
}

export async function showPermissionDialog(
  req: PermissionDialogRequest
): Promise<PermissionDialogResponse> {
  if (!handler) {
    return 'reject';
  }
  return handler(req);
}
