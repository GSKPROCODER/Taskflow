const BASE = "/api/v1";

type RequestOptions = Omit<RequestInit, "body"> & { json?: unknown };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${msg}`);
  }
  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { method: "GET", ...init }),
  post: <T>(path: string, json: unknown, init?: RequestInit) =>
    request<T>(path, { method: "POST", json, ...init }),
  patch: <T>(path: string, json: unknown, init?: RequestInit) =>
    request<T>(path, { method: "PATCH", json, ...init }),
  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { method: "DELETE", ...init }),
};
