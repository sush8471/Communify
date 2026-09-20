'use client'
import { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { LeftSidebar, MobileNav } from '@/components/layout/Sidebar'
import { AIChatWidget } from '@/components/ai/AIChatWidget'
import { supabase, DEMO_USER_ID, type Profile } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface MatchedCandidate extends Profile {
  matchScore?: number
  matchReason?: string
  highlightedSkills?: string[]
}

const PRESET_QUERIES = [
  'AI / ML Engineer with RAG & Gemini experience',
  'Frontend craftsman with Next.js 14 & Tailwind',
  'Backend developer for high-scale PostgreSQL & APIs',
  'UI/UX Product Designer for hackathon prototyping',
]

export default function CollaboratorsPage() {
  const [requirement, setRequirement] = useState('')
  const [loading, setLoading] = useState(false)
  const [profiles, setProfiles] = useState<MatchedCandidate[]>([])
  const [connectedIds, setConnectedIds] = useState<Record<string, boolean>>({})
  const [hasSearched, setHasSearched] = useState(false)

  // Load all candidates initially
  useEffect(() => {
    async function loadCandidates() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', DEMO_USER_ID)
      if (data) {
        setProfiles(data)
      }
    }
    loadCandidates()
  }, [])

  async function handleMatch(queryToUse?: string) {
    const q = queryToUse || requirement
    if (!q.trim()) return

    setLoading(true)
    setHasSearched(true)
    try {
      const res = await fetch('/api/collaborators/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement: q }),
      })
      const data = await res.json()
      if (data.matches) {
        setProfiles(data.matches)
      }
    } catch (err) {
      console.error('Match error:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleConnect(id: string) {
    setConnectedIds((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopBar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        <LeftSidebar />

        <main className="flex-1 min-w-0 max-w-3xl space-y-6">
          {/* Header Banner */}
          <div className="glass rounded-2xl p-6 border border-white/[0.08] relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🤝</span>
              <div>
                <h1 className="text-xl font-bold text-white">Intelligent Teammate Matching</h1>
                <p className="text-sm text-slate-400">
                  Find collaborators and build your dream team with AI-driven skill matching.
                </p>
              </div>
            </div>

            {/* AI Match Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleMatch()
              }}
              className="mt-5 space-y-3"
            >
              <div className="relative">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Describe your project or required skills (e.g. 'Need a Python RAG dev for Gemini hackathon')..."
                  className={cn(
                    'w-full bg-white/[0.04] border border-white/10 rounded-xl',
                    'px-4 py-3.5 text-sm text-white placeholder-slate-500',
                    'focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06]',
                    'transition-all duration-200'
                  )}
                />
                <button
                  type="submit"
                  disabled={loading || !requirement.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {loading ? (
                    <span>Matching...</span>
                  ) : (
                    <>
                      <span>Match Teammates</span>
                      <span>✨</span>
                    </>
                  )}
                </button>
              </div>

              {/* Preset suggestion chips */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-xs text-slate-500 font-medium">Try presets:</span>
                {PRESET_QUERIES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setRequirement(preset)
                      handleMatch(preset)
                    }}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-violet-300 hover:border-violet-500/30 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Results section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">
                {hasSearched ? 'AI-Ranked Matches' : 'Available Community Members'}
              </h2>
              <span className="text-xs text-slate-500">
                {profiles.length} developer{profiles.length !== 1 ? 's' : ''} available
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass rounded-2xl p-5 border border-white/[0.06] animate-pulse space-y-3">
                    <div className="h-5 w-40 bg-white/[0.06] rounded" />
                    <div className="h-4 w-full bg-white/[0.04] rounded" />
                    <div className="h-4 w-3/4 bg-white/[0.04] rounded" />
                  </div>
                ))}
              </div>
            ) : profiles.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center text-slate-500 border border-white/[0.06]">
                No profiles found matching this criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {profiles.map((p) => {
                  const isConnected = connectedIds[p.id]
                  const initials = p.name
                    ? p.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    : 'U'

                  return (
                    <div
                      key={p.id}
                      className={cn(
                        'glass rounded-2xl p-5 border transition-all duration-200',
                        p.matchScore && p.matchScore >= 80
                          ? 'border-violet-500/30 bg-violet-500/[0.03]'
                          : 'border-white/[0.06] hover:border-white/10'
                      )}
                    >
                      {/* Top row: Avatar + Name + Match Badge */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center font-bold text-white text-base shadow-md">
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-white text-base">{p.name}</h3>
                              <span className="text-xs text-slate-500">@{p.username}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              {p.location && <span>📍 {p.location}</span>}
                              <span className="capitalize px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px]">
                                {p.role}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        {p.matchScore !== undefined && (
                          <div className="flex flex-col items-end">
                            <span
                              className={cn(
                                'text-xs font-bold px-2.5 py-1 rounded-full border',
                                p.matchScore >= 85
                                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                  : p.matchScore >= 70
                                    ? 'bg-violet-500/10 border-violet-500/40 text-violet-400'
                                    : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                              )}
                            >
                              ⚡ {p.matchScore}% Match
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                        {p.bio}
                      </p>

                      {/* AI Match Reason (if searched) */}
                      {p.matchReason && (
                        <div className="mt-3 p-3 rounded-xl bg-violet-950/40 border border-violet-500/20 text-xs text-violet-200 flex items-start gap-2">
                          <span className="text-sm">✨</span>
                          <div>
                            <strong className="text-violet-300 font-medium">Why they match: </strong>
                            {p.matchReason}
                          </div>
                        </div>
                      )}

                      {/* Skills Tags */}
                      {p.skills && p.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3.5">
                          {p.skills.map((skill) => {
                            const isHighlighted = p.highlightedSkills?.some(
                              (h) => h.toLowerCase() === skill.toLowerCase()
                            )
                            return (
                              <span
                                key={skill}
                                className={cn(
                                  'text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors',
                                  isHighlighted
                                    ? 'bg-violet-600/30 border-violet-500/50 text-violet-200'
                                    : 'bg-white/[0.03] border-white/[0.06] text-slate-400'
                                )}
                              >
                                {skill}
                              </span>
                            )
                          })}
                        </div>
                      )}

                      {/* Action footer */}
                      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          {p.interests?.length ? (
                            <span>Interested in: {p.interests.slice(0, 3).join(', ')}</span>
                          ) : (
                            <span>Open for hackathon teams</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleConnect(p.id)}
                          disabled={isConnected}
                          className={cn(
                            'text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-200 active:scale-95',
                            isConnected
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-white/[0.05] border-white/10 text-white hover:bg-violet-600 hover:border-violet-500'
                          )}
                        >
                          {isConnected ? '✓ Invitation Sent' : 'Connect / Invite →'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>

        <AIChatWidget />
        <MobileNav />
      </div>
    </div>
  )
}
