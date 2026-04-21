export interface QuestionOption {
  label: string;
  description: string;
}

export interface Question {
  header: string;
  question: string;
  options: QuestionOption[];
}
