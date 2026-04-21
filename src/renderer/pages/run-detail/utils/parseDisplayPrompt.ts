import { findActionById } from '../../../lib/mentions';

export type ParsedSegment =
  | { type: 'text'; content: string }
  | { type: 'tag'; actionId: string; rawValue: string; displayText: string };

const CUSTOM_TAG_REGEX = /@customTag:([\w-]+)\(([^)]*)\)/g;

export function parseDisplayPrompt(text: string): ParsedSegment[] {
  const parts: ParsedSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  CUSTOM_TAG_REGEX.lastIndex = 0;
  while ((match = CUSTOM_TAG_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    const [, actionId, rawValue] = match;
    const action = findActionById(actionId);
    const displayText = action ? (action.feedRenderer ?? action.renderer)(rawValue) : rawValue;
    parts.push({ type: 'tag', actionId, rawValue, displayText });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: 'text', content: text }];
}
