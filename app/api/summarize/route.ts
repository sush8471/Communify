// app/api/summarize/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { summarizeContent } from '@/lib/gemini'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text?.trim()) return NextResponse.json({ error: 'Text required' }, { status: 400 })
    const summary = await summarizeContent(text)
    return NextResponse.json({ summary })
  } catch (err) {
    console.error('Summarize route error:', err)
    return NextResponse.json({ error: 'Failed to summarize' }, { status: 500 })
  }
}
