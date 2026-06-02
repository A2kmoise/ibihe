import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { BlogForm } from '@/components/BlogForm'
import { Spinner } from '@/components/Spinner'
import { toast } from 'sonner'
import { useState } from 'react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog-by-id', id],
    queryFn: () => api.getBlogById(id!),
    enabled: !!id,
  })

  const update = useMutation({
    mutationFn: (v: any) => api.updateBlog(id!, v),
    onSuccess: () => {
      toast.success('Blog updated')
      qc.invalidateQueries({ queryKey: ['my-blogs'] })
      qc.invalidateQueries({ queryKey: ['blogs'] })
      qc.invalidateQueries({ queryKey: ['blog-by-id', id] })
      navigate('/dashboard/my-blogs')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const del = useMutation({
    mutationFn: () => api.deleteBlog(id!),
    onSuccess: () => {
      toast.success('Blog deleted')
      qc.invalidateQueries({ queryKey: ['my-blogs'] })
      navigate('/dashboard/my-blogs')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  if (isLoading || !blog) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <>
      <BlogForm
        initial={{ ...blog, categoryId: blog.category.id }}
        submitting={update.isPending}
        onSubmit={(v) => update.mutate(v)}
        onDelete={() => setConfirmOpen(true)}
      />
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="border-2 border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="border-2 border-border bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => del.mutate()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
