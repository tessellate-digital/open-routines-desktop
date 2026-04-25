import React, { createRef } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { ComposerInput } from './ComposerInput';
import type { ComposerInputHandle } from './ComposerInput';

// ── Helpers ───────────────────────────────────────────────────────────────────

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

function render(
  ref: React.RefObject<ComposerInputHandle | null>,
  props: Record<string, unknown> = {}
) {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<ComposerInput ref={ref} {...(props as never)} />));
}

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function getDiv() {
  return container.querySelector<HTMLDivElement>('.composer-editable')!;
}

// ── setText / getDisplayText / getPlainText ───────────────────────────────────

describe('setText + getDisplayText', () => {
  it('round-trips plain text with no chips', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    act(() => ref.current!.setText('Hello world'));
    expect(ref.current!.getDisplayText()).toBe('Hello world');
  });

  it('round-trips a single chip', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    act(() => ref.current!.setText('@customTag:gmail-search(q=hello)'));
    expect(ref.current!.getDisplayText()).toBe('@customTag:gmail-search(q=hello) ');
  });

  it('round-trips text mixed with a chip', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    act(() => ref.current!.setText('Find @customTag:gmail-search(invoices) please'));
    const display = ref.current!.getDisplayText();
    expect(display).toContain('@customTag:gmail-search(invoices)');
    expect(display).toContain('Find');
    expect(display).toContain('please');
  });

  it('creates a span with mention-chip class for each chip', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    act(() => ref.current!.setText('@customTag:gmail-search(q=test)'));
    const chips = getDiv().querySelectorAll('.mention-chip');
    expect(chips.length).toBe(1);
    expect((chips[0] as HTMLElement).dataset.mentionAction).toBe('gmail-search');
    expect((chips[0] as HTMLElement).dataset.mentionValue).toBe('q=test');
  });

  it('sets chip contentEditable to false', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    act(() => ref.current!.setText('@customTag:notion-search(pages)'));
    const chip = getDiv().querySelector<HTMLElement>('.mention-chip')!;
    expect(chip.contentEditable).toBe('false');
  });

  it('places a non-breaking space after each chip', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    act(() => ref.current!.setText('@customTag:gmail-read(id=1)'));
    const chip = getDiv().querySelector('.mention-chip')!;
    const next = chip.nextSibling;
    expect(next?.nodeType).toBe(Node.TEXT_NODE);
    expect(next?.textContent).toBe('\u00a0');
  });
});

describe('getPlainText', () => {
  it('returns empty string for an empty editor', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    expect(ref.current!.getPlainText()).toBe('');
  });

  it('returns raw mention value (not display text) for chips', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    act(() => ref.current!.setText('@customTag:gmail-search(q=invoices)'));
    const plain = ref.current!.getPlainText();
    expect(plain).toContain('q=invoices');
    expect(plain).not.toContain('@customTag:');
  });

  it('converts non-breaking spaces to regular spaces', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    act(() => {
      getDiv().textContent = 'hello\u00a0world';
    });
    expect(ref.current!.getPlainText()).toBe('hello world');
  });
});

// ── clear ─────────────────────────────────────────────────────────────────────

describe('clear', () => {
  it('empties the editor', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    act(() => ref.current!.setText('some text'));
    act(() => ref.current!.clear());
    expect(getDiv().innerHTML).toBe('');
  });

  it('calls onChange with empty string', () => {
    const onChange = vi.fn();
    const ref = createRef<ComposerInputHandle>();
    render(ref, { onChange });
    act(() => ref.current!.setText('text'));
    onChange.mockClear();
    act(() => ref.current!.clear());
    expect(onChange).toHaveBeenCalledWith('');
  });
});

// ── insertChip ────────────────────────────────────────────────────────────────

describe('insertChip', () => {
  // jsdom clears the selection when focus() is called, so stub it out
  // for each insertChip test so the pre-configured range survives.
  function setSelectionAtEnd(div: HTMLDivElement, node: Text) {
    div.focus = () => {};
    const range = document.createRange();
    range.setStart(node, node.length);
    range.collapse(true);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);
  }

  it('replaces the @-trigger text with a chip span', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    const div = getDiv();
    const textNode = document.createTextNode('Find @search');
    div.appendChild(textNode);
    setSelectionAtEnd(div, textNode);
    act(() => ref.current!.insertChip('Search emails', 'q=hello', 'gmail-search'));
    const chip = div.querySelector<HTMLElement>('.mention-chip');
    expect(chip).not.toBeNull();
    expect(chip!.dataset.mentionAction).toBe('gmail-search');
    expect(chip!.dataset.mentionValue).toBe('q=hello');
  });

  it('removes trailing whitespace from the preceding text node', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    const div = getDiv();
    const textNode = document.createTextNode('word @x');
    div.appendChild(textNode);
    setSelectionAtEnd(div, textNode);
    act(() => ref.current!.insertChip('Label', 'val', 'gmail-search'));
    const chip = div.querySelector('.mention-chip')!;
    const prev = chip.previousSibling;
    if (prev) {
      expect(prev.textContent?.endsWith(' ')).toBe(false);
    }
  });

  it('always adds a single non-breaking space after the chip', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    const div = getDiv();
    const textNode = document.createTextNode('@query');
    div.appendChild(textNode);
    setSelectionAtEnd(div, textNode);
    act(() => ref.current!.insertChip('Label', 'val', 'gmail-search'));
    const chip = div.querySelector('.mention-chip')!;
    const next = chip.nextSibling;
    expect(next?.textContent).toBe('\u00a0');
  });

  it('does not double up spaces when a trailing space precedes @', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref);
    const div = getDiv();
    const textNode = document.createTextNode('hello @query');
    div.appendChild(textNode);
    setSelectionAtEnd(div, textNode);
    act(() => ref.current!.insertChip('Label', 'val', 'gmail-search'));
    const chip = div.querySelector('.mention-chip')!;
    // Exactly one space/nbsp after chip
    const after = chip.nextSibling?.textContent ?? '';
    expect(after.trim()).toBe('');
    expect(after.length).toBe(1);
    // Text before chip should not end with a space
    const before = chip.previousSibling?.textContent ?? '';
    expect(before).toBe('hello');
  });
});

// ── defaultValue ──────────────────────────────────────────────────────────────

describe('defaultValue', () => {
  it('pre-fills the editor with the default value', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref, { defaultValue: 'pre-filled text' });
    expect(getDiv().textContent).toBe('pre-filled text');
  });
});

// ── placeholder ───────────────────────────────────────────────────────────────

describe('placeholder', () => {
  it('sets data-placeholder attribute', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref, { placeholder: 'Type something…' });
    expect(getDiv().dataset.placeholder).toBe('Type something…');
  });
});

// ── disabled ──────────────────────────────────────────────────────────────────

describe('disabled', () => {
  it('sets contenteditable to false when disabled', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref, { disabled: true });
    expect(getDiv().getAttribute('contenteditable')).toBe('false');
  });

  it('sets contenteditable to true when not disabled', () => {
    const ref = createRef<ComposerInputHandle>();
    render(ref, { disabled: false });
    expect(getDiv().getAttribute('contenteditable')).toBe('true');
  });
});
