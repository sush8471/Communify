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
      content: "Hi! I'm **Communify AI**, your community intelligence assistant.\n\nI can help you:\n- 🎯 Find relevant events and resources\n- 🤝 Match you with potential collaborators\n- 💡 Answer questions about the community graph\n\nWhat would you like to explore today?",
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
        { role: 'assistant', content: 'Sorry, something went wrong. Please check connection and try again.' },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function renderContent(text: string) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <TopBar />
      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        <LeftSidebar />

        <main className="flex-1 flex flex-col min-w-0 max-w-3xl py-6 px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6 bg-[#0a0a0a] p-4 rounded-xl border border-[#1f1f1f]">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center text-white shadow-[0_0_12px_rgba(139,92,246,0.35)] shrink-0">
              ⚡
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white">Communify AI Assistant</h1>
              <p className="text-xs font-mono text-[#6b6b6b]">Cognee Knowledge Graph · Gemini 1.5 Flash</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111111] border border-[#1f1f1f]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-xs font-mono text-[#a1a1a1]">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start', 'fade-in')}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center text-xs shrink-0 mt-1 font-bold text-white">
                    ⚡
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] px-4 py-3 rounded-lg text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-[#8b5cf6] text-white rounded-br-none shadow-[0_0_10px_rgba(139,92,246,0.25)]'
                      : 'bg-[#0a0a0a] border border-[#1f1f1f] text-[#a1a1a1] rounded-bl-none'
                  )}
                  dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                />
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-md bg-[#161616] border border-[#2e2e2e] flex items-center justify-center text-xs shrink-0 mt-1 font-bold text-white">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start fade-in">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center text-xs shrink-0 mt-1 text-white">⚡</div>
                <div className="bg-[#0a0a0a] border border-[#1f1f1f] px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p.replace(/^[^ ]+ /, ''))}
                  className="font-mono text-xs px-3 py-1.5 rounded-full bg-[#111111] border border-[#1f1f1f] text-[#a1a1a1] hover:border-[#8b5cf6]/40 hover:text-white hover:bg-[#8b5cf6]/10 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="bg-[#0a0a0a] rounded-xl border border-[#1f1f1f] focus-within:border-[#8b5cf6] p-3 flex gap-3 items-end transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
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
              placeholder="Ask anything about the developer community..."
              rows={2}
              className="flex-1 bg-transparent text-sm text-white placeholder-[#4a4a4a] outline-none resize-none leading-relaxed"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-md bg-[#8b5cf6] hover:bg-[#a78bfa] flex items-center justify-center disabled:opacity-40 shadow-[0_0_8px_rgba(139,92,246,0.3)] transition-all shrink-0"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[11px] font-mono text-[#4a4a4a] mt-2">
            Press Enter to send · Shift+Enter for newline
          </p>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
