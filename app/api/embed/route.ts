// app/api/embed/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cogneeAdd, cogneeProcess, formatPostForCognee, formatProfileForCognee } from '@/lib/cognee'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data, processs = false } = body

    let text = ''

    if (type === 'post') {
      text = formatPostForCognee(data)
    } else if (type === 'profile') {
      text = formatProfileForCognee(data)
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const added = await cogneeAdd(text, 'community-global')

    // Fire-and-forget cognify — only if requested (e.g. after bulk seed)
    if (processs) {
      cogneeProcess('community-global').catch(console.error)
    }

    return NextResponse.json({ success: added, text })
  } catch (err) {
    console.error('Embed route error:', err)
    return NextResponse.json({ error: 'Failed to embed entity' }, { status: 500 })
  }
}
