import { useQuery } from '@tanstack/react-query'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api/client'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => api.getBlog(slug!),
    enabled: !!slug,
  })

  const handleGoBack = () => {
    navigate(-1)
  }

  if (isLoading) {
    return (
      <div>
        {/* Glass Navbar */}
        <nav className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-black text-primary-foreground">
                  i
                </div>
                <span className="text-2xl font-bold">
                  ibihe<span className="text-primary">.</span>
                </span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">Loading...</div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div>
        {/* Glass Navbar */}
        <nav className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-black text-primary-foreground">
                  i
                </div>
                <span className="text-2xl font-bold">
                  ibihe<span className="text-primary">.</span>
                </span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">Blog not found</div>
      </div>
    )
  }

  return (
    <div>
      {/* Glass Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
              <span className="text-2xl font-bold">
                menya<span className="text-primary">.</span>
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <article className="mx-auto max-w-4xl px-4 py-16">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blogs
        </button>

        <header className="mt-8">
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="aspect-video w-full border-2 border-border object-cover"
            />
          )}

          <div className="mt-8">
            <Link
              to={`/categories/${blog.category.slug}`}
              className="inline-block border-2 border-border bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground"
            >
              {blog.category.name}
            </Link>
            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">{blog.title}</h1>
            <p className="mt-4 text-xl text-muted-foreground">{blog.excerpt}</p>

            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{blog.author.name}</span>
              <span>·</span>
              <time>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</time>
              {blog.views && (
                <>
                  <span>·</span>
                  <span>{blog.views} views</span>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="prose-content mt-12" dangerouslySetInnerHTML={{ __html: blog.content }} />

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                to={`/tags/${tag}`}
                className="border-2 border-border bg-muted px-3 py-1 text-sm font-semibold hover:bg-accent"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}
