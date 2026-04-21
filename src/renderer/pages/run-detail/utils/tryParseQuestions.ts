import type { Question } from '../types';

export function tryParseQuestions(content: string): Question[] | null {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, trimmed];
  try {
    const parsed = JSON.parse(jsonMatch[1] ?? trimmed);
    if (Array.isArray(parsed?.questions) && parsed.questions.length > 0) {
      return parsed.questions;
    }
  } catch {
    /* not JSON */
  }
  return null;
}
