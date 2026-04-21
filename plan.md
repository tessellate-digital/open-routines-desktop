# Plan: @mention Popover System

## Context

The chat input in RunDetail is currently a plain `<textarea>`. The user wants a Notion-style `@` popover: typing `@` immediately opens a grouped list of all available actions. Typing further after `@` filters the list. Selecting an item executes the action (e.g. opens file picker) and inserts a **styled inline chip** showing a custom-rendered display value (e.g. shortened filename instead of full path). Each action defines its own `renderer` function controlling how the chip displays.

To support inline chips, the textarea will be replaced with a **contenteditable div**.

## Architecture

Four layers:

1. **Action registry** (`mentionRegistry.ts`) — actions with group labels, keywords, and a `renderer` function
2. **`useMentionPopover` hook** — detects `@`, manages filter query, dropdown state, keyboard nav, chip insertion
3. **`MentionPopover` component** — grouped, filtered action list above the composer
4. **`ComposerInput` component** — contenteditable div replacing the textarea, with chip rendering and text extraction

## How It Works

1. User types `@` → popover opens showing all actions grouped
2. User continues typing (e.g. `@bro`) → list filters by matching label, description, keywords
3. ArrowUp/Down navigates, Enter/Tab selects, Escape dismisses (leaves `@...` as plain text)
4. On selection: action's `onSelect` runs (e.g. opens file picker), returns a raw value
5. The `@query` text is replaced with an inline chip: a `<span>` with `contenteditable="false"`, styled with a background, displaying the action's `renderer(value)` output, and storing the full value in a `data-value` attribute
6. On submit: extract plain text from the contenteditable, resolving chips to their `data-value`

## Files to Create

### 1. `src/renderer/lib/mentionRegistry.ts` — Registry & types

```ts
export interface MentionAction {
  id: string;
  label: string; // "Browse files"
  group: string; // "Files" — section header in popover
  description?: string; // subtitle shown below label
  keywords: string[]; // extra search terms
  onSelect: () => Promise<any>;
  // returns the raw value (e.g. full file path), or null if cancelled. SHOULD ALSO POTENTIALLY RECEIVE THE OUTPUT OF ON SELECT
  renderer: (value: any) => React.Component;
  // transforms raw value into display text for the chip
  // e.g. "/Users/loic/dev/project/src/main/ipc-handlers.ts" → "ipc-handlers.ts"
}

export const mentionActions: MentionAction[] = [
  ...fileActions,
  // ...agentActions,  // future
];
```

Filtering: case-insensitive substring match of query against `label`, `description`, and all `keywords`.

### 2. `src/renderer/lib/triggers/fileActions.ts` — File action(s)

```ts
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
    renderer: (value) => value.split('/').pop() || value,
    // "/Users/loic/project/src/foo.ts" → "foo.ts"
  },
];
```

### 3. `src/renderer/components/ComposerInput.tsx` — Contenteditable input

Replaces the `<textarea>` in the chat composer. Key responsibilities:

**Rendering:**

- A `<div contenteditable="true">` with the same styling as the current textarea (font, color, placeholder, sizing)
- Supports multi-line input, auto-grows up to `max-height: 180px` (same as current)
- Chips are `<span contenteditable="false" data-mention-value="..." data-mention-action="...">` elements inline in the text, styled with a subtle background

**Text extraction (for submit):**

- `getPlainText()` method: walks the DOM, replaces chip spans with their `data-value`, returns plain string
- Exposed via `ref` (useImperativeHandle) so RunDetail can call it on submit

**Chip insertion:**

- `insertChip(displayText, rawValue, actionId)`: replaces the current `@query` range with a chip span, adds a trailing space, restores cursor after it

**Props:** `value` (for controlled reset on submit), `onChange` (fires on input), `onKeyDown`, `placeholder`, `disabled`, `ref`

**Challenges & approach:**

- Contenteditable cursor management: use `Range`/`Selection` API for chip insertion and cursor restore
- Placeholder: CSS `[contenteditable]:empty::before { content: attr(data-placeholder) }`
- Prevent paste of HTML: intercept `paste` event, insert only `clipboardData.getData('text/plain')`
- `onChange` extracts text content on every `input` event for the hook to read

### 4. `src/renderer/components/ComposerInput.css` — Styles

```css
.composer-editable {
  /* mirrors current textarea styles */
  @apply flex-1 border-0 outline-0 bg-transparent resize-none;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--fg);
  line-height: 1.5;
  min-height: 24px;
  max-height: 180px;
  overflow-y: auto;
  padding: 10px 0;
}
.composer-editable:empty::before {
  content: attr(data-placeholder);
  color: var(--fg-dim);
  pointer-events: none;
}
.composer-editable[aria-disabled='true'] {
  opacity: 0.5;
  pointer-events: none;
}

.mention-chip {
  @apply inline-flex items-center rounded px-1.5 py-0.5 text-sm font-medium;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--accent);
  user-select: all;
  cursor: default;
}
```

