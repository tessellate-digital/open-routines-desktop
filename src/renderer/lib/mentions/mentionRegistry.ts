import { fileActions } from './fileActions';
import { gmailActions } from './gmailActions';
import { notionActions } from './notionActions';

export interface MentionAction {
  id: string;
  label: string;
  group: string;
  description?: string;
  icon?: import('react').ReactNode;
  keywords: string[];
  onSelect: () => Promise<unknown>;
  renderer: (value: unknown) => string;
  feedRenderer?: (value: unknown) => string;
}

export function filterActions(actions: MentionAction[], query: string): MentionAction[] {
  if (!query) {
    return actions;
  }
  const q = query.toLowerCase();
  return actions.filter(
    (a) =>
      a.label.toLowerCase().includes(q) ||
      (a.description ?? '').toLowerCase().includes(q) ||
      a.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

export function groupActions(
  actions: MentionAction[]
): { group: string; items: MentionAction[] }[] {
  const map = new Map<string, MentionAction[]>();
  for (const action of actions) {
    if (!map.has(action.group)) {
      map.set(action.group, []);
    }
    map.get(action.group)!.push(action);
  }
  return Array.from(map.entries()).map(([group, items]) => ({ group, items }));
}

export const mentionActions: MentionAction[] = [...fileActions, ...gmailActions, ...notionActions];

export function findActionById(id: string): MentionAction | undefined {
  return mentionActions.find((a) => a.id === id);
}
