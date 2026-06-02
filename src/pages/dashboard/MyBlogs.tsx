import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function MyBlogs() {
  const queryClient = useQueryClient()

  const { data: myBlogs, isLoading } = useQuery({
    queryKey: ['my-blogs'],
    queryFn: () => api.myBlogs(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-blogs'] })
      toast.success('Blog deleted')
    },
    onError: () => toast.error('Failed to delete blog'),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black">My Blogs</h1>
          <p className="mt-2 text-muted-foreground">Manage your content</p>
        </div>
        <Button asChild className="rounded-xl bg-primary font-bold shadow-modern transition-modern hover:scale-105">
          <Link to="/dashboard/blogs/new">
            <Plus className="mr-2 h-5 w-5" />
            New Blog
          </Link>
        </Button>
      </div>

      {!myBlogs?.items.length ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto max-w-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-6 text-xl font-bold">No blogs yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't written any blogs yet. Start creating your first blog post!
            </p>
            <Button asChild className="mt-6 rounded-xl bg-primary font-bold shadow-modern transition-modern hover:scale-105">
              <Link to="/dashboard/blogs/new">
                <Plus className="mr-2 h-5 w-5" />
                Write your first blog
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {myBlogs.items.map((blog) => (
            <div
              key={blog.id}
              className="group rounded-xl border border-border bg-card p-6 shadow-modern transition-all hover:shadow-modern-lg"
            >
              <div className="flex items-start gap-6">
                {/* Blog Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary">
                      {blog.title}
                    </h3>
                    {!blog.published && (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{blog.excerpt}</p>

                  {/* Meta Info */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                      {blog.category.name}
                    </span>
                    <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
                    {blog.views !== undefined && (
                      <span className="font-semibold">{blog.views} views</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/dashboard/blogs/${blog.id}/edit`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent hover:text-primary"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this blog?')) {
                        deleteMutation.mutate(blog.id)
                      }
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
