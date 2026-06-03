import { mockApi } from "./mock";
import type { AdminStats, Blog, Category, Paginated, User } from "./types";

const USE_MOCK =
  (import.meta as any).env?.VITE_USE_MOCK_API !== "false" ||
  !(import.meta as any).env?.VITE_API_BASE_URL;
const BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

const TOKEN_KEY = "menya.jwt";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string, persist = false) {
  if (typeof window === "undefined") return;
  (persist ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
}
export function clearToken() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

async function http<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(BASE + path, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = j.message || j.error || msg;
    } catch { }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

// Explicit API typing
interface Api {
  // Auth
  login(email: string, password: string): Promise<{ token: string; user: User }>;
  register(email: string, password: string, name: string): Promise<{ user: User }>;
  me(): Promise<{ user: User }>;
  logout(): Promise<void>;
  updateUserProfile(userId: string, data: { email?: string; name?: string }): Promise<{ user: User }>;
  changePassword(current: string, next: string): Promise<void>;

  // Blogs
  listBlogs(params: Parameters<typeof mockApi.listBlogs>[0]): Promise<Paginated<Blog>>;
  getBlog(slug: string): Promise<Blog>;
  getBlogById(id: string): Promise<Blog>;
  myBlogs(): Promise<Paginated<Blog>>;
  createBlog(input: Parameters<typeof mockApi.createBlog>[1]): Promise<Blog>;
  updateBlog(id: string, patch: Parameters<typeof mockApi.updateBlog>[2]): Promise<Blog>;
  deleteBlog(id: string): Promise<void>;
  categories(): Promise<Category[]>;
  tags(): Promise<string[]>;
  uploadImage(file: File): Promise<{ url: string }>;

  // Admin
  adminStats(): Promise<AdminStats>;
  adminAuthors(search?: string): Promise<User[]>;
  adminToggleSuspend(userId: string): Promise<User>;
  adminBlogs(params: { search?: string; category?: string; page?: number }): Promise<Paginated<Blog>>;
}

export const api: Api = {
  // ---- Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    if (USE_MOCK) return mockApi.login(email, password);
    return http("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  },
  async register(email: string, password: string, name: string): Promise<{ user: User }> {
    if (USE_MOCK) return mockApi.register(email, password, name);
    return http("/auth/register", { method: "POST", body: JSON.stringify({ email, password, name }) });
  },
  async me(): Promise<{ user: User }> {
    const t = getToken();
    if (!t) throw new Error("Unauthorized");
    if (USE_MOCK) return mockApi.me(t);
    return http("/auth/me");
  },
  async logout(): Promise<void> {
    if (USE_MOCK) { await mockApi.logout(); return; }
    await http("/auth/logout", { method: "POST" });
  },
  async updateUserProfile(userId: string, data: { email?: string; name?: string }): Promise<{ user: User }> {
    if (USE_MOCK) return mockApi.updateProfile(userId, data);
    return http(`/auth/profile/${userId}`, { method: "PUT", body: JSON.stringify(data) });
  },
  async changePassword(current: string, next: string): Promise<void> {
    const t = getToken()!;
    if (USE_MOCK) { await mockApi.changePassword(t, current, next); return; }
    await http("/auth/change-password", { method: "POST", body: JSON.stringify({ current, next }) });
  },

  // ---- Blogs
  async listBlogs(params: Parameters<typeof mockApi.listBlogs>[0]): Promise<Paginated<Blog>> {
    if (USE_MOCK) return mockApi.listBlogs(params);
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
    return http(`/blogs?${q.toString()}`);
  },
  async getBlog(slug: string): Promise<Blog> {
    if (USE_MOCK) return mockApi.getBlog(slug);
    return http(`/blogs/${slug}`);
  },
  async getBlogById(id: string): Promise<Blog> {
    if (USE_MOCK) return mockApi.getBlogById(id);
    return http(`/blogs/id/${id}`);
  },
  async myBlogs(): Promise<Paginated<Blog>> {
    const t = getToken()!;
    if (USE_MOCK) return mockApi.myBlogs(t);
    return http(`/blogs/mine`);
  },
  async createBlog(input: Parameters<typeof mockApi.createBlog>[1]): Promise<Blog> {
    const t = getToken()!;
    if (USE_MOCK) return mockApi.createBlog(t, input);
    return http(`/blogs`, { method: "POST", body: JSON.stringify(input) });
  },
  async updateBlog(id: string, patch: Parameters<typeof mockApi.updateBlog>[2]): Promise<Blog> {
    const t = getToken()!;
    if (USE_MOCK) return mockApi.updateBlog(t, id, patch);
    return http(`/blogs/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  },
  async deleteBlog(id: string): Promise<void> {
    const t = getToken()!;
    if (USE_MOCK) { await mockApi.deleteBlog(t, id); return; }
    await http(`/blogs/${id}`, { method: "DELETE" });
  },
  async categories(): Promise<Category[]> {
    if (USE_MOCK) return mockApi.categories();
    return http(`/categories`);
  },
  async tags(): Promise<string[]> {
    if (USE_MOCK) return mockApi.tags();
    return http(`/tags`);
  },
  async uploadImage(file: File): Promise<{ url: string }> {
    if (USE_MOCK) return mockApi.uploadImage(file);
    const form = new FormData();
    form.append("file", file);
    const token = getToken();
    const res = await fetch(BASE + "/uploads", {
      method: "POST",
      body: form,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },

  // ---- Admin
  async adminStats(): Promise<AdminStats> {
    if (USE_MOCK) return mockApi.adminStats();
    return http(`/admin/stats`);
  },
  async adminAuthors(search?: string): Promise<User[]> {
    if (USE_MOCK) return mockApi.adminAuthors(search);
    return http(`/admin/authors?search=${encodeURIComponent(search || "")}`);
  },
  async adminToggleSuspend(userId: string): Promise<User> {
    if (USE_MOCK) return mockApi.adminToggleSuspend(userId);
    return http(`/admin/authors/${userId}/suspend`, { method: "PATCH" });
  },
  async adminBlogs(params: { search?: string; category?: string; page?: number }): Promise<Paginated<Blog>> {
    if (USE_MOCK) return mockApi.adminBlogs(params);
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
    return http(`/admin/blogs?${q.toString()}`);
  },
};
