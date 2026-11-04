import { apiClient } from "./api-client";
import type {
  CreateFormRequest,
  CreateFormResponse,
  Form,
  FormResponse,
  OwnerFormResponse,
  UpdateFormStatusRequest,
} from "@/types/form";

export const formsService = {
  create(data: CreateFormRequest) {
    return apiClient<CreateFormResponse>("/forms", {
      method: "POST",
      body: JSON.stringify(data),
    }, true);
  },

  listMine(page = 1, limit = 20) {
    return apiClient<{ forms: Form[] }>(`/forms/me?page=${page}&limit=${limit}`, {}, true);
  },

  getMine(id: number) {
    return apiClient<{ form: OwnerFormResponse }>(`/forms/me/${id}`, {}, true);
  },

  listPublic(page = 1, limit = 20) {
    return apiClient<{ forms: Form[] }>(`/forms?page=${page}&limit=${limit}`);
  },

  getById(id: number) {
    return apiClient<{ form: FormResponse }>(`/forms/${id}`);
  },

  getByPublicId(publicId: string) {
    return apiClient<{ form: FormResponse }>(`/forms/public/${publicId}`);
  },

  updateStatus(id: number, data: UpdateFormStatusRequest) {
    return apiClient<{ Message: string }>(`/forms/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }, true);
  },

  delete(id: number) {
    return apiClient<{ message: string }>(`/forms/${id}`, { method: "DELETE" }, true);
  },

  createPublicLink(id: number) {
    return apiClient<{ public_id: string }>(`/forms/${id}/public-link`, {
      method: "POST",
    }, true);
  },
};
