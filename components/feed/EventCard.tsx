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
        'group glass glass-hover rounded-2xl overflow-hidden border border-white/[0.06]',
        'transition-all duration-300 relative',
        className
      )}
    >
      {/* Top color bar */}
      <div
        className={cn(
          'h-1 w-full',
          post.type === 'event'
            ? 'bg-gradient-to-r from-violet-500 to-cyan-500'
            : post.type === 'resource'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
              : 'bg-gradient-to-r from-amber-500 to-orange-500'
        )}
      />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border',
                getTypeColor(post.type)
              )}
            >
              {getTypeIcon(post.type)} {post.type}
            </span>
            {matchScore !== undefined && <MatchBadge score={matchScore} />}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {post.start_time && (
              <span className="text-xs text-slate-500 whitespace-nowrap">
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
              className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-white/[0.05] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white mb-2 leading-snug group-hover:text-violet-300 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* AI Summary */}
        <p className="text-sm text-slate-400 leading-relaxed mb-3 line-clamp-3">
          {post.ai_summary || post.description}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Location */}
        {post.location && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {post.location}
          </div>
        )}

        {/* Actions */}
        {post.type === 'event' && onRegister && (
          <button
            type="button"
            onClick={() => onRegister(post.id)}
            className="w-full py-2 rounded-xl text-sm font-medium bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/40 hover:border-violet-500/60 transition-all duration-200 active:scale-95"
          >
            Register →
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

/** Skeleton loader for EventCard */
export function EventCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/[0.06]">
      <div className="h-1 w-full bg-white/[0.04] shimmer" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-white/[0.06] shimmer" />
          <div className="h-5 w-20 rounded-full bg-white/[0.06] shimmer" />
        </div>
        <div className="h-5 w-3/4 rounded bg-white/[0.06] shimmer" />
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded bg-white/[0.04] shimmer" />
          <div className="h-3.5 w-5/6 rounded bg-white/[0.04] shimmer" />
          <div className="h-3.5 w-4/6 rounded bg-white/[0.04] shimmer" />
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-14 rounded-full bg-white/[0.04] shimmer" />
          ))}
        </div>
      </div>
    </div>
  )
}
