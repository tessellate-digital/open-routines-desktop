import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import {
  MagnifyingGlassIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  TagIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  CircleStackIcon,
  PlusCircleIcon,
} from '@heroicons/react/20/solid';

const GmailIcon = () => (
  <svg viewBox="0 0 256 193" width="16" height="16" fill="none">
    <path
      fill="#4285F4"
      d="M58.182 192.05V93.14L0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455z"
    />
    <path
      fill="#34A853"
      d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-58.182 43.635z"
    />
    <path fill="#EA4335" d="M58.182 93.14V17.504L128 69.868l69.818-52.364V93.14L128 145.504z" />
    <path
      fill="#FBBC04"
      d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945z"
    />
    <path
      fill="#C5221F"
      d="M0 49.504l58.182 43.636V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23z"
    />
  </svg>
);

const NotionIcon = () => (
  <svg viewBox="0 0 256 268" width="16" height="16" fill="none">
    <path
      fill="#FFF"
      d="M16.092 11.538L164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188"
    />
    <path
      fill="#000"
      d="M164.09.608L16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608M69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921M212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404z"
    />
  </svg>
);

interface PopoverItem {
  icon: ReactNode;
  label: string;
  active?: boolean;
}

interface PopoverGroup {
  name: string;
  brandIcon: ReactNode;
  items: PopoverItem[];
}

