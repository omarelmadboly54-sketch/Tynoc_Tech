export type QuestionType = "text" | "email" | "multiple_choice" | "yes_no";

export interface Question {
  id: number;
  form_id?: number;
  question_text: string;
  question_type: QuestionType;
  options: string[] | null;
  position: number;
  is_required: boolean;
}

export interface QuestionResponse {
  id: number;
  question_text: string;
  question_type: string;
  options: string[] | null | unknown;
  position: number;
  is_required: boolean;
}

export interface CreateQuestionRequest {
  question_text: string;
  question_type: QuestionType;
  options?: string[] | null;
  position: number;
  is_required: boolean;
}
