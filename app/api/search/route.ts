// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cogneeSearch } from '@/lib/cognee'
import { geminiFlash } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  const { query } = await req.json()

  if (!query?.trim()) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 })
  }

  // Search Cognee knowledge graph
  const results = await cogneeSearch(query, 'community-global', 8)
  const contextTexts = results.map((r) => r.text || String(r)).filter(Boolean)

  // Generate a natural language answer with Gemini
  let aiAnswer = ''
  if (contextTexts.length > 0) {
    try {
      const prompt = `
You are Linkfy AI search assistant. Based on the community knowledge below, answer the user's search query in 2-4 sentences. Be specific, mention event/resource names when available.

Community Knowledge:
${contextTexts.map((t, i) => `[${i + 1}] ${t}`).join('\n\n')}

User Query: ${query}

Answer (be helpful and specific):`.trim()

      const result = await geminiFlash.generateContent(prompt)
      aiAnswer = result.response.text()
    } catch (e) {
      console.error('Gemini search answer error:', e)
    }
  }

  return NextResponse.json({
    aiAnswer,
    results: results.slice(0, 6),
    query,
  })
}
