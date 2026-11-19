import { request } from "./client";
import type { RequestOptions } from "./types";

export const auth = {
  login: (body: { email: string; password: string }) =>
    request<{ user: unknown }>("/auth/login", { method: "POST", body, skipAuth: true }),
  register: (body: { email: string; password: string; name: string }) =>
    request<{ user: unknown }>("/auth/register", { method: "POST", body, skipAuth: true }),
  logout: () => request<void>("/auth/logout", { method: "POST" }),
  me: (opts?: RequestOptions) => request<{ user: unknown }>("/auth/me", opts),
};

export const artists = {
  list: (query?: { page?: number; q?: string }) =>
    request<unknown[]>("/artists", { query }),
  get: (id: string) => request<unknown>(`/artists/${id}`),
  merch: (id: string) => request<unknown[]>(`/artists/${id}/merch`),
  update: (id: string, body: Record<string, unknown>) =>
    request<unknown>(`/artists/${id}`, { method: "PATCH", body }),
};

export const discoveries = {
  list: () => request<unknown[]>("/discoveries"),
  subpage: (slug: string) => request<unknown>(`/discoveries/${slug}`),
};

export const analytics = {
  overview: (range?: string) =>
    request<unknown>("/analytics", { query: { range } }),
  artist: (id: string) => request<unknown>(`/analytics/artists/${id}`),
};

export const ticketai = {
  analyze: (body: { ticketId: string; data: unknown }) =>
    request<unknown>("/tickets/analyze", { method: "POST", body }),
  share: (ticketId: string) =>
    request<{ shareUrl: string }>(`/tickets/${ticketId}/share`, { method: "POST" }),
};

export const social = {
  feed: (query?: { page?: number }) => request<unknown[]>("/social/feed", { query }),
  post: (body: { content: string }) =>
    request<unknown>("/social/posts", { method: "POST", body }),
};

export const notifications = {
  list: () => request<unknown[]>("/notifications"),
  markRead: (id: string) =>
    request<void>(`/notifications/${id}/read`, { method: "POST" }),
};

export const premium = {
  status: () => request<{ plan: string; active: boolean }>("/premium/status"),
  verify: (body: { code: string }) =>
    request<{ verified: boolean }>("/verify", { method: "POST", body }),
};