import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { Users, FileText, Shield, TrendingUp, Activity, Zap, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatCard } from '@/components/StatCard'

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.adminStats(),
  })

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Blogs"
          value={stats?.totalBlogs || 0}
          icon={FileText}
          description="Active content"
        />
        <StatCard
          title="Total Authors"
          value={stats?.totalAuthors || 0}
          icon={Users}
          description="Content creators"
          primary
        />
        <StatCard
          title="Total Admins"
          value={stats?.totalAdmins || 0}
          icon={Shield}
          description="Moderators"
        />
        <StatCard
          title="Total Views"
          value={stats?.totalViews || 0}
          icon={TrendingUp}
          description="Across all blogs"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card p-8 shadow-modern">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-black">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </h2>
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
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-black">
            <BarChart3 className="h-5 w-5 text-primary" />
            Recent Activity
          </h2>
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