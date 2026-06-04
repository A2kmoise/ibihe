import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { useState, useRef, useEffect } from 'react'
import type { Blog } from '@/lib/api/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Mock ads data
const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 bg-white/30 backdrop-blur-md border-b border-white/20">
    <div className="text-xl font-bold text-primary">Menya</div>
  </nav>
);
const mockAds = [
  {
    id: 1,
    title: 'Premium Blog Hosting',
    description: 'Get 50% off on your first year',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
    link: '#'
  },
  {
    id: 2,
    title: 'Writing Course',
    description: 'Learn professional blogging techniques',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop',
    link: '#'
  },
  {
    id: 3,
    title: 'SEO Tools',
    description: 'Boost your blog traffic by 300%',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop',
    link: '#'
  }
]

export default function LandingPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const [page, setPage] = useState(1)
  const [carouselSlide, setCarouselSlide] = useState(0)
  const blogSectionRef = useRef<HTMLElement>(null)

  // Fetch 10 blogs and split them
  const { data: allBlogs } = useQuery({
    queryKey: ['all-blogs', page],
    queryFn: () => api.listBlogs({ page, pageSize: 10, sort: 'newest' }),
  })

  // Fetch carousel blogs (first 5 featured blogs)
  const { data: carouselData } = useQuery({
    queryKey: ['carousel-blogs'],
    queryFn: () => api.listBlogs({ page: 1, pageSize: 5, sort: 'newest' }),
  })

  const carouselBlogs = carouselData?.items || []

  // Split the blogs: first 5 for Latest, last 5 for Featured
  const latestBlogs = allBlogs?.items.slice(0, 10) || []
  // split into two columns for left/right layout
  const leftBlogs = latestBlogs.slice(0, Math.ceil(latestBlogs.length / 2))
  const rightBlogs = latestBlogs.slice(Math.ceil(latestBlogs.length / 2))

  const totalPages = Math.ceil((allBlogs?.total || 0) / 10)

  // Auto-slide carousel every 5 seconds
  useEffect(() => {
    if (carouselBlogs.length === 0) return
    const interval = setInterval(() => {
      setCarouselSlide((prev) => (prev + 1) % carouselBlogs.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [carouselBlogs.length])

  const categories = ['All', 'Technology', 'Business', 'Design', 'Lifestyle', 'Health']

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    // Scroll to blog section
    blogSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="bg-background">
  <Navbar />

      {/* Auto-Sliding Carousel */}
      {carouselBlogs.length > 0 && (
        <section className="border-b border-border bg-background">
          <div className="w-full px-4 py-12">
            <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card shadow-modern">
              {/* Carousel Slides */}
              <div className="relative aspect-[21/9]">
                {carouselBlogs.map((blog, index) => (
                  <Link
                    key={blog.id}
                    to={`/blogs/${blog.slug}`}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === carouselSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                  >
                    <div className="relative h-full w-full">
                      {blog.coverImage && (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">
                          {blog.category.name}
                        </span>
                        <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">
                          {blog.title}
                        </h2>
                        <p className="mt-3 max-w-3xl text-lg text-white/90 line-clamp-2">
                          {blog.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-3 text-sm text-white/80">
                          <span className="font-semibold">{blog.author.name}</span>
                          <span>•</span>
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={() =>
                  setCarouselSlide((prev) =>
                    prev === 0 ? carouselBlogs.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={() =>
                  setCarouselSlide((prev) => (prev + 1) % carouselBlogs.length)
                }
                className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {carouselBlogs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselSlide(index)}
                    className={`h-2 rounded-full transition-all ${index === carouselSlide
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-white/50 hover:bg-white/70'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* Filters Section */}
      <section className="border-b border-border bg-background mt-8">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* All Filters in One Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Side: Categories and Sort */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Categories Label */}
              <span className="text-sm font-bold text-muted-foreground">Categories</span>

              {/* Category Buttons */}
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeFilter === category.toLowerCase() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(category.toLowerCase())}
                  className="rounded-full font-semibold transition-modern hover:scale-105"
                >
                  {category}
                </Button>
              ))}

              {/* Divider */}
              <div className="h-6 w-px bg-border" />

              {/* Sort Label */}
              <span className="text-sm font-bold text-muted-foreground">Sort By</span>

              {/* Sort Buttons */}
              <Button
                variant={sortBy === 'newest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('newest')}
                className="rounded-full font-semibold transition-modern hover:scale-105"
              >
                Newest First
              </Button>
              <Button
                variant={sortBy === 'oldest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('oldest')}
                className="rounded-full font-semibold transition-modern hover:scale-105"
              >
                Oldest First
              </Button>
            </div>

            {/* Right Side: Search Bar */}
            <div className="flex-shrink-0 w-80">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs, topics, authors..."
                  className="h-10 w-full rounded-full border-2 border-border bg-background pl-4 pr-24 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button className="absolute right-1 top-1/2 h-8 -translate-y-1/2 rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-modern transition-modern hover:scale-105">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Banner */}
      <section className="border-b border-border bg-linear-to-r from-primary via-primary to-emerald-600">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-background/50 p-6 shadow-modern backdrop-blur-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-primary">🚀 Become a Corporate Partner</p>
              <p className="mt-1 text-sm text-muted-foreground">Reach millions of readers — join our Corporate Suite now</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full font-semibold">
                View Partners
              </Button>
              <Button size="sm" className="rounded-full bg-primary font-semibold text-primary-foreground shadow-modern transition-modern hover:scale-105">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section ref={blogSectionRef} className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column Blogs */}
          <div className="lg:col-span-1">
            <h2 className="mb-6 text-2xl font-bold text-primary">📰 Latest News</h2>
            <div className="space-y-6">
              {leftBlogs.map((blog: Blog) => (
                <Link
                  key={blog.id}
                  to={`/blogs/${blog.slug}`}
                  className="group block overflow-hidden rounded-xl border border-border bg-card shadow-modern transition-modern hover:scale-[1.02] hover:shadow-modern-lg"
                >
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  <div className="p-5">
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {blog.category.name}
                    </span>
                    <h3 className="mt-3 text-lg font-bold leading-tight group-hover:text-primary">{blog.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{blog.author.name}</span>
                      <span>•</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column Blogs */}
          <div className="lg:col-span-1">
            <h2 className="mb-6 text-2xl font-bold text-primary">📰 Latest News</h2>
            <div className="space-y-6">
              {rightBlogs.map((blog: Blog) => (
                <Link
                  key={blog.id}
                  to={`/blogs/${blog.slug}`}
                  className="group block overflow-hidden rounded-xl border border-border bg-card shadow-modern transition-modern hover:scale-[1.02] hover:shadow-modern-lg"
                >
                  {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  <div className="p-5">
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      {blog.category.name}
                    </span>
                    <h3 className="mt-3 text-lg font-bold leading-tight group-hover:text-primary">{blog.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{blog.author.name}</span>
                      <span>•</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Advertisements */}
          <div className="lg:col-span-1">
            <h2 className="mb-6 text-2xl font-bold text-primary">💰 Sponsored</h2>
            <div className="space-y-6">
              {mockAds.map((ad) => (
                <a
                  key={ad.id}
                  href={ad.link}
                  className="block overflow-hidden rounded-xl border border-border bg-card shadow-modern transition-modern hover:scale-[1.02] hover:border-primary hover:shadow-modern-lg"
                >
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="aspect-video w-full object-cover"
                  />
                  <div className="p-5">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                      Advertisement
                    </div>
                    <h3 className="font-bold">{ad.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{ad.description}</p>
                    <Button size="sm" className="mt-4 w-full rounded-full bg-primary font-semibold text-primary-foreground shadow-modern transition-modern hover:scale-105">
                      Learn More →
                    </Button>
                  </div>
                </a>
              ))}

              {/* Additional Ad Banner */}
              <div className="rounded-xl border border-dashed border-primary bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center shadow-modern">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Your Ad Here</p>
                <p className="mb-4 text-sm font-semibold">Reach thousands of readers</p>
                <Button size="sm" variant="outline" className="rounded-full font-semibold">
                  Advertise With Us
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              variant="outline"
              className="rounded-full px-8 py-6 font-bold transition-modern hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              Previous
            </Button>
            <span className="text-lg font-bold text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-full bg-primary px-8 py-6 font-bold text-primary-foreground shadow-modern transition-modern hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              Next
            </Button>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="border-t border-border bg-gradient-to-r from-primary via-primary to-emerald-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground">✨ Start Your Blogging Journey</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/90">
            Join thousands of writers sharing their stories on menya
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="outline" className="rounded-xl border-2 border-primary-foreground bg-background font-bold text-foreground shadow-modern transition-modern hover:scale-105">
              <Link to="/register">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" className="rounded-xl border-2 border-primary-foreground/20 bg-primary-foreground font-bold text-primary shadow-modern transition-modern hover:scale-105">
              <Link to="/home">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
