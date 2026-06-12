export type Role = "AUTHOR" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  suspended?: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML from TipTap
  coverImage?: string;
  category: Category;
  tags: string[];
  author: Pick<User, "id" | "name" | "email">;
  createdAt: string;
  updatedAt: string;
  views?: number;
  published?: boolean;
  scheduledAt?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminStats {
  totalBlogs: number;
  totalAuthors: number;
  totalAdmins: number;
  recentActivity: { id: string; text: string; date: string }[];
}
