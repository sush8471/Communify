// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelative(date: string | Date) {
  const d = new Date(date)
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 7) return `In ${diffDays} days`
  return formatDate(date)
}

export function getMatchColor(score: number) {
  if (score >= 90) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
  if (score >= 75) return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
  if (score >= 60) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
  return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
}

export function getTypeIcon(type: string) {
  switch (type) {
    case 'event': return '🎯'
    case 'resource': return '📚'
    case 'announcement': return '📢'
    default: return '📌'
  }
}

export function getTypeColor(type: string) {
  switch (type) {
    case 'event': return 'bg-violet-500/20 text-violet-300 border-violet-500/30'
    case 'resource': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    case 'announcement': return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
  }
}
