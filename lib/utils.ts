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
  if (score >= 90) return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30'
  if (score >= 75) return 'text-[#a78bfa] bg-[#8b5cf6]/15 border-[#8b5cf6]/30'
  if (score >= 60) return 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/30'
  return 'text-[#a1a1a1] bg-[#161616] border-[#1f1f1f]'
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
    case 'event': return 'bg-[#8b5cf6]/15 text-[#c4b5fd] border-[#8b5cf6]/30'
    case 'resource': return 'bg-[#3b82f6]/15 text-[#93c5fd] border-[#3b82f6]/30'
    case 'announcement': return 'bg-[#f59e0b]/15 text-[#fcd34d] border-[#f59e0b]/30'
    default: return 'bg-[#161616] text-[#a1a1a1] border-[#1f1f1f]'
  }
}
