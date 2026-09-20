'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Please sign in to post')
        setSubmitting(false)
        return
      }

      const { data, error: dbErr } = await supabase
        .from('posts')
        .insert({
          ...form,
          author_id: user.id,
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
    <div className="min-h-screen bg-[#080c14] flex flex-col">
      <TopBar />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 gap-6 py-6">
        <LeftSidebar />

        <main className="flex-1 min-w-0 max-w-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Create Post</h1>
            <p className="text-sm text-slate-500">Share an event, resource, or announcement with the community</p>
          </div>

          {success ? (
            <div className="glass rounded-2xl p-8 text-center border border-emerald-500/20 bg-emerald-500/5 fade-in">
              <p className="text-4xl mb-3">🎉</p>
              <p className="text-lg font-semibold text-emerald-400">Published!</p>
              <p className="text-sm text-slate-500 mt-1">Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type selector */}
              <div className="glass rounded-2xl p-4 border border-white/[0.06]">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Post Type
                </label>
                <div className="flex gap-2">
                  {['event', 'resource', 'announcement'].map((t) => (
                    <button
                      key={t} type="button"
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-sm font-medium border transition-all capitalize',
                        form.type === t
                          ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                          : 'border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/10'
                      )}
                    >
                      {t === 'event' ? '🎯' : t === 'resource' ? '📚' : '📢'} {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="glass rounded-2xl p-4 border border-white/[0.06]">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Give it a compelling title..."
                  className="w-full bg-transparent text-white placeholder-slate-600 outline-none text-base font-medium"
                  required
                />
              </div>

              {/* Description */}
              <div className="glass rounded-2xl p-4 border border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Description *
                  </label>
                  <button
                    type="button"
                    onClick={generateSummary}
                    disabled={!form.description.trim() || summarizing}
                    className="text-xs text-violet-400 hover:text-violet-300 disabled:opacity-40 flex items-center gap-1 transition-colors"
                  >
                    {summarizing ? (
                      <><span className="animate-spin">⚙️</span> Generating...</>
                    ) : (
                      <><span>⚡</span> AI Summarize</>
                    )}
                  </button>
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your event, resource, or announcement in detail..."
                  rows={5}
                  className="w-full bg-transparent text-white placeholder-slate-600 outline-none text-sm leading-relaxed resize-none"
                  required
                />
                {aiSummary && (
                  <div className="mt-3 pt-3 border-t border-white/[0.06]">
                    <p className="text-xs text-violet-400 font-medium mb-1 flex items-center gap-1">
                      ⚡ AI Summary
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">{aiSummary}</p>
                  </div>
                )}
              </div>

              {/* Location + Date (events only) */}
              {form.type === 'event' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-2xl p-4 border border-white/[0.06]">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      placeholder="Online / City"
                      className="w-full bg-transparent text-white placeholder-slate-600 outline-none text-sm"
                    />
                  </div>
                  <div className="glass rounded-2xl p-4 border border-white/[0.06]">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={form.start_time}
                      onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                      className="w-full bg-transparent text-white outline-none text-sm [color-scheme:dark]"
                    />
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="glass rounded-2xl p-4 border border-white/[0.06]">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Tags
                </label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {form.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-xs text-violet-300">
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-violet-500 hover:text-red-400 transition-colors">×</button>
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
                    placeholder="Add tag + press Enter"
                    className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500/40"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TAG_SUGGESTIONS.filter((t) => !form.tags.includes(t)).slice(0, 10).map((t) => (
                    <button
                      key={t} type="button" onClick={() => addTag(t)}
                      className="text-xs px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/10 transition-colors"
                    >
                      +{t}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  'w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200',
                  'bg-gradient-to-r from-violet-600 to-violet-700 text-white',
                  'hover:from-violet-500 hover:to-violet-600 hover:shadow-lg hover:shadow-violet-900/30',
                  'active:scale-[0.98] disabled:opacity-60'
                )}
              >
                {submitting ? '⚙️ Publishing...' : '🚀 Publish Post'}
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
