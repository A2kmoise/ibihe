import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { BlogCard } from '@/components/BlogCard'
import { Pagination } from '@/components/Pagination'
import { useState } from 'react'

export default function BlogsPage() {
  const [page, setPage] = useState(1)
  const pageSize = 12

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', page],
    queryFn: () => api.listBlogs({ page, pageSize, sort: 'newest' }),
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-5xl font-black tracking-tight">All blogs</h1>
      <p className="mt-2 text-muted-foreground">Read from our community of writers</p>

      {isLoading ? (
        <div className="mt-12 text-center text-muted-foreground">Loading...</div>
      ) : (
        <>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.items.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
          </div>

          {data && data.total > pageSize && (
            <div className="mt-12">
              <Pagination
                page={page}
                pageSize={pageSize}
                total={data.total}
                onChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
