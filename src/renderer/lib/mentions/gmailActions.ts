import { createElement } from 'react';
import {
  MagnifyingGlassIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  TagIcon,
} from '@heroicons/react/20/solid';
import type { MentionAction } from './mentionRegistry';

export const gmailActions: MentionAction[] = [
  {
    id: 'gmail-search',
    label: 'Search emails',
    group: 'Gmail',
    icon: createElement(MagnifyingGlassIcon, { width: 16, height: 16 }),
    keywords: ['gmail', 'email', 'search', 'inbox', 'find', 'mail'],
    onSelect: async () => 'gmail-search',
    renderer: () => 'Gmail: Search',
    feedRenderer: () => '[Gmail: Search emails]',
  },
  {
    id: 'gmail-read',
    label: 'Read email',
    group: 'Gmail',
    icon: createElement(EnvelopeIcon, { width: 16, height: 16 }),
    keywords: ['gmail', 'email', 'read', 'message', 'open'],
    onSelect: async () => 'gmail-read',
    renderer: () => 'Gmail: Read',
    feedRenderer: () => '[Gmail: Read email]',
  },
  {
    id: 'gmail-unread',
    label: 'Unread emails',
    group: 'Gmail',
    icon: createElement(EnvelopeOpenIcon, { width: 16, height: 16 }),
    keywords: ['gmail', 'unread', 'new', 'inbox', 'recent'],
    onSelect: async () => 'gmail-unread',
    renderer: () => 'Gmail: Unread',
    feedRenderer: () => '[Gmail: Unread emails]',
  },
  {
    id: 'gmail-labels',
    label: 'List labels',
    group: 'Gmail',
    icon: createElement(TagIcon, { width: 16, height: 16 }),
    keywords: ['gmail', 'labels', 'folders', 'categories'],
    onSelect: async () => 'gmail-labels',
    renderer: () => 'Gmail: Labels',
    feedRenderer: () => '[Gmail: List labels]',
  },
];
