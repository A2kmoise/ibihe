import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { LayoutDashboard, Users, FileText, LogOut } from 'lucide-react'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs = [
    { to: '/admin', label: 'Overview', exact: true },
    { to: '/admin/authors', label: 'Authors' },
    { to: '/admin/blogs', label: 'Blogs' },
  ]

  const isActive = (tab: typeof tabs[0]) => {
    if (tab.exact) {
      return location.pathname === tab.to
    }
    return location.pathname.startsWith(tab.to)
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
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
            <p className="mt-2 text-sm font-bold text-primary">Admin Panel</p>
          </div>

          {/* User Profile */}
          <div className="flex-1 border-b border-border p-4">
            <div className="rounded-xl bg-accent p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-bold">{user?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4">
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
          {/* Tabs Navigation */}
          <div className="mb-8">
            <div className="flex gap-2 border-b-2 border-border">
              {tabs.map((tab) => {
                const active = isActive(tab)
                return (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    className={`relative px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${active
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {tab.label}
                    {active && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <Outlet />
        </div>
      </main>
    </div>
  )
}
