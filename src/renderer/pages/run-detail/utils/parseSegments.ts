import type { Segment } from '../../../stores/runStore';

export function parseSegments(events: Array<{ type: string; data: string }>): Segment[] {
  const segments: Segment[] = [];
  for (const evt of events) {
    if (evt.type === 'text') {
      const last = segments[segments.length - 1];
      if (last?.kind === 'text') {
        last.content += evt.data;
      } else {
        segments.push({ kind: 'text', content: evt.data });
      }
    } else if (evt.type === 'tool') {
      const firstNewline = evt.data.indexOf('\n');
      const header = firstNewline === -1 ? evt.data : evt.data.slice(0, firstNewline);
      const args = firstNewline === -1 ? '' : evt.data.slice(firstNewline + 1).trim();
      const name = header
        .replace(/^\[tool:\s*/, '')
        .replace(/\]$/, '')
        .trim();
      segments.push({ kind: 'tool', name, args, result: '', open: false });
    } else if (evt.type === 'tool_result') {
      const last = [...segments].reverse().find((s) => s.kind === 'tool');
      if (last && last.kind === 'tool') {
        last.result = evt.data.replace(/^\[result\]\n?/, '').trim();
      }
    } else if (evt.type === 'error') {
      segments.push({ kind: 'error', content: evt.data });
    } else if (evt.type === 'status' && evt.data.startsWith('--- step') && segments.length > 0) {
      segments.push({ kind: 'step', label: '' });
    }
  }
  return segments;
}
