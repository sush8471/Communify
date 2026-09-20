// app/api/collaborators/match/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase, DEMO_USER_ID } from '@/lib/supabase'
import { geminiFlash } from '@/lib/gemini'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { requirement } = await req.json()

    if (!requirement?.trim()) {
      return NextResponse.json({ error: 'Project requirement is required' }, { status: 400 })
    }

    // 1. Fetch available community profiles (excluding demo user itself)
    const { data: candidates, error } = await supabase
      .from('profiles')
      .select('id, name, username, bio, location, skills, interests, role, ai_summary')
      .neq('id', DEMO_USER_ID)

    if (error || !candidates || candidates.length === 0) {
      return NextResponse.json({ matches: [] })
    }

    // 2. Use Gemini 3.6 Flash to evaluate compatibility & score candidates
    const prompt = `
You are an intelligent teammate & collaborator matching engine for a developer community platform.
Analyze the following project requirement / skill request and score each candidate.

Project Requirement:
"${requirement}"

Candidate Profiles:
${candidates
  .map(
    (c, i) => `
[Candidate ID: ${c.id}]
Index: ${i}
Name: ${c.name}
Role: ${c.role}
Bio: ${c.bio}
Skills: ${(c.skills || []).join(', ')}
Interests: ${(c.interests || []).join(', ')}
`
  )
  .join('\n')}

Output JSON array containing an object for each candidate with:
- "id": Candidate ID string
- "matchScore": integer between 40 and 99 representing compatibility percentage
- "matchReason": A concise 1-2 sentence explanation of why they are an ideal fit for this project
- "highlightedSkills": array of strings matching the required skills

Return strictly JSON matching this format:
[
  {
    "id": "candidate-id-uuid",
    "matchScore": 95,
    "matchReason": "Strong background in RAG pipelines and Gemini API directly aligns with your chatbot architecture.",
    "highlightedSkills": ["Python", "RAG", "Gemini API"]
  }
]
`.trim()

    let scoredList: Array<{ id: string; matchScore: number; matchReason: string; highlightedSkills: string[] }> = []

    try {
      const result = await geminiFlash.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      })
      const text = result.response.text()
      scoredList = JSON.parse(text)
    } catch (aiErr) {
      console.error('Gemini teammate match error:', aiErr)
      // Fallback scoring based on keyword overlap
      const reqLower = requirement.toLowerCase()
      scoredList = candidates.map((c) => {
        const matchingSkills = (c.skills || []).filter((s: string) => reqLower.includes(s.toLowerCase()))
        const score = Math.min(95, 60 + matchingSkills.length * 15)
        return {
          id: c.id,
          matchScore: score,
          matchReason: matchingSkills.length
            ? `Has direct experience with ${matchingSkills.join(', ')}.`
            : 'Strong general engineering capabilities suitable for cross-functional collaboration.',
          highlightedSkills: matchingSkills.length ? matchingSkills : (c.skills || []).slice(0, 3),
        }
      })
    }

    // Merge AI score with candidate profile details
    const matches = candidates
      .map((c) => {
        const scoreInfo = scoredList.find((s) => s.id === c.id) || {
          matchScore: 65,
          matchReason: 'Active community member open to hackathons and collaborations.',
          highlightedSkills: (c.skills || []).slice(0, 3),
        }
        return {
          ...c,
          matchScore: scoreInfo.matchScore,
          matchReason: scoreInfo.matchReason,
          highlightedSkills: scoreInfo.highlightedSkills,
        }
      })
      .sort((a, b) => b.matchScore - a.matchScore)

    return NextResponse.json({
      matches,
      requirement,
    })
  } catch (err) {
    console.error('Teammate match route error:', err)
    return NextResponse.json({ error: 'Failed to find teammate matches' }, { status: 500 })
  }
}
