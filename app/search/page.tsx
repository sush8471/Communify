'use client'
import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { TopBar } from '@/components/layout/TopBar'
import { LeftSidebar, MobileNav } from '@/components/layout/Sidebar'
import { AIChatWidget } from '@/components/ai/AIChatWidget'
import { cn } from '@/lib/utils'

interface SearchResult {
  text?: string
  score?: number
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [inputVal, setInputVal] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [aiAnswer, setAiAnswer] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery)
    inputRef.current?.focus()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function doSearch(q: string) {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    setAiAnswer('')
    setResults([])

    router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false })

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = await res.json()
      setAiAnswer(data.aiAnswer || '')
      setResults(data.results || [])
    } catch {
      setAiAnswer('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setQuery(inputVal)
    doSearch(inputVal)
  }

  const SUGGESTIONS = [
    'Find ML hackathons for beginners',
    'React developer networking events',
    'Python resources for data science',
    'Backend developers for fintech project',
    'Open source contribution guides',
    'Blockchain workshops online',
  ]

  return (
    <div className="flex-1 min-w-0 max-w-3xl">
      {/* Search bar */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask anything — find events, people, resources..."
            className={cn(
              'w-full bg-white/[0.04] border border-white/10 rounded-2xl',
              'pl-12 pr-28 py-4 text-base text-white placeholder-slate-500',
              'focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06]',
              'transition-all duration-200'
            )}
          />
          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 disabled:opacity-50 transition-colors"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Not searched yet — suggestions */}
      {!searched && (
        <div className="fade-in">
          <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold mb-3">Try asking...</p>
          <div className="space-y-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setInputVal(s); setQuery(s); doSearch(s) }}
                className="w-full text-left glass glass-hover px-4 py-3 rounded-xl border border-white/[0.06] text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-3"
              >
                <span className="text-violet-500">⚡</span>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="fade-in">
          <div className="glass rounded-2xl p-6 border border-violet-500/20 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 rounded-full bg-violet-500/20 animate-pulse" />
              <div className="h-4 w-48 rounded bg-white/[0.06] shimmer" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-3.5 rounded bg-white/[0.04] shimmer" style={{ width: `${90 - i * 10}%` }} />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-xl p-4 border border-white/[0.06]">
                <div className="h-4 w-2/3 rounded bg-white/[0.06] shimmer mb-2" />
                <div className="h-3 w-full rounded bg-white/[0.04] shimmer" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {searched && !loading && (
        <div className="space-y-4 fade-in">
          {/* AI Answer */}
          {aiAnswer && (
            <div className="glass rounded-2xl p-5 border border-violet-500/20 bg-violet-500/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs">⚡</span>
                <span className="text-sm font-semibold text-violet-300">AI Answer</span>
                <span className="text-xs text-slate-600 ml-auto">Powered by Cognee + Gemini</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{aiAnswer}</p>
            </div>
          )}

          {/* Raw results */}
          {results.length > 0 && (
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold mb-3">
                {results.length} relevant results
              </p>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <div key={i} className="glass glass-hover rounded-xl p-4 border border-white/[0.06]">
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {r.text || String(r)}
                    </p>
                    {r.score !== undefined && (
                      <p className="text-xs text-violet-400 mt-2 font-medium">
                        {Math.round(r.score * 100)}% relevant
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {results.length === 0 && !aiAnswer && (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-slate-400 font-medium">No results found for &quot;{query}&quot;</p>
              <p className="text-slate-600 text-sm mt-1">Try seeding some data first at /api/seed</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col">
      <TopBar />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 gap-6 py-6">
        <LeftSidebar />
        <Suspense fallback={<div className="flex-1 text-center pt-20 text-slate-500">Loading...</div>}>
          <SearchContent />
        </Suspense>
      </div>
      <MobileNav />
      <AIChatWidget />
    </div>
  )
}
