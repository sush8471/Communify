'use client'
import { cn } from '@/lib/utils'

interface MatchBadgeProps {
  score: number
  className?: string
}

export function MatchBadge({ score, className }: MatchBadgeProps) {
  const style =
    score >= 90
      ? 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
      : score >= 75
        ? 'text-[#c4b5fd] bg-[#8b5cf6]/15 border-[#8b5cf6]/30 shadow-[0_0_8px_rgba(139,92,246,0.3)]'
        : score >= 60
          ? 'text-[#93c5fd] bg-[#3b82f6]/10 border-[#3b82f6]/30'
          : 'text-[#a1a1a1] bg-[#161616] border-[#1f1f1f]'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-xs font-medium border transition-colors',
        style,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{score}% match</span>
    </span>
  )
}
