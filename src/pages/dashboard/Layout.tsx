import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { LayoutDashboard, FileText, PenSquare, User, LogOut, Shield } from 'lucide-react'

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/dashboard/my-blogs', label: 'My Blogs', icon: FileText },
    { to: '/dashboard/blogs/new', label: 'New Blog', icon: PenSquare },
    { to: '/dashboard/profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Modern Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-border p-6">
            <Link to="/" className="flex items-center gap-2">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
              <span className="text-xl font-black">
                menya<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon
              const active = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${active
                    ? 'bg-primary text-primary-foreground shadow-modern'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}

            {user?.role === 'ADMIN' && (
              <>
                <div className="my-4 border-t border-border" />
                <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Admin
                </p>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                >
                  <Shield className="h-5 w-5" />
                  Admin Panel
                </Link>
              </>
            )}
          </nav>

          {/* User Profile */}
          <div className="border-t border-border p-4">
            <div className="mb-3 rounded-xl bg-accent p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-bold">{user?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
