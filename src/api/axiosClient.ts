import axios, { type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./config";
import * as authApi from "./authApi";
import { getToken, setToken } from "./authStore";

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach Authorization header before each request
instance.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const t = getToken();
  if (t) {
    const headers = (cfg.headers as Record<string, any>) || {};
    headers["Authorization"] = `Bearer ${t}`;
    cfg.headers = headers as any;
  }
  return cfg;
});

// Response interceptor to try refresh once on 401
instance.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error?.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (!original) return Promise.reject(error);
    if (original._retry) return Promise.reject(error);

    const status = error?.response?.status;
    if (status === 401) {
      original._retry = true;
      try {
        const data = await authApi.refreshToken();
        if (data && data.accessToken) {
          setToken(data.accessToken);
          const headers = original.headers || {};
          (headers as Record<string, any>)["Authorization"] = `Bearer ${data.accessToken}`;
          original.headers = headers;
          return instance(original);
        }
      } catch (e) {
        // ignore and fallthrough to reject
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
