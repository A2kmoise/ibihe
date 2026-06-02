import { useAuth } from '@/lib/auth-context'
import { useState, FormEvent } from 'react'
import { api } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user, refresh } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await api.updateProfile({ name, email })
      await refresh()
      toast.success('Profile updated')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const changePw = async (e: FormEvent) => {
    e.preventDefault()
    setSavingPw(true)
    try {
      await api.changePassword(current, next)
      toast.success('Password changed')
      setCurrent(''); setNext('')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-black tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your account details.</p>

      <div className="mt-8 border-2 border-border p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center border-2 border-border bg-primary text-2xl font-black text-primary-foreground">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="text-lg font-bold">{user?.name}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
            <span className="mt-1 inline-block border-2 border-border bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={saveProfile} className="mt-6 space-y-4 border-2 border-border p-6">
        <h2 className="text-xl font-bold">Account details</h2>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full border-2 border-border bg-background px-3 text-sm font-medium outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 w-full border-2 border-border bg-background px-3 text-sm font-medium outline-none focus:border-primary" />
        </div>
        <Button disabled={savingProfile} className="border-2 border-border bg-primary font-bold text-primary-foreground hover:bg-primary/90">
          {savingProfile ? 'Saving…' : 'Save changes'}
        </Button>
      </form>

      <form onSubmit={changePw} className="mt-6 space-y-4 border-2 border-border p-6">
        <h2 className="text-xl font-bold">Change password</h2>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider">Current password</label>
          <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className="h-11 w-full border-2 border-border bg-background px-3 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider">New password</label>
          <input type="password" minLength={8} required value={next} onChange={(e) => setNext(e.target.value)} className="h-11 w-full border-2 border-border bg-background px-3 text-sm outline-none focus:border-primary" />
        </div>
        <Button disabled={savingPw} className="border-2 border-border bg-primary font-bold text-primary-foreground hover:bg-primary/90">
          {savingPw ? 'Saving…' : 'Update password'}
        </Button>
      </form>
    </div>
  )
}
