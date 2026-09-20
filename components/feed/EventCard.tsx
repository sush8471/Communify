'use client'
import { useState } from 'react'
import { cn, formatDate, getTypeColor, getTypeIcon } from '@/lib/utils'
import { MatchBadge } from '@/components/ai/MatchBadge'
import { ReportModal } from '@/components/feed/ReportModal'
import type { Post } from '@/lib/supabase'

interface EventCardProps {
  post: Post
  matchScore?: number
  className?: string
  onRegister?: (id: string) => void
}

export function EventCard({ post, matchScore, className, onRegister }: EventCardProps) {
  const [showReport, setShowReport] = useState(false)

  return (
    <div
      className={cn(
        'group bg-[#0a0a0a] hover:bg-[#111111] rounded-lg overflow-hidden border border-[#1f1f1f] hover:border-[#2e2e2e]',
        'shadow-[0_2px_4px_0_rgba(0,0,0,0.5)] hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.5)]',
        'transition-all duration-200 relative',
        className
      )}
    >
      {/* Top indicator bar */}
      <div
        className={cn(
          'h-[2px] w-full',
          post.type === 'event'
            ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa]'
            : post.type === 'resource'
              ? 'bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]'
              : 'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]'
        )}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-0.5 rounded-full border',
                getTypeColor(post.type)
              )}
            >
              <span>{getTypeIcon(post.type)}</span>
              <span className="capitalize">{post.type}</span>
            </span>
            {matchScore !== undefined && <MatchBadge score={matchScore} />}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {post.start_time && (
              <span className="text-xs text-[#6b6b6b] font-mono whitespace-nowrap">
                {formatDate(post.start_time)}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowReport(true)
              }}
              title="Report content"
              className="text-[#6b6b6b] hover:text-[#ef4444] p-1 rounded hover:bg-[#161616] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white mb-2 leading-snug group-hover:text-[#c4b5fd] transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* AI Summary / Description with AI pill accent indicator if summary exists */}
        {post.ai_summary ? (
          <div className="mb-3 space-y-1.5">
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#a78bfa] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-full border border-[#8b5cf6]/20">
              ✨ AI Summary
            </span>
            <p className="text-sm text-[#a1a1a1] leading-relaxed line-clamp-3">
              {post.ai_summary}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[#a1a1a1] leading-relaxed mb-3 line-clamp-3">
            {post.description}
          </p>
        )}

        {/* Tags with Section 8.4 badges styling */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {post.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#111111] border border-[#1f1f1f] text-[#a1a1a1]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Location / Metadata */}
        {post.location && (
          <div className="flex items-center gap-1.5 text-xs text-[#6b6b6b] mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{post.location}</span>
          </div>
        )}

        {/* Primary Action Button (Section 8.1) */}
        {post.type === 'event' && onRegister && (
          <button
            type="button"
            onClick={() => onRegister(post.id)}
            className="w-full py-2.5 rounded-md text-sm font-medium bg-[#8b5cf6] hover:bg-[#a78bfa] text-white shadow-[0_0_8px_rgba(139,92,246,0.3)] hover:shadow-[0_0_16px_rgba(139,92,246,0.4)] transition-all duration-200 active:scale-[0.98]"
          >
            Register for Event →
          </button>
        )}
      </div>

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        postId={post.id}
        postTitle={post.title}
      />
    </div>
  )
}

/** Skeleton loader for EventCard matching OLED surfaces */
export function EventCardSkeleton() {
  return (
    <div className="bg-[#0a0a0a] rounded-lg overflow-hidden border border-[#1f1f1f]">
      <div className="h-[2px] w-full bg-[#1f1f1f] shimmer" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full bg-[#161616] shimmer" />
          <div className="h-5 w-24 rounded-full bg-[#161616] shimmer" />
        </div>
        <div className="h-5 w-3/4 rounded bg-[#161616] shimmer" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded bg-[#111111] shimmer" />
          <div className="h-3.5 w-5/6 rounded bg-[#111111] shimmer" />
        </div>
        <div className="flex gap-1.5 pt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-14 rounded-full bg-[#111111] shimmer" />
          ))}
        </div>
      </div>
    </div>
  )
}
