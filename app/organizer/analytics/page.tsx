'use client'
import { TopBar } from '@/components/layout/TopBar'
import { LeftSidebar, MobileNav } from '@/components/layout/Sidebar'
import { AIChatWidget } from '@/components/ai/AIChatWidget'

const METRICS = [
  { label: 'Community Members', value: '1,428', change: '+18.4%', icon: '👥', note: 'across 4 developer chapters' },
  { label: 'Event Registrations', value: '384', change: '+24.1%', icon: '🎟️', note: 'for React Summit & AI Hackathon' },
  { label: 'AI Inquiries Handled', value: '1,290', change: '+42.0%', icon: '🧠', note: 'via Cognee RAG knowledge graph' },
  { label: 'Content Health Score', value: '98.6%', change: '+3.2%', icon: '🛡️', note: '0 reported violations' },
]

const TOP_SEARCH_QUERIES = [
  { query: 'React Summit 2025 dates & workshops', volume: 248, category: 'Events', trend: 'Trending' },
  { query: 'Gemini Hackathon teammates & rules', volume: 194, category: 'Teammates', trend: 'High' },
  { query: 'Python Data Science Bootcamp syllabus', volume: 162, category: 'Events', trend: 'Steady' },
  { query: 'Next.js 14 App Router guides', volume: 120, category: 'Resources', trend: 'Steady' },
  { query: 'Open source first contribution help', volume: 98, category: 'Resources', trend: 'New' },
]

const ENGAGEMENT_BREAKDOWN = [
  { type: 'Developer Events', count: 12, percent: 55, color: 'from-violet-500 to-indigo-500' },
  { type: 'Learning Resources', count: 6, percent: 30, color: 'from-blue-500 to-cyan-500' },
  { type: 'Announcements', count: 2, percent: 15, color: 'from-amber-500 to-orange-500' },
]

export default function OrganizerAnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopBar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        <LeftSidebar />

        <main className="flex-1 min-w-0 max-w-4xl space-y-6">
          {/* Header */}
          <div className="glass rounded-2xl p-6 border border-white/[0.08] relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📊</span>
              <div>
                <h1 className="text-xl font-bold text-white">Organizer Intelligence & Analytics</h1>
                <p className="text-sm text-slate-400">
                  Real-time visibility into community engagement, member intent, and trending queries.
                </p>
              </div>
            </div>

            {/* AI Summary of Community Demand */}
            <div className="mt-4 p-4 rounded-xl bg-violet-950/40 border border-violet-500/20 text-xs text-violet-200 flex items-start gap-3">
              <span className="text-base">✨</span>
              <div>
                <span className="font-semibold text-violet-300">AI Community Intelligence Brief: </span>
                Highest member interest this week centers around **Google Gemini AI Hackathons** and **React 19 deep-dives**. Teammate matchmaking activity peaked on Friday, with 68% of search queries seeking complementary skills in Python and Full-Stack development.
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {METRICS.map((m) => (
              <div key={m.label} className="glass rounded-2xl p-5 border border-white/[0.06]">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider">{m.label}</span>
                  <span className="text-lg">{m.icon}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{m.value}</span>
                  <span className="text-xs font-semibold text-emerald-400">{m.change}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{m.note}</p>
              </div>
            ))}
          </div>

          {/* Two-column layout: Frequently Requested Info vs Content Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Frequently Requested Information (2 cols) */}
            <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">Frequently Requested Information</h2>
                  <p className="text-xs text-slate-500">Top user queries analyzed from Cognee semantic search</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400">
                  Last 30 Days
                </span>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {TOP_SEARCH_QUERIES.map((item, idx) => (
                  <div key={item.query} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 text-xs text-slate-600 font-mono">#{idx + 1}</span>
                      <div className="truncate">
                        <p className="text-sm font-medium text-slate-200 truncate">{item.query}</p>
                        <span className="text-[11px] text-slate-500">{item.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-400 font-mono">{item.volume} asks</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300">
                        {item.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement & Content Breakdown (1 col) */}
            <div className="glass rounded-2xl p-6 border border-white/[0.06] space-y-5">
              <div>
                <h2 className="text-base font-semibold text-white">Content Distribution</h2>
                <p className="text-xs text-slate-500">Breakdown of published community items</p>
              </div>

              <div className="space-y-4">
                {ENGAGEMENT_BREAKDOWN.map((b) => (
                  <div key={b.type} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">{b.type}</span>
                      <span className="text-slate-500">{b.count} ({b.percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${b.color}`}
                        style={{ width: `${b.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-white block">Moderation Summary</span>
                <p>0 pending reports. 100% of posts comply with community standards.</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AIChatWidget />
      <MobileNav />
    </div>
  )
}
