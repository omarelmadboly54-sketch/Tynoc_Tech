export interface AnswerStatistic {
  answer: string;
  count: number;
  percentage: number;
}

export interface QuestionAnalytics {
  question_id: number;
  question_text: string;
  question_type: string;
  total_answers: number;
  breakdown: AnswerStatistic[];
}

export interface FormAnalytics {
  total_submissions: number;
  questions: QuestionAnalytics[];
}
