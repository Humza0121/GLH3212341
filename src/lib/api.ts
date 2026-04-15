type ApiError = {
  error: string;
  issues?: unknown;
};

// Prefer same-origin (Vite proxy in dev, reverse-proxy in prod).
// Set VITE_API_URL to an absolute URL if the API is hosted separately.
const API_BASE = import.meta.env.VITE_API_URL || "";

function getToken(): string | null {
  return localStorage.getItem("glh_token");
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("glh_token", token);
  else localStorage.removeItem("glh_token");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  headers.set("content-type", "application/json");
  if (token) headers.set("authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch (e) {
    // Fetch throws on network/CORS failures; surface a clearer message.
    const message =
      e instanceof Error
        ? e.message
        : "Network error contacting the server";
    throw new Error(message);
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const err = (data || { error: "Request failed" }) as ApiError;
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  return data as T;
}

