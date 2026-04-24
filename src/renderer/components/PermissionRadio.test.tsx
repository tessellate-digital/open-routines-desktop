import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { PermissionRadio } from './PermissionRadio';

// ── Minimal render helper (no @testing-library/react needed) ─────────────────

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

function render(ui: React.ReactElement) {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(ui);
  });
}

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

function buttons() {
  return Array.from(container.querySelectorAll<HTMLButtonElement>('button'));
}

function buttonLabels() {
  return buttons().map((b) => b.textContent?.trim());
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PermissionRadio', () => {
  describe('rendering', () => {
    it('renders exactly three option buttons', () => {
      render(<PermissionRadio value="allow" />);
      expect(buttons()).toHaveLength(3);
    });

    it('renders Allow, Ask, and Deny labels in order', () => {
      render(<PermissionRadio value="allow" />);
      expect(buttonLabels()).toEqual(['Allow', 'Ask', 'Deny']);
    });
  });

  describe('active state', () => {
    it('applies the green active class to the Allow button when value is "allow"', () => {
      render(<PermissionRadio value="allow" />);
      const [allow] = buttons();
      expect(allow.className).toContain('bg-success/20');
      expect(allow.className).toContain('text-success');
    });

    it('applies the blue active class to the Ask button when value is "ask"', () => {
      render(<PermissionRadio value="ask" />);
      const [, ask] = buttons();
      expect(ask.className).toContain('bg-orange-500/20');
      expect(ask.className).toContain('text-orange-500');
    });

    it('applies the red active class to the Deny button when value is "deny"', () => {
      render(<PermissionRadio value="deny" />);
      const [, , deny] = buttons();
      expect(deny.className).toContain('bg-destructive/20');
      expect(deny.className).toContain('text-destructive');
    });

    it('does not apply the active class to inactive options', () => {
      render(<PermissionRadio value="allow" />);
      const [, ask, deny] = buttons();
      expect(ask.className).not.toContain('bg-orange-500/20');
      expect(deny.className).not.toContain('bg-destructive/20');
    });
  });

  describe('readOnly mode', () => {
    it('disables all buttons when readOnly is true', () => {
      render(<PermissionRadio value="allow" readOnly />);
      expect(buttons().every((b) => b.disabled)).toBe(true);
    });

    it('does not disable buttons when readOnly is false', () => {
      render(<PermissionRadio value="allow" readOnly={false} />);
      expect(buttons().every((b) => !b.disabled)).toBe(true);
    });

    it('dims inactive options with muted class in readOnly mode', () => {
      render(<PermissionRadio value="allow" readOnly />);
      const [, ask, deny] = buttons();
      // Inactive+readOnly options get text-muted-foreground/40
      expect(ask.className).toContain('text-muted-foreground/40');
      expect(deny.className).toContain('text-muted-foreground/40');
    });

    it('active option still shows its colour in readOnly mode', () => {
      render(<PermissionRadio value="ask" readOnly />);
      const [, ask] = buttons();
      expect(ask.className).toContain('bg-orange-500/20');
    });
  });

  describe('onChange interactions', () => {
    it('calls onChange with "ask" when the Ask button is clicked', () => {
      const onChange = vi.fn();
      render(<PermissionRadio value="allow" onChange={onChange} />);
      act(() => {
        buttons()[1].click();
      });
      expect(onChange).toHaveBeenCalledWith('ask');
    });

    it('calls onChange with "deny" when the Deny button is clicked', () => {
      const onChange = vi.fn();
      render(<PermissionRadio value="allow" onChange={onChange} />);
      act(() => {
        buttons()[2].click();
      });
      expect(onChange).toHaveBeenCalledWith('deny');
    });

    it('calls onChange with "allow" when the Allow button is clicked', () => {
      const onChange = vi.fn();
      render(<PermissionRadio value="deny" onChange={onChange} />);
      act(() => {
        buttons()[0].click();
      });
      expect(onChange).toHaveBeenCalledWith('allow');
    });

    it('does not call onChange in readOnly mode', () => {
      const onChange = vi.fn();
      render(<PermissionRadio value="allow" onChange={onChange} readOnly />);
      act(() => {
        buttons()[1].click();
      });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not call onChange when no onChange prop is provided', () => {
      render(<PermissionRadio value="allow" />);
      expect(() => {
        act(() => {
          buttons()[1].click();
        });
      }).not.toThrow();
    });
  });
});
