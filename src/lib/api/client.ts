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
  try {
    const isFormData = opts.body instanceof FormData;
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (opts.headers) {
      Object.assign(headers, opts.headers as Record<string, string>);
    }

    const res = await fetch(BASE + path, {
      ...opts,
      headers,
    });

    if (!res.ok) {
      let msg = res.statusText;
      try {
        const j = await res.json();
        msg = j.message || j.error || msg;
      } catch {}
      throw new Error(msg);
    }
    return res.json() as Promise<T>;
  } catch (e) {
    console.error("Network error while calling", BASE + path, e);
    throw new Error("Unable to connect to API server. Ensure the backend is running.");
  }
}

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
  createBlog(input: any): Promise<Blog>;
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
  async login(email: string, password: string) {
    if (USE_MOCK) return mockApi.login(email, password);
    return http("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  },

  async register(email: string, password: string, name: string) {
    if (USE_MOCK) return mockApi.register(email, password, name);
    return http("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, username: name }),
    });
  },

  async me() {
    const t = getToken();
    if (!t) throw new Error("Unauthorized");
    if (USE_MOCK) return mockApi.me(t);
    return http("/api/auth/me");
  },

  async logout() {
    if (USE_MOCK) { await mockApi.logout(); return; }
    await http("/api/auth/logout", { method: "POST" });
  },

  async updateUserProfile(userId: string, data: { email?: string; name?: string }) {
    if (USE_MOCK) return mockApi.updateProfile(userId, data);
    return http(`/api/auth/profile/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async changePassword(current: string, next: string) {
    const t = getToken()!;
    if (USE_MOCK) { await mockApi.changePassword(t, current, next); return; }
    await http("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ current, next }),
    });
  },

  // ---- Blogs
  async listBlogs(params) {
    if (USE_MOCK) return mockApi.listBlogs(params);
    const q = new URLSearchParams();
    if (params.page !== undefined) q.set("page", String(params.page));
    if (params.pageSize !== undefined) q.set("limit", String(params.pageSize));
    if (params.limit !== undefined) q.set("limit", String(params.limit));
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && !["page", "pageSize", "limit"].includes(k)) {
        const val =
          k === "sort" && typeof v === "string" && v.includes(":")
            ? v.split(":")[0]
            : v;
        q.set(k, String(val));
      }
    });
    return http(`/api/blogs?${q.toString()}`);
  },

  async getBlog(slug: string) {
    if (USE_MOCK) return mockApi.getBlog(slug);
    return http(`/api/blogs/${slug}`);
  },

  async getBlogById(id: string) {
    if (USE_MOCK) return mockApi.getBlogById(id);
    return http(`/api/blogs/id/${id}`);
  },

  async myBlogs() {
    if (USE_MOCK) return mockApi.myBlogs(getToken()!);
    return http(`/api/blogs/mine`);
  },

  async createBlog(input: any) {
    if (USE_MOCK) {
      const t = getToken()!;
      return mockApi.createBlog(t, input);
    }

    const form = new FormData();
    form.append("title", input.title || "");
    form.append("content", input.content || "");
    form.append("category", (input.categoryId || "").toUpperCase());
    if (input.tags?.length) {
      form.append("tags", input.tags.join(","));
    }
    if (input.coverImage instanceof File) {
      form.append("image", input.coverImage);
    }
    if (input.excerpt) {
      form.append("excerpt", input.excerpt);
    }
    form.append("published", String(!!input.published));
    if (input.scheduledAt) {
      form.append("scheduledAt", input.scheduledAt);
    }

    const token = getToken();
    const res = await fetch(BASE + "/api/blogs", {
      method: "POST",
      body: form,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      let msg = "Create blog failed";
      try {
        const j = await res.json();
        msg = j.message || j.error || msg;
      } catch {}
      throw new Error(msg);
    }
    return res.json();
  },

  async updateBlog(id: string, data: any) {
    if (USE_MOCK) return mockApi.updateBlog(getToken()!, id, data);

    let coverImageUrl = data.coverImage;
    if (data.coverImage instanceof File) {
      const uploadRes = await api.uploadImage(data.coverImage);
      coverImageUrl = uploadRes.url;
    }

    const payload: Record<string, any> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && !(value instanceof File)) {
        payload[key] = value;
      }
    });

    if (coverImageUrl && typeof coverImageUrl === "string") {
      payload.coverImage = coverImageUrl;
    } else if (coverImageUrl === null || coverImageUrl === "") {
      payload.coverImage = "";
    }

    return http(`/api/blogs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async deleteBlog(id: string) {
    const t = getToken()!;
    if (USE_MOCK) { await mockApi.deleteBlog(t, id); return; }
    await http(`/api/blogs/${id}`, { method: "DELETE" });
  },

  async categories() {
    if (USE_MOCK) return mockApi.categories();
    return http(`/api/categories`);
  },

  async tags() {
    if (USE_MOCK) return mockApi.tags();
    return http(`/api/tags`);
  },

  async uploadImage(file: File) {
    if (USE_MOCK) return mockApi.uploadImage(file);
    const CLOUDINARY_URL = (import.meta as any).env?.VITE_CLOUDINARY_URL;
    const CLOUDINARY_PRESET = (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!CLOUDINARY_URL) {
      throw new Error("Cloudinary upload URL not configured");
    }
    const form = new FormData();
    form.append("file", file);
    if (CLOUDINARY_PRESET) form.append("upload_preset", CLOUDINARY_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: form });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return { url: data.secure_url || data.url };
  },

  // ---- Admin
  async adminStats() {
    if (USE_MOCK) return mockApi.adminStats();
    return http(`/api/admin/stats`);
  },

  async adminAuthors(search?: string) {
    if (USE_MOCK) return mockApi.adminAuthors(search);
    return http(`/api/admin/authors?search=${encodeURIComponent(search || "")}`);
  },

  async adminToggleSuspend(userId: string) {
    if (USE_MOCK) return mockApi.adminToggleSuspend(userId);
    return http(`/api/admin/authors/${userId}/suspend`, { method: "PATCH" });
  },

  async adminBlogs(params) {
    if (USE_MOCK) return mockApi.adminBlogs(params);
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v != null && q.set(k, String(v)));
    return http(`/api/admin/blogs?${q.toString()}`);
  },
};