'use client'
import { cn } from '@/lib/utils'

interface MatchBadgeProps {
  score: number
  className?: string
}

export function MatchBadge({ score, className }: MatchBadgeProps) {
  const color =
    score >= 90
      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
      : score >= 75
        ? 'text-violet-400 bg-violet-400/10 border-violet-400/30'
        : score >= 60
          ? 'text-blue-400 bg-blue-400/10 border-blue-400/30'
          : 'text-slate-400 bg-slate-400/10 border-slate-400/20'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border',
        color,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow" />
      {score}% match
    </span>
  )
}
