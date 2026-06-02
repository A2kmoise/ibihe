import { Link } from "react-router-dom";
import { format } from "date-fns";
import type { Blog } from "@/lib/api/types";

export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <article className="group flex flex-col border-2 border-border bg-card transition-transform hover:-translate-y-0.5">
      {blog.coverImage && (
        <Link to={`/blogs/${blog.slug}`} className="block aspect-[16/10] overflow-hidden border-b-2 border-border">
          <img
            src={blog.coverImage}
            alt={blog.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <Link
            to={`/categories/${blog.category.slug}`}
            className="border-2 border-border bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground"
          >
            {blog.category.name}
          </Link>
          <time className="text-xs text-muted-foreground">
            {format(new Date(blog.createdAt), "MMM d, yyyy")}
          </time>
        </div>
        <h3 className="text-xl font-black leading-tight">
          <Link to={`/blogs/${blog.slug}`} className="hover:text-primary">
            {blog.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{blog.excerpt}</p>
        <div className="mt-4 flex items-center justify-between border-t-2 border-border pt-3 text-xs">
          <span className="font-semibold">{blog.author.name}</span>
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 2).map((t) => (
              <Link
                key={t}
                to={`/tags/${t}`}
                className="text-muted-foreground hover:text-primary"
              >
                #{t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
