'use client'
import { useState } from 'react'
import { supabase, DEMO_USER_ID } from '@/lib/supabase'
import { TopBar } from '@/components/layout/TopBar'
import { LeftSidebar, MobileNav } from '@/components/layout/Sidebar'
import { AIChatWidget } from '@/components/ai/AIChatWidget'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const TAG_SUGGESTIONS = [
  'react', 'python', 'ml', 'ai', 'javascript', 'typescript', 'backend',
  'frontend', 'hackathon', 'workshop', 'beginner', 'open-source', 'networking',
  'data-science', 'web3', 'blockchain', 'devops', 'mobile',
]

export default function CreateEventPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    type: 'event',
    title: '',
    description: '',
    location: '',
    start_time: '',
    tags: [] as string[],
  })
  const [aiSummary, setAiSummary] = useState('')
  const [summarizing, setSummarizing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function generateSummary() {
    if (!form.description.trim()) return
    setSummarizing(true)
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${form.title}\n${form.description}` }),
      })
      const data = await res.json()
      setAiSummary(data.summary || '')
    } catch {
      setAiSummary('')
    } finally {
      setSummarizing(false)
    }
  }

  function addTag(tag: string) {
    const clean = tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    if (clean && !form.tags.includes(clean)) {
      setForm((f) => ({ ...f, tags: [...f.tags, clean] }))
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required')
      return
    }

    setSubmitting(true)
    try {
      const { data, error: dbErr } = await supabase
        .from('posts')
        .insert({
          ...form,
          author_id: DEMO_USER_ID,
          ai_summary: aiSummary,
          status: 'published',
          upvotes: 0,
        })
        .select()
        .single()

      if (dbErr) throw dbErr

      // Index in Cognee (fire and forget)
      fetch('/api/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post', data: { ...form, ai_summary: aiSummary }, processs: true }),
      }).catch(console.error)

      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <TopBar />
      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        <LeftSidebar />

        <main className="flex-1 min-w-0 max-w-2xl py-6 px-4 sm:px-6">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Create Community Post</h1>
            <p className="text-xs sm:text-sm text-[#a1a1a1]">
              Publish events, learning resources, or announcements into the Cognee graph.
            </p>
          </div>

          {success ? (
            <div className="bg-[#0a0a0a] rounded-xl p-8 text-center border border-[#10b981]/30 shadow-[0_0_16px_rgba(16,185,129,0.15)] fade-in">
              <p className="text-4xl mb-3">🎉</p>
              <p className="text-lg font-semibold text-[#10b981]">Post Published!</p>
              <p className="text-xs text-[#a1a1a1] mt-1 font-mono">Redirecting to community feed…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type selector */}
              <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f]">
                <label className="block text-xs font-mono font-semibold text-[#a1a1a1] uppercase tracking-wider mb-3">
                  Post Classification
                </label>
                <div className="flex gap-2">
                  {['event', 'resource', 'announcement'].map((t) => (
                    <button
                      key={t} type="button"
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={cn(
                        'flex-1 py-2 rounded-md text-xs sm:text-sm font-medium border transition-all capitalize',
                        form.type === t
                          ? 'bg-[#8b5cf6]/15 border-[#8b5cf6]/50 text-[#c4b5fd] shadow-[0_0_8px_rgba(139,92,246,0.25)]'
                          : 'bg-[#111111] border-[#1f1f1f] text-[#6b6b6b] hover:text-[#a1a1a1] hover:border-[#2e2e2e]'
                      )}
                    >
                      {t === 'event' ? '🎯' : t === 'resource' ? '📚' : '📢'} {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f]">
                <label className="block text-xs font-mono font-semibold text-[#a1a1a1] uppercase tracking-wider mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Compelling and descriptive title..."
                  className="w-full bg-[#111111] border border-[#1f1f1f] rounded-md px-3.5 py-2.5 text-sm text-white placeholder-[#4a4a4a] focus:outline-none focus:border-[#8b5cf6] font-medium"
                  required
                />
              </div>

              {/* Description */}
              <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f]">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono font-semibold text-[#a1a1a1] uppercase tracking-wider">
                    Description *
                  </label>
                  <button
                    type="button"
                    onClick={generateSummary}
                    disabled={!form.description.trim() || summarizing}
                    className="font-mono text-xs text-[#a78bfa] hover:text-[#c4b5fd] disabled:opacity-40 flex items-center gap-1.5 transition-colors"
                  >
                    {summarizing ? (
                      <><span className="animate-spin">⚙️</span> Generating…</>
                    ) : (
                      <><span>⚡</span> AI Summarize</>
                    )}
                  </button>
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Detail your event agenda, resource links, or community announcement..."
                  rows={5}
                  className="w-full bg-[#111111] border border-[#1f1f1f] rounded-md px-3.5 py-2.5 text-sm text-white placeholder-[#4a4a4a] focus:outline-none focus:border-[#8b5cf6] leading-relaxed resize-none"
                  required
                />
                {aiSummary && (
                  <div className="mt-3 pt-3 border-t border-[#1f1f1f] bg-[#8b5cf6]/5 p-3 rounded-md">
                    <p className="text-xs font-mono text-[#a78bfa] font-medium mb-1 flex items-center gap-1">
                      ✨ AI Synthesized Summary
                    </p>
                    <p className="text-xs text-[#a1a1a1] leading-relaxed">{aiSummary}</p>
                  </div>
                )}
              </div>

              {/* Location + Date (events only) */}
              {form.type === 'event' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f]">
                    <label className="block text-xs font-mono font-semibold text-[#a1a1a1] uppercase tracking-wider mb-2">
                      Location / Mode
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      placeholder="Online / Discord / City"
                      className="w-full bg-[#111111] border border-[#1f1f1f] rounded-md px-3 py-2 text-sm text-white placeholder-[#4a4a4a] focus:outline-none focus:border-[#8b5cf6]"
                    />
                  </div>
                  <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f]">
                    <label className="block text-xs font-mono font-semibold text-[#a1a1a1] uppercase tracking-wider mb-2">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={form.start_time}
                      onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                      className="w-full bg-[#111111] border border-[#1f1f1f] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#8b5cf6] [color-scheme:dark]"
                    />
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="bg-[#0a0a0a] rounded-lg p-5 border border-[#1f1f1f]">
                <label className="block text-xs font-mono font-semibold text-[#a1a1a1] uppercase tracking-wider mb-3">
                  Categorical Tags
                </label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {form.tags.map((tag) => (
                    <span key={tag} className="font-mono inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-xs text-[#c4b5fd]">
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-[#8b5cf6] hover:text-[#ef4444] transition-colors leading-none">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput) }
                      if (e.key === ',') { e.preventDefault(); addTag(tagInput) }
                    }}
                    placeholder="Add tag and press Enter"
                    className="flex-1 bg-[#111111] border border-[#1f1f1f] rounded-md px-3 py-2 text-sm text-white placeholder-[#4a4a4a] outline-none focus:border-[#8b5cf6]"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TAG_SUGGESTIONS.filter((t) => !form.tags.includes(t)).slice(0, 10).map((t) => (
                    <button
                      key={t} type="button" onClick={() => addTag(t)}
                      className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#111111] border border-[#1f1f1f] text-[#6b6b6b] hover:text-[#a1a1a1] hover:border-[#2e2e2e] transition-colors"
                    >
                      +{t}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-md bg-[#ef4444]/15 border border-[#ef4444]/30 text-xs font-mono text-[#ef4444]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  'w-full py-3 rounded-md text-sm font-semibold transition-all duration-200',
                  'bg-[#8b5cf6] hover:bg-[#a78bfa] text-white',
                  'shadow-[0_0_12px_rgba(139,92,246,0.35)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]',
                  'active:scale-[0.99] disabled:opacity-60'
                )}
              >
                {submitting ? 'Publishing to Knowledge Graph…' : '🚀 Publish Post'}
              </button>
            </form>
          )}
        </main>
      </div>

      <MobileNav />
      <AIChatWidget />
    </div>
  )
}
