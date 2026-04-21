import type { Segment } from '../../../stores/runStore';
import type { TodoItem } from '../../../components/TodoBox';

export function extractTodos(segments: Segment[]): TodoItem[] {
  let latest: TodoItem[] = [];
  for (const seg of segments) {
    if (seg.kind !== 'tool' || seg.name !== 'todowrite') {
      continue;
    }
    try {
      const parsed = JSON.parse(seg.args);
      const items = Array.isArray(parsed.todos)
        ? parsed.todos
        : Array.isArray(parsed)
          ? parsed
          : [];
      latest = items.map((t: { content: string; status: string; priority?: string }) => ({
        content: t.content,
        status: t.status as TodoItem['status'],
        priority: t.priority as TodoItem['priority'],
      }));
    } catch {
      if (seg.result) {
        try {
          const items = JSON.parse(seg.result);
          if (Array.isArray(items)) {
            latest = items.map((t: { content: string; status: string; priority?: string }) => ({
              content: t.content,
              status: t.status as TodoItem['status'],
              priority: t.priority as TodoItem['priority'],
            }));
          }
        } catch {
          /* ignore */
        }
      }
    }
  }
  return latest;
}
