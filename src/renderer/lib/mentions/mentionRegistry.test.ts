import { describe, it, expect } from 'vitest';
import {
  filterActions,
  groupActions,
  findActionById,
  mentionActions,
  type MentionAction,
} from './mentionRegistry';

const makeAction = (overrides: Partial<MentionAction> = {}): MentionAction => ({
  id: 'test-action',
  label: 'Test Action',
  group: 'General',
  keywords: ['test'],
  onSelect: async () => 'value',
  renderer: (v: string) => v,
  ...overrides,
});

describe('filterActions', () => {
  const actions: MentionAction[] = [
    makeAction({ id: 'a', label: 'Browse files', group: 'Files', keywords: ['file', 'path'] }),
    makeAction({ id: 'b', label: 'Open URL', group: 'Web', keywords: ['url', 'link'] }),
    makeAction({
      id: 'c',
      label: 'Run script',
      group: 'Code',
      description: 'Execute a shell script',
      keywords: ['shell'],
    }),
  ];

  it('returns all actions when query is empty', () => {
    expect(filterActions(actions, '')).toHaveLength(3);
  });

  it('filters by label (case-insensitive)', () => {
    const result = filterActions(actions, 'browse');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a');
  });

  it('filters by keyword', () => {
    const result = filterActions(actions, 'url');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('b');
  });

  it('filters by description', () => {
    const result = filterActions(actions, 'shell script');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('c');
  });

  it('returns empty array when no match', () => {
    expect(filterActions(actions, 'zzznomatch')).toHaveLength(0);
  });

  it('matches partial strings', () => {
    const result = filterActions(actions, 'fil');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a');
  });
});

describe('groupActions', () => {
  it('groups actions by group name', () => {
    const actions: MentionAction[] = [
      makeAction({ id: 'a', label: 'A', group: 'Files' }),
      makeAction({ id: 'b', label: 'B', group: 'Web' }),
      makeAction({ id: 'c', label: 'C', group: 'Files' }),
    ];
    const groups = groupActions(actions);
    expect(groups).toHaveLength(2);

    const filesGroup = groups.find((g) => g.group === 'Files');
    expect(filesGroup?.items).toHaveLength(2);
    expect(filesGroup?.items.map((i) => i.id)).toEqual(['a', 'c']);

    const webGroup = groups.find((g) => g.group === 'Web');
    expect(webGroup?.items).toHaveLength(1);
  });

  it('preserves insertion order of groups', () => {
    const actions: MentionAction[] = [
      makeAction({ id: '1', group: 'Z' }),
      makeAction({ id: '2', group: 'A' }),
      makeAction({ id: '3', group: 'M' }),
    ];
    const groups = groupActions(actions);
    expect(groups.map((g) => g.group)).toEqual(['Z', 'A', 'M']);
  });

  it('returns empty array for empty input', () => {
    expect(groupActions([])).toEqual([]);
  });
});

describe('findActionById', () => {
  it('returns the matching action', () => {
    const action = findActionById('file-browse');
    expect(action).toBeDefined();
    expect(action?.id).toBe('file-browse');
  });

  it('returns undefined for unknown id', () => {
    expect(findActionById('does-not-exist')).toBeUndefined();
  });
});

describe('fileActions renderers', () => {
  it('renderer returns just the filename', () => {
    const action = findActionById('file-browse')!;
    expect(action.renderer('/Users/loic/Documents/image.png')).toBe('image.png');
  });

  it('renderer falls back to full value when no slash', () => {
    const action = findActionById('file-browse')!;
    expect(action.renderer('image.png')).toBe('image.png');
  });

  it('feedRenderer returns the full path', () => {
    const action = findActionById('file-browse')!;
    expect(action.feedRenderer!('/Users/loic/Documents/image.png')).toBe(
      '/Users/loic/Documents/image.png'
    );
  });

  it('mentionActions is non-empty', () => {
    expect(mentionActions.length).toBeGreaterThan(0);
  });
});

describe('Gmail actions', () => {
  const gmailIds = ['gmail-search', 'gmail-read', 'gmail-unread', 'gmail-labels'];

  it.each(gmailIds)('action %s is registered', (id) => {
    expect(findActionById(id)).toBeDefined();
  });

  it.each(gmailIds)('action %s belongs to Gmail group', (id) => {
    expect(findActionById(id)?.group).toBe('Gmail');
  });

  it.each(gmailIds)('action %s has a label', (id) => {
    expect(findActionById(id)?.label).toBeTruthy();
  });

  it.each(gmailIds)('action %s has keywords including "gmail"', (id) => {
    expect(findActionById(id)?.keywords).toContain('gmail');
  });

  it.each(gmailIds)('action %s renderer returns a non-empty string', async (id) => {
    const action = findActionById(id)!;
    const value = await action.onSelect();
    expect(action.renderer(value)).toBeTruthy();
  });

  it('gmail-search is found when filtering by "search"', () => {
    const results = filterActions(mentionActions, 'search');
    expect(results.some((a) => a.id === 'gmail-search')).toBe(true);
  });

  it('gmail actions are grouped together', () => {
    const groups = groupActions(mentionActions.filter((a) => a.group === 'Gmail'));
    expect(groups).toHaveLength(1);
    expect(groups[0].group).toBe('Gmail');
    expect(groups[0].items.length).toBeGreaterThanOrEqual(4);
  });
});

describe('Notion actions', () => {
  const notionIds = [
    'notion-search',
    'notion-read',
    'notion-create',
    'notion-update',
    'notion-query',
    'notion-create-database',
    'notion-append',
    'notion-list-comments',
    'notion-create-comment',
  ];

  it.each(notionIds)('action %s is registered', (id) => {
    expect(findActionById(id)).toBeDefined();
  });

  it.each(notionIds)('action %s belongs to Notion group', (id) => {
    expect(findActionById(id)?.group).toBe('Notion');
  });

  it.each(notionIds)('action %s has keywords including "notion"', (id) => {
    expect(findActionById(id)?.keywords).toContain('notion');
  });

  it.each(notionIds)('action %s renderer returns a non-empty string', async (id) => {
    const action = findActionById(id)!;
    const value = await action.onSelect();
    expect(action.renderer(value)).toBeTruthy();
  });

  it('notion actions are grouped together', () => {
    const groups = groupActions(mentionActions.filter((a) => a.group === 'Notion'));
    expect(groups).toHaveLength(1);
    expect(groups[0].group).toBe('Notion');
    expect(groups[0].items.length).toBeGreaterThanOrEqual(9);
  });

  it('notion-search is found when filtering by "notion"', () => {
    const results = filterActions(mentionActions, 'notion');
    expect(results.some((a) => a.group === 'Notion')).toBe(true);
  });

  it('notion-query is found when filtering by "database"', () => {
    const results = filterActions(mentionActions, 'database');
    expect(results.some((a) => a.id === 'notion-query')).toBe(true);
  });
});
