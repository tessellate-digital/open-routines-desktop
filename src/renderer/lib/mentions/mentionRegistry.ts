import { fileActions } from './fileActions';

export interface MentionAction {
  id: string;
  label: string;
  group: string;
  description?: string;
  keywords: string[];
  onSelect: () => Promise<any>;
  renderer: (value: any) => string;
}

export function filterActions(actions: MentionAction[], query: string): MentionAction[] {
  if (!query) {return actions;}
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
    if (!map.has(action.group)) {map.set(action.group, []);}
    map.get(action.group)!.push(action);
  }
  return Array.from(map.entries()).map(([group, items]) => ({ group, items }));
}

export const mentionActions: MentionAction[] = [...fileActions];
