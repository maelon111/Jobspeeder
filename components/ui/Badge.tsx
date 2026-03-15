import { cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/types/supabase'

const statusConfig: Record<ApplicationStatus, { label: string; className: string; dot: string }> = {
  pending: { label: 'En attente', className: 'bg-yellow-500/12 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-400' },
  sent: { label: 'Envoyée', className: 'bg-blue-500/12 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
  viewed: { label: 'Vue', className: 'bg-purple-500/12 text-purple-400 border-purple-500/20', dot: 'bg-purple-400' },
  interview: { label: 'Entretien 🎉', className: 'bg-brand/12 text-brand border-brand/20', dot: 'bg-brand' },
  rejected: { label: 'Refusée', className: 'bg-red-500/12 text-red-400 border-red-500/20', dot: 'bg-red-400' },
}

interface StatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap',
      config.className,
      className
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
      {config.label}
    </span>
  )
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variant === 'default' && 'bg-white/8 text-white/60 border-white/12',
      variant === 'brand' && 'bg-brand/12 text-brand border-brand/20',
      variant === 'success' && 'bg-green-500/12 text-green-400 border-green-500/20',
      variant === 'warning' && 'bg-yellow-500/12 text-yellow-400 border-yellow-500/20',
      variant === 'danger' && 'bg-red-500/12 text-red-400 border-red-500/20',
      className
    )}>
      {children}
    </span>
  )
}
