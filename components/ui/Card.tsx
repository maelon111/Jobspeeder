import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean
  hover?: boolean
}

export function Card({ className, glass = true, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6',
        glass && 'bg-white/5 border border-white/10 backdrop-blur-sm',
        hover && 'hover:bg-white/8 hover:border-white/15 transition-all duration-200 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold text-white', className)} {...props}>
      {children}
    </h3>
  )
}
