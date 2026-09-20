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
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
  }

  return (
    <>
      {/* Floating button with Radiant Violet Glow (Section 14.5 & 5.2) */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center',
          'bg-[#8b5cf6] hover:bg-[#a78bfa] text-white',
          'shadow-[0_0_20px_rgba(139,92,246,0.45)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]',
          'hover:scale-105 active:scale-95 transition-all duration-200'
        )}
        aria-label="Open AI Chat"
      >
        {open ? (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className={cn(
            'fixed bottom-24 right-6 z-50 w-[380px] h-[520px]',
            'flex flex-col rounded-xl overflow-hidden',
            'bg-[#0a0a0a] border border-[#2e2e2e]',
            'shadow-[0_24px_48px_0_rgba(0,0,0,0.8)]',
            'slide-up'
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1f1f1f] bg-gradient-to-r from-[#8b5cf6]/10 to-transparent">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center text-sm font-bold text-white shadow-[0_0_8px_rgba(139,92,246,0.3)]">
              ⚡
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Communify AI</p>
              <p className="text-[11px] text-[#6b6b6b] font-mono">Cognee Knowledge Graph</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#111111] border border-[#1f1f1f]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-[11px] font-mono text-[#a1a1a1]">Active</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-[#8b5cf6] text-white rounded-br-none shadow-[0_0_8px_rgba(139,92,246,0.25)]'
                      : 'bg-[#111111] text-[#a1a1a1] border border-[#1f1f1f] rounded-bl-none'
                  )}
                  dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#111111] border border-[#1f1f1f] px-3.5 py-2.5 rounded-lg rounded-bl-none">
                  <div className="flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts with Section 8.5 AI pill style */}
          {messages.length === 1 && (
            <div className="px-4 pb-2.5 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/25 text-[#c4b5fd] hover:bg-[#8b5cf6]/20 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input form */}
          <div className="p-3 border-t border-[#1f1f1f] bg-black">
            <div className="flex gap-2 items-center bg-[#0a0a0a] rounded-md border border-[#1f1f1f] focus-within:border-[#8b5cf6] px-3 py-1.5 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about events, resources, people..."
                className="flex-1 bg-transparent text-sm text-white placeholder-[#4a4a4a] outline-none"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded bg-[#8b5cf6] hover:bg-[#a78bfa] flex items-center justify-center disabled:opacity-40 transition-colors shrink-0"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
