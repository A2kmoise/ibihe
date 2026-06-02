import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, FormEvent } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard/my-blogs'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password, remember)
      toast.success('Welcome back')
      navigate(redirect)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Hero Image */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90">
          <img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=1200&fit=crop"
            alt="Hero"
            className="h-full w-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2">
            <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
            <Link to="/" className="text-4xl font-black text-primary-foreground">
              menya<span className="text-primary">.</span>
            </Link>
          </div>
          <div className="max-w-md">
            <h2 className="text-4xl font-black text-primary-foreground">Welcome Back</h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Continue your journey of sharing stories and connecting with readers worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
              <path d="M2 2l7.586 7.586"></path>
              <circle cx="11" cy="11" r="2"></circle>
            </svg>
            <Link to="/" className="text-3xl font-black">
              menya<span className="text-primary">.</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-black">Hi Writer</h1>
            <p className="mt-2 text-muted-foreground">Welcome to menya</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-12 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border-2 border-border bg-background px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary"
                />
                Remember me
              </label>
              <Link to="#" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <div className="text-center text-sm text-muted-foreground">or</div>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-xl border-2 font-semibold transition-modern hover:scale-105"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Login with Google
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-primary font-bold text-primary-foreground shadow-modern transition-modern hover:scale-105"
            >
              {loading ? 'Signing in…' : 'Login'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Sign up
            </Link>
          </p>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo: <code className="rounded bg-muted px-2 py-1">admin@menya.com</code> or{' '}
            <code className="rounded bg-muted px-2 py-1">author@menya.com</code>
            <br />
            Password: <code className="rounded bg-muted px-2 py-1">password123</code>
          </p>
        </div>
      </div>
    </div>
  )
}
