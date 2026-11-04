import type { Question, QuestionResponse } from "./question";

export interface Form {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  created_by?: number;
  public_id?: string;
}

export interface FormResponse {
  id: number;
  title: string;
  description: string;
  questions: QuestionResponse[];
}

export interface OwnerFormResponse {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  questions: QuestionResponse[];
}

export interface CreateFormRequest {
  title: string;
  description: string;
  is_public: boolean;
}

export interface CreateFormResponse {
  ok: string;
  data: {
    id: number;
  };
}

export interface UpdateFormStatusRequest {
  is_public: boolean;
}
