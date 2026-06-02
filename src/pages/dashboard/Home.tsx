import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { useAuth } from '@/lib/auth-context'
import { Link } from 'react-router-dom'
import { PenSquare, FileText, TrendingUp } from 'lucide-react'
import type { Blog } from '@/lib/api/types'

export default function DashboardHome() {
  const { user } = useAuth()
  const { data: myBlogs } = useQuery({
    queryKey: ['my-blogs'],
    queryFn: () => api.myBlogs(),
  })

  const totalViews = myBlogs?.items.reduce((sum: number, blog: Blog) => sum + (blog.views || 0), 0) || 0
  const publishedCount = myBlogs?.items.filter((b: Blog) => b.published).length || 0
  const draftCount = (myBlogs?.total || 0) - publishedCount

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black">Welcome back, {user?.name} 👋</h1>
        <p className="mt-2 text-muted-foreground">Here's your writing overview</p>
      </div>

      {/* Stats Grid - 3 cards instead of 4 */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="group overflow-hidden rounded-xl border border-border bg-card p-6 shadow-modern transition-modern hover:scale-[1.02] hover:shadow-modern-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Blogs</p>
              <p className="mt-3 text-5xl font-black">{myBlogs?.total || 0}</p>
              <p className="mt-2 flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3" />
                All your content
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="group overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-6 shadow-modern transition-modern hover:scale-[1.02] hover:shadow-modern-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-primary">Published</p>
              <p className="mt-3 text-5xl font-black text-primary">{publishedCount}</p>
              <p className="mt-2 flex items-center text-xs text-primary/80">
                <TrendingUp className="mr-1 h-3 w-3" />
                Live posts
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-modern">
              <PenSquare className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="group overflow-hidden rounded-xl border border-border bg-card p-6 shadow-modern transition-modern hover:scale-[1.02] hover:shadow-modern-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Drafts</p>
              <p className="mt-3 text-5xl font-black">{draftCount}</p>
              <p className="mt-2 flex items-center text-xs text-muted-foreground">
                <FileText className="mr-1 h-3 w-3" />
                Unpublished
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-foreground">
              <FileText className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card p-8 shadow-modern">
        <h2 className="mb-6 text-2xl font-black">Quick Actions ⚡</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            to="/dashboard/blogs/new"
            className="group overflow-hidden rounded-xl bg-gradient-to-br from-primary to-emerald-600 p-6 text-primary-foreground shadow-modern transition-modern hover:scale-[1.02] hover:shadow-modern-lg"
          >
            <PenSquare className="mb-4 h-8 w-8" />
            <div className="text-xl font-black">Write New Blog</div>
            <p className="mt-2 text-sm opacity-90">Start writing your next post</p>
          </Link>

          <Link
            to="/dashboard/my-blogs"
            className="group overflow-hidden rounded-xl border border-border bg-background p-6 shadow-modern transition-modern hover:scale-[1.02] hover:border-primary hover:shadow-modern-lg"
          >
            <FileText className="mb-4 h-8 w-8 text-primary" />
            <div className="text-xl font-black">View All Blogs</div>
            <p className="mt-2 text-sm text-muted-foreground">Manage your content</p>
          </Link>

          <Link
            to="/dashboard/profile"
            className="group overflow-hidden rounded-xl border border-border bg-background p-6 shadow-modern transition-modern hover:scale-[1.02] hover:border-primary hover:shadow-modern-lg"
          >
            <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-xl font-black">Edit Profile</div>
            <p className="mt-2 text-sm text-muted-foreground">Update your details</p>
          </Link>
        </div>
      </div>

      {/* Recent Blogs */}
      {myBlogs?.items && myBlogs.items.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card p-8 shadow-modern">
          <h2 className="mb-6 text-2xl font-black">Recent Blogs 📝</h2>
          <div className="space-y-4">
            {myBlogs.items.slice(0, 5).map((blog: Blog) => (
              <Link
                key={blog.id}
                to={`/dashboard/blogs/${blog.id}/edit`}
                className="group flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-modern hover:scale-[1.01] hover:border-primary hover:shadow-modern"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold group-hover:text-primary">{blog.title}</p>
                    {!blog.published && (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                      {blog.category.name}
                    </span>
                    {blog.views !== undefined && (
                      <span className="font-semibold">{blog.views} views</span>
                    )}
                  </div>
                </div>
                <div className="text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Edit →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
