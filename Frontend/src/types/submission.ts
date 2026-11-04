export interface AnswerReq {
  question_id: number;
  answer: string;
}

export interface CreateSubmissionRequest {
  answers: AnswerReq[];
}

export interface Answer {
  id: number;
  submission_id: number;
  question_id: number;
  answer: string;
}

export interface SubmissionWithAnswers {
  id: number;
  created_at: string;
  answers: Answer[];
}
