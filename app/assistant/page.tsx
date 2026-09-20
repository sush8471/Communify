'use client'
import { useState, useRef, useEffect } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { LeftSidebar, MobileNav } from '@/components/layout/Sidebar'
import { cn } from '@/lib/utils'

interface Message { role: 'user' | 'assistant'; content: string }

const QUICK_PROMPTS = [
  '🎯 Find ML events this month',
  '🤝 Who can help with React?',
  '📚 Best resources for beginners',
  '⚡ Upcoming hackathons',
  '🐍 Python developers nearby',
  '🌐 Web3 workshops online',
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm **Communify AI**, your community intelligence assistant.\n\nI can help you:\n- 🎯 Find relevant events and resources\n- 🤝 Match you with potential collaborators\n- 💡 Answer questions about the community\n\nWhat would you like to know?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

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

      if (!res.ok || !res.body) throw new Error('Stream error')

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
      inputRef.current?.focus()
    }
  }

  function renderContent(text: string) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="min-h-screen bg-[#080c14] flex flex-col">
      <TopBar />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 gap-6 py-6">
        <LeftSidebar />

        <main className="flex-1 flex flex-col min-w-0 max-w-3xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center glow-violet-sm">
              ⚡
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Communify AI Assistant</h1>
              <p className="text-xs text-slate-500">Cognee Knowledge Graph · Gemini 1.5 Flash</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-500">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start', 'fade-in')}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs shrink-0 mt-1">
                    ⚡
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-violet-600/80 text-white rounded-br-sm'
                      : 'glass border border-white/[0.06] text-slate-200 rounded-bl-sm'
                  )}
                  dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                />
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs shrink-0 mt-1 font-bold text-white">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start fade-in">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs shrink-0 mt-1">⚡</div>
                <div className="glass border border-white/[0.06] px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p.replace(/^[^ ]+ /, ''))}
                  className="text-sm px-3 py-1.5 rounded-xl glass border border-white/[0.08] text-slate-400 hover:border-violet-500/30 hover:text-violet-300 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="glass rounded-2xl border border-white/10 p-3 flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Ask anything about the community..."
              rows={2}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none resize-none leading-relaxed"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center disabled:opacity-40 hover:bg-violet-500 transition-colors shrink-0"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-slate-700 mt-2">Press Enter to send · Shift+Enter for new line</p>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
