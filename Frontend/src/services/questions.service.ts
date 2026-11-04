import { apiClient } from "./api-client";
import type { CreateQuestionRequest, Question } from "@/types/question";

export const questionsService = {
  create(formId: number, data: CreateQuestionRequest) {
    return apiClient<{ ok: string }>(`/forms/${formId}/questions`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        options: data.options ?? null,
      }),
    }, true);
  },

  list(formId: number) {
    return apiClient<{ questions: Question[] }>(`/forms/${formId}/questions`, {}, true);
  },

  delete(formId: number, questionId: number) {
    return apiClient(`/forms/${formId}/questions/${questionId}`, {
      method: "DELETE",
    }, true);
  },
};
