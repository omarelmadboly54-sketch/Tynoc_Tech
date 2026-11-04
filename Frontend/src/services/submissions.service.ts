import { apiClient } from "./api-client";
import type { CreateSubmissionRequest, SubmissionWithAnswers } from "@/types/submission";

export const submissionsService = {
  create(formId: number, data: CreateSubmissionRequest) {
    return apiClient<{ message: string }>(`/forms/${formId}/submissions`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  list(formId: number, page = 1, limit = 20) {
    return apiClient<{ submissions: SubmissionWithAnswers[] }>(
      `/forms/${formId}/submissions?page=${page}&limit=${limit}`,
      {},
      true
    );
  },
};
