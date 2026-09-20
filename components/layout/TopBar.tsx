'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function TopBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/[0.06] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Mobile logo */}
        <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs">
            ⚡
          </div>
          <span className="font-bold text-sm gradient-text">Communify</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, people, resources... (AI-powered)"
              className={cn(
                'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl',
                'pl-9 pr-16 py-2 text-sm text-white placeholder-slate-500',
                'focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06]',
                'transition-all duration-200'
              )}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
              ⏎
            </kbd>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/organizer/create-event"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Post
          </Link>

          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-600 flex items-center justify-center text-xs font-bold text-white"
          >
            U
          </Link>
        </div>
      </div>
    </header>
  )
}
