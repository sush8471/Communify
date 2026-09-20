'use client'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  'Find events this weekend',
  'Who knows Python nearby?',
  'Best resources for ML beginners',
  'Upcoming hackathons',
]

export function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm **Communify AI** 👋 Ask me anything about events, resources, or finding collaborators in this community.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text?: string) {
    const query = text || input.trim()
    if (!query || loading) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: query }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantMsg = ''

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantMsg += decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantMsg }
          return updated
        })
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function renderContent(text: string) {
    // Simple markdown: bold
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center',
          'bg-gradient-to-br from-violet-600 to-violet-800 shadow-lg shadow-violet-900/50',
          'hover:scale-110 active:scale-95 transition-transform duration-200',
          'glow-violet-sm'
        )}
        aria-label="Open AI Chat"
      >
        {open ? (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className={cn(
            'fixed bottom-24 right-6 z-50 w-[380px] h-[520px]',
            'flex flex-col rounded-2xl overflow-hidden',
            'glass border border-white/10 shadow-2xl shadow-black/60',
            'slide-up'
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm">
              ⚡
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Communify AI</p>
              <p className="text-xs text-slate-500">Powered by Cognee + Gemini</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-500">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-violet-600/80 text-white rounded-br-sm'
                      : 'bg-white/[0.05] text-slate-200 rounded-bl-sm border border-white/[0.06]'
                  )}
                  dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.05] border border-white/[0.06] px-3 py-2 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="text-xs px-2.5 py-1 rounded-full glass border border-white/10 text-slate-300 hover:border-violet-500/40 hover:text-violet-300 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3">
            <div className="flex gap-2 items-center glass rounded-xl border border-white/10 px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center disabled:opacity-40 hover:bg-violet-500 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
