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
