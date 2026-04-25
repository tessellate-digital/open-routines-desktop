import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { MentionPopover } from './MentionPopover';
import type { MentionAction } from '../../lib/mentions/mentionRegistry';

// ── Helpers ───────────────────────────────────────────────────────────────────

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

function render(ui: React.ReactElement) {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(ui));
}

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function makeAction(overrides: Partial<MentionAction> = {}): MentionAction {
  return {
    id: 'test-action',
    label: 'Test Action',
    group: 'General',
    keywords: ['test'],
    onSelect: async () => 'value',
    renderer: (v) => String(v),
    ...overrides,
  };
}

function defaultProps(overrides = {}) {
  return {
    groups: [],
    activeIndex: 0,
    caretPos: null,
    onSelect: vi.fn(),
    onDismiss: vi.fn(),
    ...overrides,
  };
}

// ── Empty state ───────────────────────────────────────────────────────────────

describe('empty state', () => {
  it('shows "No matching actions" when all groups are empty', () => {
    render(<MentionPopover {...defaultProps({ groups: [{ group: 'Files', items: [] }] })} />);
    expect(container.textContent).toContain('No matching actions');
  });

  it('shows "No matching actions" when groups array is empty', () => {
    render(<MentionPopover {...defaultProps({ groups: [] })} />);
    expect(container.textContent).toContain('No matching actions');
  });
});

// ── Group rendering ───────────────────────────────────────────────────────────

describe('group rendering', () => {
  it('renders a group header', () => {
    const groups = [{ group: 'Gmail', items: [makeAction({ group: 'Gmail' })] }];
    render(<MentionPopover {...defaultProps({ groups })} />);
    expect(container.textContent).toContain('Gmail');
  });

  it('renders item labels', () => {
    const groups = [
      {
        group: 'Gmail',
        items: [
          makeAction({ id: 'a', label: 'Search emails', group: 'Gmail' }),
          makeAction({ id: 'b', label: 'Read email', group: 'Gmail' }),
        ],
      },
    ];
    render(<MentionPopover {...defaultProps({ groups })} />);
    expect(container.textContent).toContain('Search emails');
    expect(container.textContent).toContain('Read email');
  });

  it('renders a divider between groups', () => {
    const groups = [
      { group: 'Gmail', items: [makeAction({ group: 'Gmail' })] },
      { group: 'Notion', items: [makeAction({ group: 'Notion' })] },
    ];
    render(<MentionPopover {...defaultProps({ groups })} />);
    const dividers = container.querySelectorAll('.mention-popover-group-divider');
    expect(dividers.length).toBe(1);
  });

  it('renders no divider for a single group', () => {
    const groups = [{ group: 'Files', items: [makeAction()] }];
    render(<MentionPopover {...defaultProps({ groups })} />);
    const dividers = container.querySelectorAll('.mention-popover-group-divider');
    expect(dividers.length).toBe(0);
  });
});

// ── Active item ───────────────────────────────────────────────────────────────

describe('active item', () => {
  it('marks the item at activeIndex with the "active" class', () => {
    const groups = [
      {
        group: 'Files',
        items: [makeAction({ id: 'a', label: 'First' }), makeAction({ id: 'b', label: 'Second' })],
      },
    ];
    render(<MentionPopover {...defaultProps({ groups, activeIndex: 1 })} />);
    const items = container.querySelectorAll('.mention-popover-item');
    expect(items[0].classList.contains('active')).toBe(false);
    expect(items[1].classList.contains('active')).toBe(true);
  });

  it('marks first item as active when activeIndex is 0', () => {
    const groups = [{ group: 'Files', items: [makeAction({ id: 'a' }), makeAction({ id: 'b' })] }];
    render(<MentionPopover {...defaultProps({ groups, activeIndex: 0 })} />);
    const items = container.querySelectorAll('.mention-popover-item');
    expect(items[0].classList.contains('active')).toBe(true);
  });

  it('tracks active index across groups (flat indexing)', () => {
    const groups = [
      { group: 'Gmail', items: [makeAction({ id: 'g1' }), makeAction({ id: 'g2' })] },
      { group: 'Notion', items: [makeAction({ id: 'n1' })] },
    ];
    render(<MentionPopover {...defaultProps({ groups, activeIndex: 2 })} />);
    const items = container.querySelectorAll('.mention-popover-item');
    expect(items[2].classList.contains('active')).toBe(true);
    expect(items[0].classList.contains('active')).toBe(false);
  });
});

// ── onSelect ──────────────────────────────────────────────────────────────────

describe('onSelect', () => {
  it('calls onSelect with the item when mouseDown fires on a button', () => {
    const onSelect = vi.fn();
    const action = makeAction({ id: 'gmail-search', label: 'Search emails' });
    const groups = [{ group: 'Gmail', items: [action] }];
    render(<MentionPopover {...defaultProps({ groups, onSelect })} />);

    const btn = container.querySelector<HTMLButtonElement>('.mention-popover-item')!;
    act(() => btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
    expect(onSelect).toHaveBeenCalledWith(action);
  });
});

// ── onDismiss ─────────────────────────────────────────────────────────────────

describe('onDismiss', () => {
  it('calls onDismiss when clicking outside the popover', () => {
    const onDismiss = vi.fn();
    const groups = [{ group: 'Files', items: [makeAction()] }];
    render(<MentionPopover {...defaultProps({ groups, onDismiss })} />);

    act(() => document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
    expect(onDismiss).toHaveBeenCalled();
  });
});

// ── caretPos positioning ──────────────────────────────────────────────────────

describe('caretPos positioning', () => {
  it('uses fixed position when caretPos is provided', () => {
    const groups = [{ group: 'Files', items: [makeAction()] }];
    render(<MentionPopover {...defaultProps({ groups, caretPos: { top: 200, left: 100 } })} />);
    const popover = container.querySelector<HTMLDivElement>('.mention-popover')!;
    expect(popover.style.position).toBe('fixed');
    expect(popover.style.top).toBe('200px');
    expect(popover.style.left).toBe('100px');
  });

  it('uses no inline position style when caretPos is null', () => {
    const groups = [{ group: 'Files', items: [makeAction()] }];
    render(<MentionPopover {...defaultProps({ groups, caretPos: null })} />);
    const popover = container.querySelector<HTMLDivElement>('.mention-popover')!;
    expect(popover.style.position).toBe('');
  });
});
