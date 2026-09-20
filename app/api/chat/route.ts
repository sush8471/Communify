// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import { cogneeSearch } from '@/lib/cognee'
import { streamAnswer } from '@/lib/gemini'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    if (!message?.trim()) {
      return new Response('Message required', { status: 400 })
    }

    // Retrieve relevant community knowledge from Cognee (protected by timeout)
    const results = await cogneeSearch(message, 'community-global', 6)
    const context = results.map((r) => r.text || String(r)).filter(Boolean)

    // Fall back if Cognee returns nothing
    const contextToUse =
      context.length > 0
        ? context
        : ['No specific community data found in memory. Provide helpful answers based on developer platform knowledge.']

    const streamResult = await streamAnswer(message, contextToUse)

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResult.stream) {
            const text = chunk.text()
            if (text) controller.enqueue(new TextEncoder().encode(text))
          }
        } catch (streamErr) {
          console.error('Streaming chunk error:', streamErr)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (e) {
    console.error('Chat error:', e)
    return new Response('Failed to generate response. Please try again.', { status: 500 })
  }
}
