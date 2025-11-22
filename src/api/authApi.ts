const API_BASE = (import.meta?.env?.VITE_API_BASE as string) || "http://localhost:3000/api";

type LoginPayload = { email: string; password: string };
type RegisterPayload = { name: string; email: string; password: string };

export async function login(payload: LoginPayload): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Đăng nhập thất bại");
    }
    return res.json();
  } catch (e: any) {
    throw new Error(e?.message || "Network error");
  }
}

export async function register(payload: RegisterPayload): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Đăng ký thất bại");
    }
    return res.json();
  } catch (e: any) {
    throw new Error(e?.message || "Network error");
  }
}

// Named exports only — import with `import * as authApi from '../api/authApi'` or
// `import { login, register } from '../api/authApi'`.
