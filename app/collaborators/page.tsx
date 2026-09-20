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
  'Frontend craftsman with Next.js & Tailwind',
  'Backend developer for high-scale PostgreSQL & APIs',
  'UI/UX Product Designer for hackathon prototyping',
]

export default function CollaboratorsPage() {
  const [requirement, setRequirement] = useState('')
  const [loading, setLoading] = useState(false)
  const [profiles, setProfiles] = useState<MatchedCandidate[]>([])
  const [connectedIds, setConnectedIds] = useState<Record<string, boolean>>({})
  const [hasSearched, setHasSearched] = useState(false)

  // Load candidates initially
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      <TopBar />

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        <LeftSidebar />

        <main className="flex-1 min-w-0 max-w-3xl py-6 px-4 sm:px-6 space-y-6">
          {/* Header Banner */}
          <div className="bg-[#0a0a0a] rounded-xl p-6 border border-[#1f1f1f] relative overflow-hidden shadow-[0_2px_4px_0_rgba(0,0,0,0.5)]">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#8b5cf6]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🤝</span>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Intelligent Teammate Matching</h1>
                <p className="text-xs sm:text-sm text-[#a1a1a1]">
                  Discover collaborators and form high-velocity hackathon squads with AI skill matching.
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
                  placeholder="Describe your ideal teammate (e.g. 'Need a Python RAG dev for Gemini hackathon')..."
                  className={cn(
                    'w-full bg-[#111111] border border-[#1f1f1f] rounded-lg',
                    'px-4 py-3 text-sm text-white placeholder-[#4a4a4a]',
                    'focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_8px_rgba(139,92,246,0.3)]',
                    'transition-all duration-200'
                  )}
                />
                <button
                  type="submit"
                  disabled={loading || !requirement.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-md bg-[#8b5cf6] hover:bg-[#a78bfa] text-white text-xs font-semibold disabled:opacity-50 shadow-[0_0_8px_rgba(139,92,246,0.3)] transition-all flex items-center gap-1.5"
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

              {/* Preset suggestion chips with Section 8.4 badges */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-xs font-mono text-[#6b6b6b]">Try presets:</span>
                {PRESET_QUERIES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setRequirement(preset)
                      handleMatch(preset)
                    }}
                    className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#111111] border border-[#1f1f1f] text-[#a1a1a1] hover:text-[#c4b5fd] hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/10 transition-colors"
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
              <span className="text-xs font-mono text-[#6b6b6b]">
                {profiles.length} developer{profiles.length !== 1 ? 's' : ''} available
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f] space-y-3">
                    <div className="h-5 w-40 bg-[#161616] rounded shimmer" />
                    <div className="h-4 w-full bg-[#111111] rounded shimmer" />
                    <div className="h-4 w-3/4 bg-[#111111] rounded shimmer" />
                  </div>
                ))}
              </div>
            ) : profiles.length === 0 ? (
              <div className="bg-[#0a0a0a] rounded-lg p-8 text-center text-[#6b6b6b] border border-[#1f1f1f]">
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
                        'bg-[#0a0a0a] rounded-lg p-5 border transition-all duration-200',
                        p.matchScore && p.matchScore >= 80
                          ? 'border-[#8b5cf6]/40 bg-[#8b5cf6]/[0.03] shadow-[0_0_12px_rgba(139,92,246,0.1)]'
                          : 'border-[#1f1f1f] hover:border-[#2e2e2e]'
                      )}
                    >
                      {/* Top row: Avatar + Name + Match Badge */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center font-bold text-white text-base shadow-[0_0_8px_rgba(139,92,246,0.3)] shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-white text-base">{p.name}</h3>
                              <span className="text-xs font-mono text-[#6b6b6b]">@{p.username}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#a1a1a1] mt-0.5">
                              {p.location && <span>📍 {p.location}</span>}
                              <span className="capitalize px-2 py-0.5 rounded-full bg-[#111111] border border-[#1f1f1f] font-mono text-[10px]">
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
                                'font-mono text-xs font-bold px-2.5 py-1 rounded-full border',
                                p.matchScore >= 85
                                  ? 'bg-[#10b981]/15 border-[#10b981]/40 text-[#10b981]'
                                  : p.matchScore >= 70
                                    ? 'bg-[#8b5cf6]/15 border-[#8b5cf6]/40 text-[#c4b5fd]'
                                    : 'bg-[#f59e0b]/15 border-[#f59e0b]/40 text-[#fcd34d]'
                              )}
                            >
                              ⚡ {p.matchScore}% Match
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-[#a1a1a1] mt-3 leading-relaxed">
                        {p.bio}
                      </p>

                      {/* AI Match Reason (if searched) */}
                      {p.matchReason && (
                        <div className="mt-3 p-3 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-xs text-[#c4b5fd] flex items-start gap-2">
                          <span className="text-sm">✨</span>
                          <div>
                            <strong className="text-white font-medium">Why they match: </strong>
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
                                  'font-mono text-xs px-2.5 py-1 rounded-md border font-medium transition-colors',
                                  isHighlighted
                                    ? 'bg-[#8b5cf6]/20 border-[#8b5cf6]/50 text-[#c4b5fd]'
                                    : 'bg-[#111111] border-[#1f1f1f] text-[#a1a1a1]'
                                )}
                              >
                                {skill}
                              </span>
                            )
                          })}
                        </div>
                      )}

                      {/* Action footer */}
                      <div className="mt-4 pt-3 border-t border-[#1f1f1f] flex items-center justify-between">
                        <div className="text-xs text-[#6b6b6b]">
                          {p.interests?.length ? (
                            <span>Interests: {p.interests.slice(0, 3).join(', ')}</span>
                          ) : (
                            <span>Open for hackathon teams</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleConnect(p.id)}
                          disabled={isConnected}
                          className={cn(
                            'text-xs font-semibold px-4 py-2 rounded-md border transition-all duration-200 active:scale-95',
                            isConnected
                              ? 'bg-[#10b981]/15 border-[#10b981]/40 text-[#10b981]'
                              : 'bg-[#111111] border-[#2e2e2e] text-white hover:bg-[#8b5cf6] hover:border-[#8b5cf6]'
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
      </div>

      <AIChatWidget />
      <MobileNav />
    </div>
  )
}
