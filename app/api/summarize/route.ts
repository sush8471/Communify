// app/api/summarize/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { summarizeContent } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  const { text } = await req.json()
  if (!text?.trim()) return NextResponse.json({ error: 'Text required' }, { status: 400 })
  const summary = await summarizeContent(text)
  return NextResponse.json({ summary })
}
