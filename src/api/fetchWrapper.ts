import { API_BASE_URL } from "./config";
import * as authApi from "./authApi";
import { getToken, setToken } from "./authStore";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  const t = getToken();
  if (t) headers["Authorization"] = `Bearer ${t}`;

  const res = await fetch(url, { ...options, headers, credentials: options.credentials ?? "include" });
  if (res.status !== 401) {
    if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.message || res.statusText);
    return res.json();
  }

  // 401 -> try refresh once
  try {
    const data = await authApi.refreshToken();
    if (data?.accessToken) {
      setToken(data.accessToken);
      headers["Authorization"] = `Bearer ${data.accessToken}`;
      const retry = await fetch(url, { ...options, headers, credentials: options.credentials ?? "include" });
      if (!retry.ok) throw new Error((await retry.json().catch(() => ({})))?.message || retry.statusText);
      return retry.json();
    }
  } catch (e) {
    // fallthrough
  }

  // original 401
  throw new Error("Unauthorized");
}

export default apiFetch;
