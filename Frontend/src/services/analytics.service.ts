import { apiClient } from "./api-client";
import type { FormAnalytics } from "@/types/analytics";

export const analyticsService = {
  get(formId: number) {
    return apiClient<{ analytics: FormAnalytics }>(`/forms/${formId}/analytics`, {}, true);
  },
};
