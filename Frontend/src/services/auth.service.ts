import { apiClient } from "./api-client";
import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";
import { TOKEN_KEY } from "@/lib/constants";

export const authService = {
  async register(data: RegisterRequest) {
    return apiClient<{ ok: string }>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: LoginRequest) {
    const res = await apiClient<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, res.access_token);
    }
    return res;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
