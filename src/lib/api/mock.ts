import type { Blog, Category, Paginated, User, AdminStats, Role } from "./types";

const CATEGORIES: Category[] = [
  { id: "c1", name: "Technology", slug: "technology" },
  { id: "c2", name: "Design", slug: "design" },
  { id: "c3", name: "Business", slug: "business" },
  { id: "c4", name: "Lifestyle", slug: "lifestyle" },
  { id: "c5", name: "Culture", slug: "culture" },
];

const USERS: User[] = [
  { id: "u1", email: "admin@menya.com", name: "Admin", role: "ADMIN", createdAt: new Date(Date.now() - 86400000 * 60).toISOString() },
  { id: "u2", email: "author@menya.com", name: "Jane Writer", role: "AUTHOR", createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: "u3", email: "rob@menya.com", name: "Rob Penman", role: "AUTHOR", createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
];

const PASSWORDS: Record<string, string> = {
  "admin@menya.com": "password123",
  "author@menya.com": "password123",
  "rob@menya.com": "password123",
};

const SAMPLE_HTML = `
<p>Writing is a slow craft. It rewards patience, attention, and the willingness to throw away the first draft. In this piece we look at the rituals that keep working writers shipping every week.</p>
<h2>Show up before you feel ready</h2>
<p>The first sentence is rarely the hardest. The hardest sentence is the one that follows the one you knew you wanted to write. That is where most pieces die.</p>
<ul><li>Set a small, repeatable target.</li><li>Write the worst possible version first.</li><li>Cut the first paragraph after you finish.</li></ul>
<p>None of this is a secret. Doing it daily is.</p>
`;

function makeBlog(i: number, author: User, cat: Category): Blog {
  const titles = [
    "How to write every day without burning out",
    "The case for small, sharp publications",
    "Designing systems that respect the reader",
    "What we learned shipping for 100 weeks straight",
    "Notes on building a quiet internet",
    "A field guide to honest essays",
    "On editing your own work",
    "Why the homepage is the hardest page",
    "Plain language is a competitive advantage",
    "The minimal stack for serious writing",
    "Stop apologizing for your drafts",
    "Curating taste in public",
  ];
  const title = titles[i % titles.length];
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + (i + 1);
  return {
    id: "b" + (i + 1),
    slug,
    title,
    excerpt:
      "A practical look at the habits and decisions that keep writers working, with examples from publications shipping into a noisy internet.",
    content: SAMPLE_HTML,
    coverImage: `https://images.unsplash.com/photo-${[
      "1455390582262-044cdead277a",
      "1432821596592-e2c18b78144f",
      "1499750310107-5fef28a66643",
      "1519681393784-d120267933ba",
      "1465101046530-73398c7f28ca",
      "1483058712412-4245e9b90334",
    ][i % 6]}?w=1200&q=80&auto=format&fit=crop`,
    category: cat,
    tags: ["writing", "craft", "habits", "essays"].slice(0, (i % 3) + 2),
    author: { id: author.id, name: author.name, email: author.email },
    createdAt: new Date(Date.now() - 86400000 * (i + 1)).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * (i + 1)).toISOString(),
    views: Math.floor(Math.random() * 5000),
    published: true,
  };
}

