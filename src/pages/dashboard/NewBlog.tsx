import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { BlogForm } from '@/components/BlogForm'
import { toast } from 'sonner'

export default function NewBlogPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const create = useMutation({
    mutationFn: (v: any) => api.createBlog(v),
    onSuccess: (b) => {
      toast.success(b.published ? 'Blog published' : 'Draft saved')
      qc.invalidateQueries({ queryKey: ['my-blogs'] })
      qc.invalidateQueries({ queryKey: ['blogs'] })
      navigate('/dashboard/my-blogs')
    },
    onError: (e: Error) => toast.error(e.message),
  })
  return <BlogForm submitting={create.isPending} onSubmit={(v) => create.mutate(v)} />
}
