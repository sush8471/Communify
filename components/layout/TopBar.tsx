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
    <header className="sticky top-0 z-30 h-16 bg-black/80 backdrop-blur-md border-b border-[#1f1f1f] px-4 sm:px-6">
      <div className="max-w-[1400px] h-full mx-auto flex items-center justify-between gap-4">
        {/* Logo (shown prominently on left) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center text-sm font-bold text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]">
              ⚡
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-[#c4b5fd] bg-clip-text text-transparent">
              Communify
            </span>
          </Link>
        </div>

        {/* Command-K Search input (Section 8.3 & 14.4) */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, teammates, resources... (Press ⏎)"
              className={cn(
                'w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-md',
                'pl-10 pr-16 py-2 text-sm text-white placeholder-[#4a4a4a]',
                'focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_8px_rgba(139,92,246,0.3)]',
                'transition-all duration-200'
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="text-[11px] text-[#6b6b6b] bg-[#111111] px-1.5 py-0.5 rounded-[2px] border border-[#2e2e2e] font-mono">
                ⌘K
              </kbd>
            </div>
          </div>
        </form>

        {/* Header Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/organizer/create-event"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-[#8b5cf6] hover:bg-[#a78bfa] text-white shadow-[0_0_8px_rgba(139,92,246,0.3)] hover:shadow-[0_0_16px_rgba(139,92,246,0.5)] transition-all duration-200 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Post</span>
          </Link>

          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-[#111111] border border-[#2e2e2e] hover:border-[#8b5cf6] flex items-center justify-center text-xs font-semibold text-white transition-colors"
          >
            U
          </Link>
        </div>
      </div>
    </header>
  )
}