### 5. `src/renderer/hooks/useMentionPopover.ts` — Core hook

**Signature:** `useMentionPopover(inputRef: RefObject<ComposerInputHandle>)`

**Detection (on every input event):**

- Get current cursor position via `window.getSelection()`
- Walk backwards from cursor through text nodes to find `@` (bounded by space/newline/start-of-string or chip boundary)
- If found: `query` = text between `@` and cursor
- Filter `mentionActions` by query, group results

**State:**

- `open: boolean`
- `query: string`
- `activeIndex: number` — highlighted item in flat filtered list

**Keyboard (`onKeyDown`):**
When popover is open:

- **ArrowDown/ArrowUp**: move `activeIndex`, `preventDefault`
- **Enter/Tab**: select highlighted item, `preventDefault`
- **Escape**: dismiss, keep `@query` as plain text, `preventDefault`

When closed: pass through entirely.

**On selection:**

1. Call `action.onSelect()` → get raw value (e.g. full path)
2. If null (cancelled): dismiss popover, leave `@query` as text
3. If value: call `action.renderer(value)` → get display text
4. Call `inputRef.current.insertChip(displayText, value, action.id)` — replaces `@query` with styled chip
5. Close popover

**Returns:** `{ open, filteredActions, activeIndex, onKeyDown, handleSelect, dismiss, onInput }`

### 6. `src/renderer/components/MentionPopover.tsx` — Popover UI

- Positioned above composer: `absolute bottom-full mb-2 left-5`
- Width: `w-72`, max height: `max-h-80 overflow-y-auto`
- Grouped sections with header labels (same style as SelectDropdown groups)
- Items show `label` + optional `description` as subtitle
- Active item: highlighted background
- Click-outside dismisses (mousedown listener)
- Empty state when no matches

### 7. `src/renderer/components/MentionPopover.css` — Styles

```css
.mention-popover {
  /* container: bg, border, shadow, backdrop-blur, rounded */
}
.mention-popover-group {
  /* group header */
}
.mention-popover-item {
  /* action row with label + description */
}
.mention-popover-item.active {
  /* highlighted state */
}
```

## Files to Modify

### 8. `src/main/ipc-handlers.ts` — Add `dialog:openFile`

```ts
ipcMain.handle('dialog:openFile', async () => {
  const win = BrowserWindow.getFocusedWindow();
  const result = await dialog.showOpenDialog(win!, { properties: ['openFile'] });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});
```

### 9. `src/preload/preload.ts` — Expose `selectFile`

Add: `selectFile: (): Promise<string | null> => ipcRenderer.invoke('dialog:openFile'),`

### 10. `src/renderer/electron.d.ts` — Add type

Add `selectFile(): Promise<string | null>;` to `ElectronAPI`.

### 11. `src/renderer/pages/RunDetail.tsx` — Replace textarea with ComposerInput

- Import `ComposerInput`, `useMentionPopover`, `MentionPopover`
- Replace `replyText` string state with a ref-based approach:
  - Keep `replyText` for tracking emptiness (controls Send button opacity)
  - On submit: call `composerRef.current.getPlainText()` to get the resolved text with full values
- Replace `<textarea>` with `<ComposerInput ref={composerRef} ...>`
- Wire `mention.onKeyDown` into the input's `onKeyDown`, checking `e.defaultPrevented` before handling Enter-to-send
- Add `relative` wrapper around composer for popover positioning
- Render `<MentionPopover>` when `mention.open`

### 12. `src/renderer/pages/RunDetail.style.css` — Minor adjustment

The `.chat-composer textarea` rules need to also apply to `.chat-composer .composer-editable` (or rename the selector).

## Implementation Order

1. IPC layer: `ipc-handlers.ts` → `preload.ts` → `electron.d.ts`
2. Registry: `mentionRegistry.ts` + `triggers/fileActions.ts`
3. ComposerInput: `ComposerInput.tsx` + `ComposerInput.css` (contenteditable with chip support)
4. Hook: `useMentionPopover.ts`
5. Popover: `MentionPopover.tsx` + `MentionPopover.css`
6. Integration: `RunDetail.tsx` + `RunDetail.style.css`

## Verification

1. Start dev mode, open a run detail page
2. Basic typing: contenteditable behaves like the old textarea (type, multi-line with Shift+Enter, Enter sends)
3. Type `@` → popover appears with "Browse files" under "Files" group
4. Type `@bro` → filters to "Browse files"
5. ArrowDown + Enter → native file picker opens
6. Pick a file → chip appears: `[ipc-handlers.ts]` with accent background, full path stored in `data-value`
7. Cancel picker → popover dismisses, `@bro` remains as plain text
8. Press Escape → popover dismisses, text stays
9. Submit message with chip → API receives the full file path in the resolved text
10. Paste HTML → only plain text inserted (no rich content)
11. Multiple chips in one message work correctly
12. Delete/backspace over a chip removes it entirely
