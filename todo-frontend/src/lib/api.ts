import { getAuthToken } from "../store/authStore";

const API = (path: string) => `${import.meta.env.VITE_API_URL}${path}`;

async function request<T = any>(path: string, opts: RequestInit = {}) {
    const token = getAuthToken();
    const headers: HeadersInit = { "Content-Type": "application/json", ...(opts.headers || {}) } as Record<string, string>;
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(API(path), { ...opts, headers });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw data || { message: res.statusText };
    return data as T;
}

export const api = {
    post: <T = any>(path: string, body?: any) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    get: <T = any>(path: string) => request<T>(path, { method: "GET" }),
    patch: <T = any>(path: string, body?: any) => request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
    del:  <T = any>(path: string) => request<T>(path, { method: "DELETE" }),
    delete:  <T = any>(path: string) => request<T>(path, { method: "DELETE" }),
};