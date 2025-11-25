import { API_BASE_URL } from './config';

const API_BASE = API_BASE_URL;

type SendOtpPayload = { email: string; purpose: "login" | "register" };
type LoginPayload = { email: string; otp: string };
type RegisterPayload = { email: string; phone: string; otp: string; fullName: string; city: string };

async function parseOrThrow(res: Response) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || "Request failed");
  }
  return json.data;
}

export async function sendOtp(payload: SendOtpPayload): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return parseOrThrow(res);
  } catch (e: any) {
    throw new Error(e?.message || "Network error");
  }
}

export async function login(payload: LoginPayload): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return parseOrThrow(res);
  } catch (e: any) {
    throw new Error(e?.message || "Network error");
  }
}

export async function register(payload: RegisterPayload): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return parseOrThrow(res);
  } catch (e: any) {
    throw new Error(e?.message || "Network error");
  }
}

export async function refreshToken(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    if (res.status === 401) {
      return null; // Indicate invalid token
    }
    return parseOrThrow(res);
  } catch (e: any) {
    throw new Error(e?.message || "Network error");
  }
}

export async function me(accessToken?: string): Promise<any> {
  try {
    const headers: Record<string, string> = {};
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      headers,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.message || "Fetch profile failed");
    return json.data;
  } catch (e: any) {
    throw new Error(e?.message || "Network error");
  }
}

export async function logout(accessToken?: string): Promise<any> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers,
      credentials: "include",
    });
    return parseOrThrow(res);
  } catch (e: any) {
    throw new Error(e?.message || "Network error");
  }
}

// Named exports only — import with `import * as authApi from '../api/authApi'` or
// `import { login, register } from '../api/authApi'`.
