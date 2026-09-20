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
      setAiAnswer('Search failed. Please check network connection and try again.')
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
    <div className="flex-1 min-w-0 max-w-3xl py-6 px-4 sm:px-6">
      {/* Command Search Bar (Section 14.4) */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative shadow-[0_12px_24px_0_rgba(0,0,0,0.6)]">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search knowledge graph, events, teammates... (Ask anything)"
            className={cn(
              'w-full h-14 bg-[#0a0a0a] border border-[#2e2e2e] rounded-xl',
              'pl-12 pr-28 text-sm sm:text-base text-white placeholder-[#4a4a4a]',
              'focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_16px_rgba(139,92,246,0.35)]',
              'transition-all duration-200'
            )}
          />
          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-md bg-[#8b5cf6] text-white text-xs font-medium hover:bg-[#a78bfa] disabled:opacity-40 shadow-[0_0_8px_rgba(139,92,246,0.3)] transition-all"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      {/* Suggested Queries */}
      {!searched && (
        <div className="space-y-3 fade-in">
          <p className="text-xs font-mono uppercase tracking-wider text-[#6b6b6b] font-semibold">
            Suggested Inquiries
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setInputVal(s); setQuery(s); doSearch(s) }}
                className="text-left bg-[#0a0a0a] hover:bg-[#111111] p-3.5 rounded-lg border border-[#1f1f1f] hover:border-[#2e2e2e] text-xs sm:text-sm text-[#a1a1a1] hover:text-white transition-all flex items-center gap-3 group"
              >
                <span className="text-[#8b5cf6] group-hover:scale-110 transition-transform">⚡</span>
                <span className="truncate">{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-4 fade-in">
          <div className="bg-[#0a0a0a] rounded-xl p-5 border border-[#8b5cf6]/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full bg-[#8b5cf6]/30 animate-pulse" />
              <div className="h-4 w-40 rounded bg-[#161616] shimmer" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded bg-[#111111] shimmer" />
              <div className="h-3.5 w-5/6 rounded bg-[#111111] shimmer" />
            </div>
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#0a0a0a] rounded-lg p-4 border border-[#1f1f1f]">
              <div className="h-4 w-1/2 rounded bg-[#161616] shimmer mb-2" />
              <div className="h-3 w-full rounded bg-[#111111] shimmer" />
            </div>
          ))}
        </div>
      )}

      {/* Search Results */}
      {searched && !loading && (
        <div className="space-y-4 fade-in">
          {/* AI Synthesized Answer Card */}
          {aiAnswer && (
            <div className="rounded-xl p-5 border border-[#8b5cf6]/30 bg-gradient-to-br from-[#8b5cf6]/15 via-[#8b5cf6]/5 to-transparent shadow-[0_0_16px_rgba(139,92,246,0.15)]">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-6 h-6 rounded-md bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center text-xs text-white">⚡</span>
                <span className="text-sm font-semibold text-white">Cognee Semantic Answer</span>
                <span className="text-[11px] font-mono text-[#6b6b6b] ml-auto">Graph-RAG</span>
              </div>
              <p className="text-sm text-[#a1a1a1] leading-relaxed">{aiAnswer}</p>
            </div>
          )}

          {/* Granular Graph Match Results */}
          {results.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-mono uppercase tracking-wider text-[#6b6b6b] font-semibold">
                {results.length} Graph Entities Matched
              </p>
              <div className="space-y-2.5">
                {results.map((r, i) => (
                  <div key={i} className="bg-[#0a0a0a] hover:bg-[#111111] rounded-lg p-4 border border-[#1f1f1f] hover:border-[#2e2e2e] transition-all">
                    <p className="text-sm text-[#a1a1a1] leading-relaxed line-clamp-3">
                      {r.text || String(r)}
                    </p>
                    {r.score !== undefined && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="font-mono text-xs text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/20 font-medium">
                          {Math.round(r.score * 100)}% relevant
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results state */}
          {results.length === 0 && !aiAnswer && (
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg text-center py-16 px-4">
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-white font-medium">No results found for &quot;{query}&quot;</p>
              <p className="text-[#6b6b6b] text-xs mt-1">Try refining your terms or seeding sample community data.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <TopBar />
      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        <LeftSidebar />
        <Suspense fallback={<div className="flex-1 text-center pt-20 text-[#6b6b6b] font-mono text-xs">Loading Knowledge Graph...</div>}>
          <SearchContent />
        </Suspense>
      </div>
      <MobileNav />
      <AIChatWidget />
    </div>
  )
}
