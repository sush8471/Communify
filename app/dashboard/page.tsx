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

  // Random match scores for demo (would come from Cognee similarity in prod)
  function getScore(id: string) {
    const hash = id.charCodeAt(0) + id.charCodeAt(id.length - 1)
    return 60 + (hash % 38)
  }

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col">
      <TopBar />

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 gap-6 py-6">
        {/* Left sidebar */}
        <LeftSidebar />

        {/* Center feed */}
        <main className="flex-1 min-w-0">
          {/* AI Insight card */}
          <div className="glass gradient-border rounded-2xl p-4 mb-5 border border-violet-500/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0">
                ⚡
              </div>
              <div>
                <p className="text-sm font-semibold text-violet-300 mb-0.5">AI Daily Insight</p>
                <p className="text-sm text-slate-400">
                  There are <span className="text-white font-medium">{posts.filter(p => p.type === 'event').length} upcoming events</span> matching
                  common community interests this week. The{' '}
                  <span className="text-white font-medium">AI/ML Hackathon</span> is trending — check it out!
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Feed */}
          <div className="space-y-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)
              : posts.length === 0
                ? (
                  <div className="text-center py-16">
                    <p className="text-4xl mb-3">🌟</p>
                    <p className="text-slate-400 font-medium mb-2">No posts yet</p>
                    <p className="text-slate-600 text-sm mb-4">Be the first to share something with the community</p>
                    <Link
                      href="/organizer/create-event"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-600/30 transition-colors"
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

        {/* Right sidebar */}
        <aside className="hidden xl:flex flex-col w-72 shrink-0 space-y-4">
          {/* AI Matches */}
          <div className="glass rounded-2xl p-4 border border-white/[0.06]">
            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              🤝 <span>AI Collaborator Matches</span>
            </p>
            <div className="space-y-3">
              {[
                { name: 'Sarah Chen', skills: 'Python · ML · FastAPI', score: 94 },
                { name: 'Arjun Mehta', skills: 'React · TypeScript · UI', score: 88 },
                { name: 'Priya K.', skills: 'Data Science · SQL', score: 82 },
              ].map((person) => (
                <div key={person.name} className="flex items-center gap-3 glass-hover rounded-xl p-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {person.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{person.name}</p>
                    <p className="text-xs text-slate-500 truncate">{person.skills}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">{person.score}%</span>
                </div>
              ))}
            </div>
            <Link
              href="/search?q=find+collaborators"
              className="mt-3 block text-center text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Find more matches →
            </Link>
          </div>

          {/* Quick search */}
          <div className="glass rounded-2xl p-4 border border-white/[0.06]">
            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              🔍 <span>Quick Searches</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {['ML Events', 'React Dev', 'Hackathon', 'Python', 'Open Source', 'Backend'].map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="text-xs px-2.5 py-1 rounded-full glass border border-white/[0.08] text-slate-400 hover:text-violet-300 hover:border-violet-500/30 transition-colors"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Seed data helper */}
          <div className="glass rounded-2xl p-4 border border-amber-500/20 bg-amber-500/5">
            <p className="text-xs font-semibold text-amber-400 mb-1">🌱 Demo Setup</p>
            <p className="text-xs text-slate-500 mb-2">No posts? First sign up, then seed demo data:</p>
            <a
              href="/api/seed"
              className="block text-center text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 transition-colors"
            >
              Run /api/seed →
            </a>
          </div>
        </aside>
      </div>

      <MobileNav />
      <AIChatWidget />
    </div>
  )
}