function MockPopover({ groups, visible }: { groups: PopoverGroup[]; visible: boolean }) {
  return (
    <div
      className="absolute left-2 z-50 w-64 rounded-xl border border-muted bg-canvas shadow-lg transition-all duration-200"
      style={{
        bottom: 'calc(100% + 6px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(4px)',
        pointerEvents: 'none',
      }}
    >
      <div className="py-1">
        {groups.map((group, gi) => (
          <div key={group.name}>
            {gi > 0 && <div className="border-t border-muted mt-1" />}
            <div className="flex items-center gap-2.5 px-3 pt-2.5 pb-1 text-[13px] font-semibold text-muted-foreground">
              <span className="w-5 shrink-0 flex items-center justify-center">
                {group.brandIcon}
              </span>
              {group.name}
            </div>
            {group.items.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 py-1.5 px-3 text-[13px] ${item.active ? 'bg-muted/60' : ''}`}
              >
                <span
                  className="w-5 shrink-0 flex items-center justify-center"
                  style={{ color: '#ec4899' }}
                >
                  {item.icon}
                </span>
                <span className="text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MentionChip({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[13px] font-medium"
      style={{
        background: 'linear-gradient(135deg, #4f46e5, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  );
}

type Segment =
  | { type: 'text'; value: string }
  | { type: 'chip'; label: string }
  | { type: 'at'; query: string };

interface Step {
  segments: Segment[];
  popover: 'gmail' | 'notion' | null;
  popoverHighlight?: string;
}

const GMAIL_POPOVER: PopoverGroup[] = [
  {
    name: 'Gmail',
    brandIcon: <GmailIcon />,
    items: [
      {
        icon: <MagnifyingGlassIcon width={16} height={16} />,
        label: 'Search emails',
        active: true,
      },
      { icon: <EnvelopeIcon width={16} height={16} />, label: 'Read email' },
      { icon: <EnvelopeOpenIcon width={16} height={16} />, label: 'Unread emails' },
      { icon: <TagIcon width={16} height={16} />, label: 'List labels' },
    ],
  },
];

const NOTION_POPOVER: PopoverGroup[] = [
  {
    name: 'Notion',
    brandIcon: <NotionIcon />,
    items: [
      { icon: <MagnifyingGlassIcon width={16} height={16} />, label: 'Search workspace' },
      { icon: <DocumentTextIcon width={16} height={16} />, label: 'Read page' },
      { icon: <PencilSquareIcon width={16} height={16} />, label: 'Create page' },
      { icon: <ArrowPathIcon width={16} height={16} />, label: 'Update page', active: true },
      { icon: <CircleStackIcon width={16} height={16} />, label: 'Query databases' },
      { icon: <PlusCircleIcon width={16} height={16} />, label: 'Create database' },
    ],
  },
];

const TYPING_SPEED = 55;
const CHIP_PAUSE = 600;
const AT_PAUSE = 400;
const END_PAUSE = 3000;
const RESTART_PAUSE = 800;

const FULL_TEXT_1 = ' for any new invoices, and then ';
const FULL_TEXT_2 = ' my expense tracker';

function buildSteps(): Step[] {
  const steps: Step[] = [];

  // Phase 1: type "@"
  steps.push({ segments: [{ type: 'at', query: '' }], popover: 'gmail' });

  // Phase 2: pause on popover, then select → chip
  steps.push({ segments: [{ type: 'chip', label: 'Gmail: Search' }], popover: null });

  // Phase 3: type middle text char by char
  for (let i = 1; i <= FULL_TEXT_1.length; i++) {
    steps.push({
      segments: [
        { type: 'chip', label: 'Gmail: Search' },
        { type: 'text', value: FULL_TEXT_1.slice(0, i) },
      ],
      popover: null,
    });
  }

  // Phase 4: type "@" for notion
  steps.push({
    segments: [
      { type: 'chip', label: 'Gmail: Search' },
      { type: 'text', value: FULL_TEXT_1 },
      { type: 'at', query: '' },
    ],
    popover: 'notion',
  });

  // Phase 5: select notion → chip
  steps.push({
    segments: [
      { type: 'chip', label: 'Gmail: Search' },
      { type: 'text', value: FULL_TEXT_1 },
      { type: 'chip', label: 'Notion: Update' },
    ],
    popover: null,
  });

  // Phase 6: type trailing text
  for (let i = 1; i <= FULL_TEXT_2.length; i++) {
    steps.push({
      segments: [
        { type: 'chip', label: 'Gmail: Search' },
        { type: 'text', value: FULL_TEXT_1 },
        { type: 'chip', label: 'Notion: Update' },
        { type: 'text', value: FULL_TEXT_2.slice(0, i) },
      ],
      popover: null,
    });
  }

  return steps;
}

const STEPS = buildSteps();

export function PromptMockup() {
  const [stepIdx, setStepIdx] = useState(-1);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const runSequence = useCallback(() => {
    clearTimers();
    const acc: ReturnType<typeof setTimeout>[] = [];
    let t = RESTART_PAUSE;

    for (let i = 0; i < STEPS.length; i++) {
      const step = STEPS[i];
      const isAt = step.popover !== null;
      const isChipInsert = i > 0 && STEPS[i - 1].popover !== null && step.popover === null;

      acc.push(setTimeout(() => setStepIdx(i), t));

      if (isAt) {
        t += AT_PAUSE + CHIP_PAUSE;
      } else if (isChipInsert) {
        t += CHIP_PAUSE;
      } else {
        t += TYPING_SPEED;
      }
    }

    // End pause then restart
    acc.push(
      setTimeout(() => {
        setStepIdx(-1);
      }, t + END_PAUSE)
    );

    acc.push(
      setTimeout(
        () => {
          runSequence();
        },
        t + END_PAUSE + RESTART_PAUSE
      )
    );

    timersRef.current = acc;
  }, [clearTimers]);

  useEffect(() => {
    runSequence();
    return clearTimers;
  }, [runSequence, clearTimers]);

  const step = stepIdx >= 0 ? STEPS[stepIdx] : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="m-0 mb-1 text-heading tracking-title font-semibold">Invoice tracker</h1>
        <div className="flex items-center gap-2 text-muted-foreground text-body-sm font-mono">
          <span className="rounded-full bg-accent/15 text-accent px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
            gmail
          </span>
          <span>·</span>
          <span className="text-fg-dim">subject:invoice</span>
        </div>
      </div>

      {/* Prompt section */}
      <div className="mb-6">
        <label className="block text-[14px] font-semibold text-foreground mb-1">Prompt</label>
        <p className="text-[13px] text-muted-foreground mb-2">
          Type{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[12px] font-mono text-foreground">
            @
          </code>{' '}
          to insert special commands.
        </p>

        <div className="relative">
          {/* Popover */}
          {step?.popover === 'gmail' && <MockPopover groups={GMAIL_POPOVER} visible />}
          {step?.popover === 'notion' && <MockPopover groups={NOTION_POPOVER} visible />}

          {/* Input area */}
          <div className="min-h-[160px] rounded-lg border border-muted bg-canvas px-3 py-3 text-[14px] leading-relaxed text-foreground">
            {step ? (
              <span>
                {step.segments.map((seg, i) => {
                  if (seg.type === 'chip') {
                    return <MentionChip key={i}>{seg.label}</MentionChip>;
                  }
                  if (seg.type === 'at') {
                    return (
                      <span key={i} className="text-muted-foreground">
                        @{seg.query}
                      </span>
                    );
                  }
                  return <span key={i}>{seg.value}</span>;
                })}
                <span className="inline-block w-[2px] h-[1.1em] bg-foreground align-text-bottom animate-pulse ml-px" />
              </span>
            ) : (
              <span className="inline-block w-[2px] h-[1.1em] bg-foreground align-text-bottom animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Provider / Model row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[14px] font-semibold text-foreground mb-2">Provider</label>
          <div className="flex items-center justify-between rounded-lg border border-muted bg-canvas px-3 py-2 text-[14px] text-foreground">
            <span>GitHub Copilot</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 4.5 3 3 3-3" />
            </svg>
          </div>
        </div>
        <div>
          <label className="block text-[14px] font-semibold text-foreground mb-2">Model</label>
          <div className="flex items-center justify-between rounded-lg border border-muted bg-canvas px-3 py-2 text-[14px] text-muted-foreground">
            <span>claude-sonnet-4-6</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 4.5 3 3 3-3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
