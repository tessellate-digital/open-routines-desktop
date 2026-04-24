import type { MentionAction } from './mentionRegistry';

export const fileActions: MentionAction[] = [
  {
    id: 'file-browse',
    label: 'Browse files',
    group: 'Files',
    description: 'Pick a file or folder from your system',
    keywords: ['file', 'folder', 'directory', 'path', 'browse', 'open', 'attach'],
    onSelect: async () => {
      const path = await window.electronAPI?.selectPath();
      return path ?? null;
    },
    renderer: (value: unknown) => {
      const v = value as string;
      return v.split('/').pop() || v;
    },
    feedRenderer: (value: unknown) => value as string,
  },
];
