'use client'
import { TopBar } from '@/components/layout/TopBar'
import { LeftSidebar, MobileNav } from '@/components/layout/Sidebar'
import { AIChatWidget } from '@/components/ai/AIChatWidget'

const METRICS = [
  { label: 'Community Members', value: '1,428', change: '+18.4%', icon: '👥', note: 'across 4 chapters' },
  { label: 'Event Registrations', value: '384', change: '+24.1%', icon: '🎟️', note: 'AI Hackathon & React Summit' },
  { label: 'AI Inquiries Handled', value: '1,290', change: '+42.0%', icon: '🧠', note: 'via Cognee RAG graph' },
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
  { type: 'Developer Events', count: 12, percent: 55, color: 'from-[#8b5cf6] to-[#a78bfa]' },
  { type: 'Learning Resources', count: 6, percent: 30, color: 'from-[#3b82f6] to-[#60a5fa]' },
  { type: 'Announcements', count: 2, percent: 15, color: 'from-[#f59e0b] to-[#fbbf24]' },
]

export default function OrganizerAnalyticsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <TopBar />

      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        <LeftSidebar />

        <main className="flex-1 min-w-0 max-w-4xl py-6 px-4 sm:px-6 space-y-6">
          {/* Header Banner */}
          <div className="bg-[#0a0a0a] rounded-xl p-6 border border-[#1f1f1f] relative overflow-hidden shadow-[0_2px_4px_0_rgba(0,0,0,0.5)]">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#8b5cf6]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📊</span>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">Organizer Intelligence & Analytics</h1>
                <p className="text-xs sm:text-sm text-[#a1a1a1]">
                  Telemetry on community participation, member intent, and knowledge graph queries.
                </p>
              </div>
            </div>

            {/* AI Summary of Community Demand */}
            <div className="mt-4 p-4 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-xs text-[#c4b5fd] flex items-start gap-3">
              <span className="text-base">✨</span>
              <div className="leading-relaxed">
                <span className="font-semibold text-white">AI Community Intelligence Brief: </span>
                Highest member interest this week centers around **Google Gemini AI Hackathons** and **React 19 deep-dives**. Teammate matchmaking activity peaked on Friday, with 68% of search queries seeking complementary skills in Python and Full-Stack development.
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {METRICS.map((m) => (
              <div key={m.label} className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f] shadow-sm">
                <div className="flex items-center justify-between text-[#6b6b6b] mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider">{m.label}</span>
                  <span className="text-base">{m.icon}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono">{m.value}</span>
                  <span className="text-xs font-semibold text-[#10b981] font-mono">{m.change}</span>
                </div>
                <p className="text-[11px] text-[#6b6b6b] mt-1">{m.note}</p>
              </div>
            ))}
          </div>

          {/* Two-column layout: Frequently Requested Info vs Content Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Frequently Requested Information (2 cols) */}
            <div className="lg:col-span-2 bg-[#0a0a0a] rounded-lg p-5 sm:p-6 border border-[#1f1f1f] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-white">Frequently Queried Topics</h2>
                  <p className="text-xs text-[#6b6b6b]">Top queries extracted from Cognee semantic search</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#111111] border border-[#1f1f1f] text-[#a1a1a1]">
                  Last 30 Days
                </span>
              </div>

              <div className="divide-y divide-[#1f1f1f]">
                {TOP_SEARCH_QUERIES.map((item, idx) => (
                  <div key={item.query} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 text-xs text-[#6b6b6b] font-mono">#{idx + 1}</span>
                      <div className="truncate">
                        <p className="text-sm font-medium text-white truncate">{item.query}</p>
                        <span className="text-[11px] font-mono text-[#6b6b6b]">{item.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-[#a1a1a1] font-mono">{item.volume} asks</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-[#c4b5fd]">
                        {item.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement & Content Breakdown (1 col) */}
            <div className="bg-[#0a0a0a] rounded-lg p-5 sm:p-6 border border-[#1f1f1f] space-y-5">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-white">Content Distribution</h2>
                <p className="text-xs text-[#6b6b6b]">Breakdown of published community items</p>
              </div>

              <div className="space-y-4">
                {ENGAGEMENT_BREAKDOWN.map((b) => (
                  <div key={b.type} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#a1a1a1]">{b.type}</span>
                      <span className="text-[#6b6b6b]">{b.count} ({b.percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-[#161616] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${b.color}`}
                        style={{ width: `${b.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-md bg-[#111111] border border-[#1f1f1f] text-xs text-[#a1a1a1] space-y-1">
                <span className="font-semibold text-white block">Moderation Health</span>
                <p className="text-[#6b6b6b] text-[11px] leading-relaxed">
                  0 pending reports. 100% of posts currently comply with community trust standards.
                </p>
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
