import { LucideIcon, TrendingUp } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  description: string
  primary?: boolean
}

export const StatCard = ({ title, value, icon: Icon, description, primary = false }: StatCardProps) => (
  <div
    className={`group overflow-hidden rounded-xl border border-border bg-card p-6 shadow-modern transition-modern hover:scale-[1.02] hover:shadow-modern-lg ${primary && 'bg-gradient-to-br from-primary/10 to-primary/5'
      }`}>
    <div className="flex items-start justify-between">
      <div>
        <p
          className={`text-sm font-bold uppercase tracking-wider ${primary ? 'text-primary' : 'text-muted-foreground'
            }`}>
          {title}
        </p>
        <p className={`mt-3 text-5xl font-black ${primary && 'text-primary'}`}>{value}</p>
        <p
          className={`mt-2 flex items-center text-xs ${primary ? 'text-primary/80' : 'text-muted-foreground'
            }`}>
          <TrendingUp className="mr-1 h-3 w-3" />
          {description}
        </p>
      </div>
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-xl ${primary
          ? 'bg-primary text-primary-foreground shadow-modern'
          : 'bg-primary/10 text-primary'
          }`}>
        <Icon className="h-7 w-7" />
      </div>
    </div>
  </div>
)