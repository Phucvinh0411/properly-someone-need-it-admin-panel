import axiosClient from "./axiosClient";
import { API_BASE_URL } from "./config";
import type { AdminUser } from "../types/user";

const API_ROOT = API_BASE_URL.endsWith("/api") ? API_BASE_URL : `${API_BASE_URL.replace(/\/$/, "")}/api`;

async function handleAxios<T>(p: Promise<{ data: T }>): Promise<T> {
  const res = await p;
  return res.data;
}

export async function fetchUsers(): Promise<AdminUser[]> {
  return handleAxios<AdminUser[]>(axiosClient.get(`${API_ROOT}/users`));
}

export async function fetchUser(userId: string): Promise<AdminUser> {
  return handleAxios<AdminUser>(axiosClient.get(`${API_ROOT}/users/${encodeURIComponent(userId)}`));
}

export async function updateUserBanStatus(userId: string, isBanned: boolean): Promise<AdminUser> {
  return handleAxios<AdminUser>(
    axiosClient.patch(`${API_ROOT}/users/${encodeURIComponent(userId)}/ban`, { isBanned })
  );
}

// optional helpers you can use from UI
export async function createUser(payload: Partial<AdminUser>): Promise<AdminUser> {
  return handleAxios<AdminUser>(axiosClient.post(`${API_ROOT}/users`, payload));
}

export async function deleteUser(userId: string): Promise<void> {
  await axiosClient.delete(`${API_ROOT}/users/${encodeURIComponent(userId)}`);
}