import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { useAuth } from '@/lib/auth-context'
import { Link } from 'react-router-dom'
import { PenSquare, FileText, Eye, Zap, ScrollText, User, TrendingUp, BarChart2 } from 'lucide-react'
import type { Blog } from '@/lib/api/types'
import { StatCard } from '@/components/StatCard'
import { ActionCard } from '@/components/ActionCard'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function DashboardHome() {
  const { user } = useAuth()
  const { data: myBlogs } = useQuery({
    queryKey: ['my-blogs'],
    queryFn: () => api.myBlogs(),
  })

  const totalViews = myBlogs?.items.reduce((sum: number, blog: Blog) => sum + (blog.views || 0), 0) || 0
  const publishedCount = myBlogs?.items.filter((b: Blog) => b.published).length || 0
  const draftCount = (myBlogs?.total || 0) - publishedCount

  const chartData = myBlogs?.items && myBlogs.items.length > 0
    ? myBlogs.items.slice(0, 6).map((b: Blog) => ({
        name: b.title.length > 16 ? b.title.slice(0, 14) + '…' : b.title,
        views: b.views || 0,
      }))
    : [
        { name: 'Mon', views: 12 },
        { name: 'Tue', views: 28 },
        { name: 'Wed', views: 45 },
        { name: 'Thu', views: 32 },
        { name: 'Fri', views: 68 },
        { name: 'Sat', views: 94 },
        { name: 'Sun', views: 120 },
      ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">Welcome back, {user?.name}</h1>
        <p className="mt-2 text-muted-foreground">Here's your writing overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Blogs"
          value={myBlogs?.total || 0}
          icon={FileText}
          description="All your content"
        />
        <StatCard
          title="Published"
          value={publishedCount}
          icon={PenSquare}
          description="Live posts"
          primary
        />
        <StatCard
          title="Drafts"
          value={draftCount}
          icon={FileText}
          description="Unpublished"
        />
        <StatCard
          title="Total Views"
          value={totalViews}
          icon={Eye}
          description="Across all blogs"
        />
      </div>

      {/* Analytics Trend Chart */}
      <div className="overflow-hidden rounded-xl border border-border bg-card p-6 shadow-modern">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black">
              <BarChart2 className="h-5 w-5 text-primary" />
              Readership Analytics
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Performance and views across your published articles</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
            <TrendingUp className="h-3.5 w-3.5" />
            Active Reader Growth
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/40" />
              <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground text-xs" />
              <YAxis stroke="currentColor" className="text-muted-foreground text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area type="monotone" dataKey="views" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="overflow-hidden rounded-xl border border-border bg-card p-6 shadow-modern">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-black">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <ActionCard
            to="/dashboard/blogs/new"
            icon={PenSquare}
            title="Write New Blog"
            description="Start your next masterpiece"
            primary
          />
          <ActionCard
            to="/dashboard/my-blogs"
            icon={FileText}
            title="View All Blogs"
            description="Manage your content"
          />
          <ActionCard
            to="/dashboard/profile"
            icon={User}
            title="Edit Profile"
            description="Update your details"
          />
        </div>
      </div>

      {/* Recent Blogs */}
      {myBlogs?.items && myBlogs.items.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card p-8 shadow-modern">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-black">
            <ScrollText className="h-5 w-5 text-primary" />
            Recent Blogs
          </h2>
          <div className="space-y-4">
            {myBlogs.items.slice(0, 5).map((blog: Blog) => (
              <Link
                key={blog.id}
                to={`/dashboard/blogs/${blog.id}/edit`}
                className="group flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-modern hover:scale-[1.01] hover:border-primary hover:shadow-modern"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold group-hover:text-primary">{blog.title}</p>
                    {!blog.published && (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                      {blog.category.name}
                    </span>
                    {blog.views !== undefined && (
                      <span className="font-semibold">{blog.views} views</span>
                    )}
                  </div>
                </div>
                <div className="text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Edit →
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}