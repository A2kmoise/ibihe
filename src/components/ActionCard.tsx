import { Link } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'
import { ElementType } from 'react'

interface ActionCardProps {
  to: string
  icon: LucideIcon | ElementType
  title: string
  description: string
  primary?: boolean
}

export const ActionCard = ({ to, icon: Icon, title, description, primary = false }: ActionCardProps) => (
  <Link
    to={to}
    className={`group overflow-hidden rounded-xl border border-border p-6 shadow-modern transition-modern hover:scale-[1.02] hover:border-primary hover:shadow-modern-lg ${primary
      ? 'bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground'
      : 'bg-background'
      }`}>
    <Icon className={`mb-4 h-8 w-8 ${!primary && 'text-primary'}`} />
    <div className="text-xl font-black">{title}</div>
    <p className={`mt-2 text-sm ${primary ? 'opacity-90' : 'text-muted-foreground'}`}>
      {description}
    </p>
  </Link>
)