const BLOGS: Blog[] = Array.from({ length: 24 }, (_, i) =>
  makeBlog(i, USERS[(i % 2) + 1], CATEGORIES[i % CATEGORIES.length]),
);

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const mockApi = {
  async login(email: string, password: string) {
    await wait();
    const u = USERS.find((u) => u.email === email);
    if (!u) throw new Error("No account with that email");
    if (PASSWORDS[email] !== password) throw new Error("Incorrect password");
    if (u.suspended) throw new Error("Account suspended");
    return { token: "mock-jwt." + btoa(u.id) + ".token", user: u };
  },
  async register(email: string, password: string, name: string) {
    await wait();
    if (USERS.some((u) => u.email === email)) throw new Error("Email already registered");
    if (password.length < 8) throw new Error("Password must be at least 8 characters");
    const u: User = { id: "u" + (USERS.length + 1), email, name, role: "AUTHOR", createdAt: new Date().toISOString() };
    USERS.push(u);
    PASSWORDS[email] = password;
    return { user: u };
  },
  async me(token: string) {
    await wait(80);
    const id = atob(token.split(".")[1] || "");
    const u = USERS.find((u) => u.id === id);
    if (!u) throw new Error("Unauthorized");
    return { user: u };
  },
  async updateProfile(token: string, patch: { email?: string; name?: string }) {
    await wait();
    const id = atob(token.split(".")[1] || "");
    const u = USERS.find((u) => u.id === id);
    if (!u) throw new Error("Unauthorized");
    if (patch.email) u.email = patch.email;
    if (patch.name) u.name = patch.name;
    return { user: u };
  },
  async changePassword(token: string, _current: string, next: string) {
    await wait();
    const id = atob(token.split(".")[1] || "");
    const u = USERS.find((u) => u.id === id);
    if (!u) throw new Error("Unauthorized");
    if (next.length < 8) throw new Error("Password must be at least 8 characters");
    PASSWORDS[u.email] = next;
    return { ok: true };
  },
  async listBlogs(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
    tag?: string;
    sort?: "newest" | "oldest";
    authorId?: string;
  }): Promise<Paginated<Blog>> {
    await wait();
    let items = BLOGS.filter((b) => b.published !== false);
    if (params.authorId) items = items.filter((b) => b.author.id === params.authorId);
    if (params.category) items = items.filter((b) => b.category.slug === params.category);
    if (params.tag) items = items.filter((b) => b.tags.includes(params.tag!));
    if (params.search) {
      const s = params.search.toLowerCase();
      items = items.filter(
        (b) => b.title.toLowerCase().includes(s) || b.content.toLowerCase().includes(s),
      );
    }
    items = [...items].sort((a, b) => {
      const t = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return params.sort === "oldest" ? -t : t;
    });
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const total = items.length;
    const start = (page - 1) * pageSize;
    return { items: items.slice(start, start + pageSize), total, page, pageSize };
  },
  async getBlog(slug: string) {
    await wait(100);
    const b = BLOGS.find((b) => b.slug === slug);
    if (!b) throw new Error("Blog not found");
    b.views = (b.views ?? 0) + 1;
    return b;
  },
  async getBlogById(id: string) {
    await wait(100);
    const b = BLOGS.find((b) => b.id === id);
    if (!b) throw new Error("Blog not found");
    return b;
  },
  async myBlogs(token: string) {
    const id = atob(token.split(".")[1] || "");
    return this.listBlogs({ authorId: id, pageSize: 100 });
  },
  async createBlog(token: string, input: Omit<Blog, "id" | "slug" | "author" | "createdAt" | "updatedAt" | "views" | "category"> & { categoryId: string }) {
    await wait();
    const id = atob(token.split(".")[1] || "");
    const u = USERS.find((u) => u.id === id);
    if (!u) throw new Error("Unauthorized");
    const cat = CATEGORIES.find((c) => c.id === input.categoryId) ?? CATEGORIES[0];
    const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    const b: Blog = {
      id: "b" + Date.now(),
      slug,
      title: input.title,
      excerpt: input.excerpt || input.content.replace(/<[^>]+>/g, "").slice(0, 160),
      content: input.content,
      coverImage: input.coverImage,
      category: cat,
      tags: input.tags,
      author: { id: u.id, name: u.name, email: u.email },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      published: input.published ?? true,
    };
    BLOGS.unshift(b);
    return b;
  },
  async updateBlog(token: string, id: string, patch: Partial<Blog> & { categoryId?: string }) {
    await wait();
    const uid = atob(token.split(".")[1] || "");
    const u = USERS.find((u) => u.id === uid);
    const b = BLOGS.find((b) => b.id === id);
    if (!u || !b) throw new Error("Not found");
    if (b.author.id !== u.id && u.role !== "ADMIN") throw new Error("Forbidden");
    if (patch.title) b.title = patch.title;
    if (patch.content) b.content = patch.content;
    if (patch.excerpt !== undefined) b.excerpt = patch.excerpt;
    if (patch.coverImage !== undefined) b.coverImage = patch.coverImage;
    if (patch.tags) b.tags = patch.tags;
    if (patch.categoryId) {
      const c = CATEGORIES.find((c) => c.id === patch.categoryId);
      if (c) b.category = c;
    }
    if (patch.published !== undefined) b.published = patch.published;
    b.updatedAt = new Date().toISOString();
    return b;
  },
  async deleteBlog(token: string, id: string) {
    await wait();
    const uid = atob(token.split(".")[1] || "");
    const u = USERS.find((u) => u.id === uid);
    const idx = BLOGS.findIndex((b) => b.id === id);
    if (!u || idx < 0) throw new Error("Not found");
    const b = BLOGS[idx];
    if (b.author.id !== u.id && u.role !== "ADMIN") throw new Error("Forbidden");
    BLOGS.splice(idx, 1);
    return { ok: true };
  },
  async categories() {
    await wait(50);
    return CATEGORIES;
  },
  async tags() {
    await wait(50);
    const t = new Set<string>();
    BLOGS.forEach((b) => b.tags.forEach((x) => t.add(x)));
    return Array.from(t);
  },
  async uploadImage(file: File) {
    await wait(300);
    return { url: URL.createObjectURL(file) };
  },
  async adminStats(): Promise<AdminStats> {
    await wait();
    return {
      totalBlogs: BLOGS.length,
      totalAuthors: USERS.filter((u) => u.role === "AUTHOR").length,
      totalAdmins: USERS.filter((u) => u.role === "ADMIN").length,
      recentActivity: BLOGS.slice(0, 6).map((b) => ({
        id: b.id,
        text: `${b.author.name} published "${b.title}"`,
        date: b.createdAt,
      })),
    };
  },
  async adminAuthors(search?: string) {
    await wait();
    const s = (search || "").toLowerCase();
    return USERS.filter((u) => u.role === "AUTHOR" && (!s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)));
  },
  async adminToggleSuspend(userId: string) {
    await wait();
    const u = USERS.find((u) => u.id === userId);
    if (!u) throw new Error("Not found");
    u.suspended = !u.suspended;
    return u;
  },
  async adminBlogs(params: { search?: string; category?: string; page?: number; pageSize?: number }) {
    return this.listBlogs({ ...params, pageSize: params.pageSize ?? 20 });
  },
};

export type MockApi = typeof mockApi;
