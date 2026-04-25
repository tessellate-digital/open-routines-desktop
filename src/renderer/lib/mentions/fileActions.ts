import { createElement } from 'react';
import { FolderIcon } from '@heroicons/react/20/solid';
import type { MentionAction } from './mentionRegistry';

export const fileActions: MentionAction[] = [
  {
    id: 'file-browse',
    label: 'Browse',
    group: 'Files',
    icon: createElement(FolderIcon, { width: 16, height: 16 }),
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
