import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { Users, FileText, Shield, TrendingUp, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.adminStats(),
  })

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="group overflow-hidden rounded-xl border border-border bg-card p-6 shadow-modern transition-modern hover:scale-[1.02] hover:shadow-modern-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Blogs</p>
              <p className="mt-3 text-5xl font-black">{stats?.totalBlogs || 0}</p>
              <p className="mt-2 flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3" />
                Active content
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="group overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-6 shadow-modern transition-modern hover:scale-[1.02] hover:shadow-modern-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-primary">Total Authors</p>
              <p className="mt-3 text-5xl font-black text-primary">{stats?.totalAuthors || 0}</p>
              <p className="mt-2 flex items-center text-xs text-primary/80">
                <Activity className="mr-1 h-3 w-3" />
                Content creators
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-modern">
              <Users className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="group overflow-hidden rounded-xl border border-border bg-card p-6 shadow-modern transition-modern hover:scale-[1.02] hover:shadow-modern-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Admins</p>
              <p className="mt-3 text-5xl font-black">{stats?.totalAdmins || 0}</p>
              <p className="mt-2 flex items-center text-xs text-muted-foreground">
                <Shield className="mr-1 h-3 w-3" />
                Moderators
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-foreground">
              <Shield className="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card p-8 shadow-modern">
        <h2 className="mb-6 text-2xl font-black">Quick Actions ⚡</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            to="/admin/blogs"
            className="group overflow-hidden rounded-xl border border-border bg-background p-6 shadow-modern transition-modern hover:scale-[1.02] hover:border-primary hover:shadow-modern-lg"
          >
            <FileText className="mb-4 h-8 w-8 text-primary" />
            <div className="text-xl font-black">Manage Blogs</div>
            <p className="mt-2 text-sm text-muted-foreground">View and moderate all blogs</p>
          </Link>

          <Link
            to="/admin/authors"
            className="group overflow-hidden rounded-xl border border-border bg-background p-6 shadow-modern transition-modern hover:scale-[1.02] hover:border-primary hover:shadow-modern-lg"
          >
            <Users className="mb-4 h-8 w-8 text-primary" />
            <div className="text-xl font-black">Manage Authors</div>
            <p className="mt-2 text-sm text-muted-foreground">Control user accounts</p>
          </Link>

          <Link
            to="/"
            className="group overflow-hidden rounded-xl border border-border bg-background p-6 shadow-modern transition-modern hover:scale-[1.02] hover:border-primary hover:shadow-modern-lg"
          >
            <Activity className="mb-4 h-8 w-8 text-primary" />
            <div className="text-xl font-black">View Platform</div>
            <p className="mt-2 text-sm text-muted-foreground">See public site</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card p-8 shadow-modern">
          <h2 className="mb-6 text-2xl font-black">Recent Activity 📊</h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-accent"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{activity.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
