import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { PermissionCard } from './PermissionCard';

// ── Minimal render helper (matches PermissionRadio.test.tsx pattern) ──────────

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

describe('PermissionCard', () => {
  describe('permission label display', () => {
    it('shows "Read file" for the read permission type', () => {
      render(<PermissionCard id="p1" permission="read" patterns={[]} responded={null} />);
      expect(container.textContent).toContain('Read file');
    });

    it('shows "Edit file" for the edit permission type', () => {
      render(<PermissionCard id="p1" permission="edit" patterns={[]} responded={null} />);
      expect(container.textContent).toContain('Edit file');
    });

    it('shows "Run command" for the bash permission type', () => {
      render(<PermissionCard id="p1" permission="bash" patterns={[]} responded={null} />);
      expect(container.textContent).toContain('Run command');
    });

    it('shows "Web fetch" for the webfetch permission type', () => {
      render(<PermissionCard id="p1" permission="webfetch" patterns={[]} responded={null} />);
      expect(container.textContent).toContain('Web fetch');
    });

    it('shows "Web search" for the websearch permission type', () => {
      render(<PermissionCard id="p1" permission="websearch" patterns={[]} responded={null} />);
      expect(container.textContent).toContain('Web search');
    });

    it('falls back to the raw permission name for unknown types', () => {
      render(
        <PermissionCard id="p1" permission="some_custom_tool" patterns={[]} responded={null} />
      );
      expect(container.textContent).toContain('some_custom_tool');
    });
  });

  describe('action buttons when not yet responded', () => {
    it('shows Allow once, Always allow, and Deny buttons', () => {
      render(<PermissionCard id="p1" permission="bash" patterns={[]} responded={null} />);
      expect(buttonLabels()).toEqual(['Allow once', 'Always allow', 'Deny']);
    });

    it('calls onRespond with "once" when Allow once is clicked', async () => {
      const onRespond = vi.fn();
      render(
        <PermissionCard
          id="p1"
          permission="bash"
          patterns={[]}
          responded={null}
          onRespond={onRespond}
        />
      );
      await act(async () => {
        buttons()[0].click();
      });
      expect(onRespond).toHaveBeenCalledOnce();
      expect(onRespond).toHaveBeenCalledWith('p1', 'once');
    });

    it('calls onRespond with "always" when Always allow is clicked', async () => {
      const onRespond = vi.fn();
      render(
        <PermissionCard
          id="p1"
          permission="bash"
          patterns={[]}
          responded={null}
          onRespond={onRespond}
        />
      );
      await act(async () => {
        buttons()[1].click();
      });
      expect(onRespond).toHaveBeenCalledWith('p1', 'always');
    });

    it('calls onRespond with "reject" when Deny is clicked', async () => {
      const onRespond = vi.fn();
      render(
        <PermissionCard
          id="p1"
          permission="bash"
          patterns={[]}
          responded={null}
          onRespond={onRespond}
        />
      );
      await act(async () => {
        buttons()[2].click();
      });
      expect(onRespond).toHaveBeenCalledWith('p1', 'reject');
    });

    it('disables all buttons after the first click', async () => {
      const onRespond = vi.fn();
      render(
        <PermissionCard
          id="p1"
          permission="bash"
          patterns={[]}
          responded={null}
          onRespond={onRespond}
        />
      );
      await act(async () => {
        buttons()[0].click();
      });
      expect(buttons().every((b) => b.disabled)).toBe(true);
    });

    it('does not throw when onRespond is not provided', async () => {
      render(<PermissionCard id="p1" permission="bash" patterns={[]} responded={null} />);
      await expect(
        act(async () => {
          buttons()[0].click();
        })
      ).resolves.not.toThrow();
    });
  });

  describe('responded state', () => {
    it('shows "Allowed once" and hides action buttons when responded is "once"', () => {
      render(<PermissionCard id="p1" permission="bash" patterns={[]} responded="once" />);
      expect(container.textContent).toContain('Allowed once');
      expect(buttons()).toHaveLength(0);
    });

    it('shows "Always allowed" when responded is "always"', () => {
      render(<PermissionCard id="p1" permission="bash" patterns={[]} responded="always" />);
      expect(container.textContent).toContain('Always allowed');
    });

    it('shows "Denied" when responded is "reject"', () => {
      render(<PermissionCard id="p1" permission="bash" patterns={[]} responded="reject" />);
      expect(container.textContent).toContain('Denied');
    });
  });

  describe('patterns display', () => {
    it('renders each pattern as a <code> element', () => {
      render(
        <PermissionCard
          id="p1"
          permission="edit"
          patterns={['~/projects/**', '/tmp/*.log']}
          responded={null}
        />
      );
      const codes = Array.from(container.querySelectorAll('code'));
      const codeTexts = codes.map((c) => c.textContent);
      expect(codeTexts).toContain('~/projects/**');
      expect(codeTexts).toContain('/tmp/*.log');
    });

    it('renders no <code> elements when patterns is empty', () => {
      render(<PermissionCard id="p1" permission="bash" patterns={[]} responded={null} />);
      expect(container.querySelectorAll('code')).toHaveLength(0);
    });
  });

  describe('header', () => {
    it('shows the "Permission required" label', () => {
      render(<PermissionCard id="p1" permission="bash" patterns={[]} responded={null} />);
      expect(container.textContent).toContain('Permission required');
    });
  });
});
