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
  let results = await cogneeSearch(query, 'community-global', 8)
  let contextTexts = results.map((r) => r.text || String(r)).filter(Boolean)

  // Fallback: If Cognee is still indexing or returns empty, fetch matching posts from Supabase
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

  // Generate a natural language answer with Gemini
  let aiAnswer = ''
  if (contextTexts.length > 0) {
    try {
      const prompt = `
You are Communify AI search assistant. Based on the community knowledge below, answer the user's search query in 2-4 sentences. Be specific, mention event/resource names when available.

Community Knowledge:
${contextTexts.map((t, i) => `[${i + 1}] ${t}`).join('\n\n')}

User Query: ${query}

Answer (be helpful, concise, and specific):`.trim()

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
