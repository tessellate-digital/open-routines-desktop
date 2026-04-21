import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { tryParseQuestions } from '../utils';
import { QuestionsCard } from './QuestionsCard';

interface AgentTextProps {
  content: string;
  onReply?: (text: string) => void;
}

export function AgentText({ content, onReply }: AgentTextProps) {
  if (!content.trim()) {
    return null;
  }
  const questions = onReply ? tryParseQuestions(content) : null;
  if (questions) {
    return <QuestionsCard questions={questions} onReply={onReply!} />;
  }
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
