import { useQuery } from '@tanstack/react-query'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api/client'
import { format } from 'date-fns'
import { ArrowLeft, Share2, Clock, Eye, Heart, Bookmark, Twitter, MessageCircle, Check, ArrowUp } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect, useState, useMemo } from 'react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import type { Blog } from '@/lib/api/types'

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(12)
  const [bookmarked, setBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => api.getBlog(slug!),
    enabled: !!slug,
  })

  // Fetch related blogs from the same category or latest
  const { data: relatedData } = useQuery({
    queryKey: ['related-blogs', blog?.category?.slug],
    queryFn: () => api.listBlogs({ page: 1, pageSize: 4, sort: 'newest' }),
    enabled: !!blog,
  })

  const relatedBlogs = useMemo(() => {
    if (!relatedData?.items) return []
    return relatedData.items.filter((item: Blog) => item.id !== blog?.id).slice(0, 3)
  }, [relatedData, blog?.id])

  // Track scroll progress and scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100)
      }
      setShowScrollTop(totalScroll > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate read time
  const readTimeMinutes = useMemo(() => {
    if (!blog?.content) return 1
    const textOnly = blog.content.replace(/<[^>]*>/g, ' ')
    const words = textOnly.trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 200))
  }, [blog?.content])

  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} — Menya`
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', blog.excerpt || blog.title)
      }

      const metaImage = document.querySelector('meta[property="og:image"]')
      if (metaImage) {
        metaImage.setAttribute('content', blog.coverImage || '')
      }
    }
  }, [blog])

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleShare = () => {
    const blogUrl = window.location.href
    navigator.clipboard.writeText(blogUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
    toast.success('Blog link copied to clipboard!')
  }

  const handleTwitterShare = () => {
    if (!blog) return
    const text = encodeURIComponent(`Reading "${blog.title}" on Menya`)
    const url = encodeURIComponent(window.location.href)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  const handleWhatsAppShare = () => {
    if (!blog) return
    const text = encodeURIComponent(`Check out this story: "${blog.title}" - ${window.location.href}`)
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const handleLike = () => {
    if (liked) {
      setLiked(false)
      setLikeCount((prev) => prev - 1)
    } else {
      setLiked(true)
      setLikeCount((prev) => prev + 1)
      toast.success('Thanks for appreciating this story!')
    }
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    toast.success(bookmarked ? 'Removed from reading list' : 'Saved to reading list!')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm font-semibold text-muted-foreground">Loading story...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <h2 className="text-2xl font-black">Blog not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">The story you are looking for may have been removed or unpublished.</p>
          <Button asChild className="mt-6 rounded-xl bg-primary font-bold shadow-modern">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll Progress Bar */}
      <div className="fixed left-0 top-0 z-50 h-1.5 w-full bg-transparent">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navbar />

      <article className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <button
            onClick={handleGoBack}
            className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to blogs
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-full text-xs font-semibold gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Share2 className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Share'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBookmark}
              className={`rounded-full text-xs font-semibold gap-1.5 ${bookmarked ? 'border-primary text-primary bg-primary/10' : ''}`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? 'fill-primary' : ''}`} />
              {bookmarked ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Header Section */}
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/categories/${blog.category.slug}`}
              className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {blog.category.name}
            </Link>
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5" />
              {readTimeMinutes} min read
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-4 text-xl leading-relaxed text-muted-foreground">
              {blog.excerpt}
            </p>
          )}

          {/* Author & Meta Row */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground shadow-sm">
                {blog.author.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold leading-none">{blog.author.name}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <time>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</time>
                  {blog.views !== undefined && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {blog.views} views
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick social share buttons */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <button
                onClick={handleTwitterShare}
                title="Share on X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
              >
                <Twitter className="h-4 w-4" />
              </button>
              <button
                onClick={handleWhatsAppShare}
                title="Share on WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="mt-8 overflow-hidden rounded-2xl border-2 border-border shadow-modern">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="aspect-video w-full object-cover"
              />
            </div>
          )}
        </header>

        {/* Article Body */}
        <div className="prose-content mt-10" dangerouslySetInnerHTML={{ __html: blog.content }} />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-10 border-t border-border pt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Topics</p>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tags/${tag}`}
                  className="rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Action Bar */}
        <div className="mt-8 flex items-center justify-between rounded-2xl border-2 border-border bg-card p-6 shadow-modern">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                liked
                  ? 'bg-rose-500/10 text-rose-500'
                  : 'bg-accent text-foreground hover:bg-rose-500/10 hover:text-rose-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-rose-500' : ''}`} />
              <span>{likeCount}</span>
            </button>
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                bookmarked
                  ? 'bg-primary/10 text-primary'
                  : 'bg-accent text-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-primary' : ''}`} />
              <span>{bookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-full text-xs font-semibold gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share story
            </Button>
          </div>
        </div>

        {/* Author Bio Card */}
        <div className="mt-12 overflow-hidden rounded-2xl border-2 border-border bg-card p-8 shadow-modern">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-primary-foreground shadow-modern">
              {blog.author.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Written by</span>
              <h3 className="text-xl font-black">{blog.author.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Contributing writer on Menya. Sharing insights on {blog.category.name.toLowerCase()} and modern creative work.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-xl border-2 border-border font-bold">
              <Link to={`/categories/${blog.category.slug}`}>
                More stories
              </Link>
            </Button>
          </div>
        </div>

        {/* Related / "Read Next" Articles */}
        {relatedBlogs.length > 0 && (
          <section className="mt-16 border-t-2 border-border pt-12">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black">Read Next</h2>
              <Link
                to="/"
                className="text-sm font-bold text-primary hover:underline"
              >
                View all blogs →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedBlogs.map((item: Blog) => (
                <Link
                  key={item.id}
                  to={`/blogs/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-modern transition-all hover:scale-[1.02] hover:border-primary hover:shadow-modern-lg"
                >
                  {item.coverImage ? (
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-video w-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {item.category.name}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-[11px] font-bold text-primary">
                      {item.category.name}
                    </span>
                    <h4 className="mt-1 font-bold leading-snug group-hover:text-primary line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {item.excerpt}
                    </p>
                    <div className="mt-auto pt-3 text-[11px] text-muted-foreground">
                      {format(new Date(item.createdAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-modern transition-all hover:scale-110"
          title="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}