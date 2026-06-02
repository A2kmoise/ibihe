import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { api } from '@/lib/api/client'
import { BlogCard } from '@/components/BlogCard'
import { useState } from 'react'
import { Pagination } from '@/components/Pagination'

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>()
  const [page, setPage] = useState(1)
  const pageSize = 12

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', 'tag', tag, page],
    queryFn: () => api.listBlogs({ page, pageSize, tag, sort: 'newest' }),
    enabled: !!tag,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-5xl font-black tracking-tight">#{tag}</h1>
      <p className="mt-2 text-muted-foreground">Browse blogs with this tag</p>

      {isLoading ? (
        <div className="mt-12 text-center text-muted-foreground">Loading...</div>
      ) : data?.items.length === 0 ? (
        <div className="mt-12 text-center text-muted-foreground">No blogs found with this tag</div>
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
