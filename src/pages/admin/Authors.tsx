import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Ban, CheckCircle } from 'lucide-react'

export default function AdminAuthors() {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data: authors, isLoading } = useQuery({
    queryKey: ['admin-authors', search],
    queryFn: () => api.adminAuthors(search),
  })

  const toggleSuspend = useMutation({
    mutationFn: (userId: string) => api.adminToggleSuspend(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-authors'] })
      toast.success('Author status updated')
    },
    onError: () => toast.error('Failed to update author'),
  })

  return (
    <div>
      <h1 className="text-3xl font-black">Manage Authors</h1>
      <p className="mt-2 text-muted-foreground">View and manage platform authors</p>

      <div className="mt-8">
        <input
          type="text"
          placeholder="Search authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full max-w-md border-2 border-border bg-background px-3 text-sm font-medium outline-none focus:border-primary"
        />
      </div>

      {isLoading ? (
        <div className="mt-8 text-center text-muted-foreground">Loading...</div>
      ) : !authors?.length ? (
        <div className="mt-8 border-2 border-border bg-card p-12 text-center text-muted-foreground">
          No authors found
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {authors.map((author) => (
            <div key={author.id} className="border-2 border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-black">{author.name}</div>
                    {author.suspended && (
                      <span className="border border-destructive bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
                        SUSPENDED
                      </span>
                    )}
                    <span className="border border-border bg-muted px-2 py-0.5 text-xs font-bold">
                      {author.role}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{author.email}</div>
                  {author.createdAt && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      Joined {new Date(author.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <Button
                  variant={author.suspended ? 'default' : 'destructive'}
                  size="sm"
                  onClick={() => toggleSuspend.mutate(author.id)}
                  disabled={toggleSuspend.isPending}
                  className="border-2 border-border"
                >
                  {author.suspended ? (
                    <><CheckCircle className="mr-2 h-4 w-4" /> Unsuspend</>
                  ) : (
                    <><Ban className="mr-2 h-4 w-4" /> Suspend</>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
