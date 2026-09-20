// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cogneeSearch } from '@/lib/cognee'
import { geminiFlash } from '@/lib/gemini'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query?.trim()) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 })
    }

    // 1. Search Cognee knowledge graph with timeout protection
    let results = await cogneeSearch(query, 'community-global', 8)
    let contextTexts = results.map((r) => r.text || String(r)).filter(Boolean)

    // 2. Fallback: If Cognee returns empty, search Supabase
    if (contextTexts.length === 0) {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data: posts } = await supabase
          .from('posts')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
          .limit(6)

        if (posts && posts.length > 0) {
          results = posts.map((p) => ({
            text: `[${p.type.toUpperCase()}] ${p.title}\n${p.ai_summary || p.description}\nLocation: ${p.location || 'Online'}`,
          }))
          contextTexts = results.map((r) => r.text)
        }
      } catch (err) {
        console.error('Supabase search fallback error:', err)
      }
    }

    // 3. Always generate a natural language AI answer with Gemini
    let aiAnswer = ''
    try {
      const prompt = contextTexts.length > 0
        ? `You are Communify AI search assistant. Based on the community knowledge below, answer the user's search query in 2-4 sentences. Be specific, mention event/resource names when available.

Community Knowledge:
${contextTexts.map((t, i) => `[${i + 1}] ${t}`).join('\n\n')}

User Query: ${query}

Answer (be helpful, concise, and specific):`.trim()
        : `You are Communify AI search assistant for a developer community platform. The user searched for "${query}".
Answer the query in 2-4 concise, helpful sentences. Mention recommended practices, events, or resources developers look for regarding this topic.

User Query: ${query}

Answer:`.trim()

      const result = await geminiFlash.generateContent(prompt)
      aiAnswer = result.response.text()
    } catch (e) {
      console.error('Gemini search answer error:', e)
      aiAnswer = `Here are the results matching "${query}" from the Communify community graph.`
    }

    return NextResponse.json({
      aiAnswer,
      results: results.slice(0, 6),
      query,
    })
  } catch (globalErr) {
    console.error('Search route error:', globalErr)
    return NextResponse.json({
      aiAnswer: 'Unable to process search at this time. Please try again.',
      results: [],
      query: '',
    }, { status: 500 })
  }
}
