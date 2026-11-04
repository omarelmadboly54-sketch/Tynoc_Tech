import { API_URL, TOKEN_KEY } from "@/lib/constants";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem("convoform_access_token");
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (!token) throw new ApiError("Not authenticated", 401);
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (data as { error?: string }).error ||
      (data as { message?: string }).message ||
      res.statusText ||
      "Request failed";
    throw new ApiError(message, res.status);
  }

  return data as T;
}
