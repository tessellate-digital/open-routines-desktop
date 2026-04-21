import type { MentionAction } from './mentionRegistry';

export const fileActions: MentionAction[] = [
  {
    id: 'file-browse',
    label: 'Browse files',
    group: 'Files',
    description: 'Pick a file from your system',
    keywords: ['file', 'path', 'browse', 'open', 'attach'],
    onSelect: async () => {
      const path = await window.electronAPI?.selectFile();
      return path ?? null;
    },
    renderer: (value: unknown) => {
      const v = value as string;
      return v.split('/').pop() || v;
    },
    feedRenderer: (value: unknown) => value as string,
  },
];
