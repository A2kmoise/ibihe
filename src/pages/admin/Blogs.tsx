import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { Pagination } from '@/components/Pagination'
import type { Category, Blog } from '@/lib/api/types'

export default function AdminBlogs() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['admin-blogs', search, category, page],
    queryFn: () => api.adminBlogs({ search, category, page }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories(),
  })

  return (
    <div>
      <h1 className="text-3xl font-black">Manage Blogs</h1>
      <p className="mt-2 text-muted-foreground">View and manage all platform blogs</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 flex-1 min-w-[200px] border-2 border-border bg-background px-3 text-sm font-medium outline-none focus:border-primary"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 border-2 border-border bg-background px-3 text-sm font-medium outline-none focus:border-primary"
        >
          <option value="">All categories</option>
          {categories?.map((c: Category) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="mt-8 text-center text-muted-foreground">Loading...</div>
      ) : !blogs?.items.length ? (
        <div className="mt-8 border-2 border-border bg-card p-12 text-center text-muted-foreground">
          No blogs found
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {blogs.items.map((blog: Blog) => (
              <div key={blog.id} className="border-2 border-border bg-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black">{blog.title}</h3>
                      {!blog.published && (
                        <span className="border border-border bg-muted px-2 py-0.5 text-xs font-bold">
                          DRAFT
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{blog.excerpt}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="font-bold text-foreground">{blog.author.name}</span>
                      <span>·</span>
                      <span>{blog.category.name}</span>
                      <span>·</span>
                      <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                      {blog.views !== undefined && (
                        <>
                          <span>·</span>
                          <span>{blog.views} views</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="whitespace-nowrap border-2 border-border bg-background px-4 py-2 text-sm font-bold hover:bg-accent"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {blogs.total > 10 && (
            <div className="mt-8">
              <Pagination
                page={page}
                pageSize={10}
                total={blogs.total}
                onChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
