'use client'
import { useEffect, useState } from 'react'
import { supabase, type Post } from '@/lib/supabase'
import { EventCard, EventCardSkeleton } from '@/components/feed/EventCard'
import { AIChatWidget } from '@/components/ai/AIChatWidget'
import { TopBar } from '@/components/layout/TopBar'
import { LeftSidebar, MobileNav } from '@/components/layout/Sidebar'
import Link from 'next/link'

const TABS = ['All', 'Events', 'Resources', 'Announcements']

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20)

      if (activeTab !== 'All') {
        query = query.eq('type', activeTab.toLowerCase().replace('s', '').replace('ements', 'ement'))
      }

      const { data } = await query
      setPosts(data || [])
      setLoading(false)
    }
    load()
  }, [activeTab])

  // Deterministic match scores based on hash for demo
  function getScore(id: string) {
    const hash = id.charCodeAt(0) + id.charCodeAt(id.length - 1)
    return 60 + (hash % 38)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <TopBar />

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        {/* Left Sidebar (275px, Section 3.2 & 9.2) */}
        <LeftSidebar />

        {/* Center Feed Column (Flexible up to 600px, Section 9.2) */}
        <main className="flex-1 min-w-0 max-w-[640px] mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* AI Daily Insight Card (Section 14.5) */}
          <div className="relative overflow-hidden rounded-xl border border-[#8b5cf6]/30 bg-gradient-to-br from-[#8b5cf6]/10 via-[#8b5cf6]/5 to-transparent p-5 shadow-[0_0_16px_rgba(139,92,246,0.15)]">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center text-sm font-bold text-white shadow-[0_0_10px_rgba(139,92,246,0.4)] shrink-0">
                ⚡
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#c4b5fd]">
                    AI Community Pulse
                  </p>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                </div>
                <p className="text-sm text-[#a1a1a1] leading-relaxed">
                  There are <span className="text-white font-medium">{posts.filter(p => p.type === 'event').length} upcoming community events</span> matching
                  common developer interests. The{' '}
                  <span className="text-[#c4b5fd] font-medium">AI/ML Hackathon</span> is actively forming teams!
                </p>
              </div>
            </div>
          </div>

          {/* Feed Filter Tabs (Section 8.1 & 8.2) */}
          <div className="flex gap-1.5 bg-[#0a0a0a] p-1 rounded-lg border border-[#1f1f1f]">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-[#161616] text-white border border-[#2e2e2e] shadow-sm font-semibold'
                    : 'text-[#6b6b6b] hover:text-[#a1a1a1]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Posts Feed (Section 14.2) */}
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <EventCardSkeleton key={i} />)
              : posts.length === 0
                ? (
                  <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg text-center py-16 px-4">
                    <p className="text-4xl mb-3">🌟</p>
                    <p className="text-white font-semibold mb-1">No community posts yet</p>
                    <p className="text-[#6b6b6b] text-xs max-w-sm mx-auto mb-5">
                      Be the first to share an event, resource, or announcement with fellow developers.
                    </p>
                    <Link
                      href="/organizer/create-event"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#8b5cf6] hover:bg-[#a78bfa] text-white text-xs font-medium shadow-[0_0_8px_rgba(139,92,246,0.3)] transition-all"
                    >
                      + Create Post
                    </Link>
                  </div>
                )
                : posts.map((post) => (
                  <EventCard
                    key={post.id}
                    post={post}
                    matchScore={getScore(post.id)}
                    className="fade-in"
                  />
                ))}
          </div>
        </main>

        {/* Right Sidebar (350px, Section 3.2, 9.2 & 14.3) */}
        <aside className="hidden xl:flex flex-col w-[350px] shrink-0 space-y-6 px-4 py-6 border-l border-[#1f1f1f]">
          {/* AI Teammate Matches */}
          <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f] space-y-4 shadow-[0_2px_4px_0_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white flex items-center gap-2">
                <span>🤝</span>
                <span>AI Teammate Matches</span>
              </p>
              <span className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full border border-[#10b981]/20">
                LIVE
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Sarah Chen', role: 'Python · ML · FastAPI', score: 94 },
                { name: 'Arjun Mehta', role: 'React · TypeScript · UI', score: 88 },
                { name: 'Priya K.', role: 'Data Science · SQL', score: 82 },
              ].map((person) => (
                <div
                  key={person.name}
                  className="flex items-center gap-3 bg-[#111111] hover:bg-[#161616] border border-[#1f1f1f] hover:border-[#2e2e2e] rounded-md p-2.5 transition-all"
                >
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {person.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{person.name}</p>
                    <p className="text-xs text-[#6b6b6b] font-mono truncate">{person.role}</p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/20 shrink-0">
                    {person.score}%
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/collaborators"
              className="block text-center text-xs font-mono text-[#a78bfa] hover:text-[#c4b5fd] pt-1 transition-colors"
            >
              Explore Teammate Matching →
            </Link>
          </div>

          {/* Quick Search Chips */}
          <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f] space-y-3">
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <span>🔍</span>
              <span>Trending Topics</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['ML Events', 'React Dev', 'Hackathon', 'Python', 'Open Source', 'Next.js'].map((topic) => (
                <Link
                  key={topic}
                  href={`/search?q=${encodeURIComponent(topic)}`}
                  className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#111111] border border-[#1f1f1f] text-[#a1a1a1] hover:text-white hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/10 transition-colors"
                >
                  #{topic}
                </Link>
              ))}
            </div>
          </div>

          {/* Demo Setup Box */}
          <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#f59e0b]/30 space-y-2">
            <div className="flex items-center gap-1.5 text-[#f59e0b] text-xs font-mono font-medium">
              <span>⚡</span>
              <span>DEMO ENVIRONMENT</span>
            </div>
            <p className="text-xs text-[#6b6b6b] leading-relaxed">
              Populate realistic hackathon posts and profiles using the autonomous seed endpoint:
            </p>
            <a
              href="/api/seed"
              className="block text-center text-xs font-mono py-2 rounded-md bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#fcd34d] hover:bg-[#f59e0b]/25 transition-colors mt-2"
            >
              Execute /api/seed →
            </a>
          </div>
        </aside>
      </div>

      <MobileNav />
      <AIChatWidget />
    </div>
  )
}
