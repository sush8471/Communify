// app/api/collaborators/match/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase, DEMO_USER_ID, type Profile } from '@/lib/supabase'
import { geminiFlash } from '@/lib/gemini'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const DEFAULT_FALLBACK_CANDIDATES: Partial<Profile>[] = [
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Sarah Chen',
    username: 'sarahc',
    bio: 'AI/ML Engineer specializing in RAG architectures, FastAPI microservices, and Gemini API integrations.',
    location: 'San Francisco, CA',
    skills: ['Python', 'FastAPI', 'RAG', 'Machine Learning', 'Gemini API'],
    interests: ['AI Hackathons', 'Open Source', 'Autonomous Agents'],
    role: 'member',
    ai_summary: 'ML Engineer with deep expertise in Python, RAG pipelines, and LLM integrations.',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Arjun Mehta',
    username: 'arjunm',
    bio: 'Senior Frontend Craftsman passionate about Next.js 15, Tailwind CSS, TypeScript, and fluid animations.',
    location: 'Bangalore, India',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'UI/UX'],
    interests: ['Frontend Performance', 'Design Systems', 'Web Animations'],
    role: 'member',
    ai_summary: 'Full-stack frontend specialist experienced with modern React and interactive UX.',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Elena Rostova',
    username: 'elena_r',
    bio: 'Backend & Cloud Architect with expertise in high-concurrency Go, PostgreSQL, Redis, and Supabase.',
    location: 'Berlin, Germany',
    skills: ['Go', 'PostgreSQL', 'Docker', 'Redis', 'Supabase'],
    interests: ['Distributed Systems', 'Cloud Infrastructure', 'Fintech'],
    role: 'member',
    ai_summary: 'Backend engineer focused on distributed databases and scalable API infrastructure.',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Marcus Vance',
    username: 'marcusv',
    bio: 'Product Designer & Rapid Prototyper who codes in React. Fast Figma-to-code execution for hackathon winners.',
    location: 'Austin, TX',
    skills: ['UI/UX', 'Figma', 'Prototyping', 'React', 'Design Systems'],
    interests: ['Hackathons', 'Developer Tools', 'Product Strategy'],
    role: 'member',
    ai_summary: 'Product designer focused on user research and rapid prototype development.',
  },
]

export async function POST(req: NextRequest) {
  try {
    const { requirement } = await req.json()

    if (!requirement?.trim()) {
      return NextResponse.json({ error: 'Project requirement is required' }, { status: 400 })
    }

    // 1. Fetch available community profiles (excluding demo user itself)
    let candidates: any[] = []
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, username, bio, location, skills, interests, role, ai_summary')
        .neq('id', DEMO_USER_ID)

      if (!error && data && data.length > 0) {
        candidates = data
      }
    } catch (dbErr) {
      console.warn('Supabase profiles query error, using fallback candidate list:', dbErr)
    }

    // If database has no candidates yet, use fallback candidate pool
    if (candidates.length === 0) {
      candidates = DEFAULT_FALLBACK_CANDIDATES
    }

    // 2. Use Gemini to evaluate compatibility & score candidates
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
    "matchReason": "Strong background in RAG pipelines directly aligns with your chatbot architecture.",
    "highlightedSkills": ["Python", "RAG"]
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
      console.error('Gemini teammate match error, using algorithmic scoring:', aiErr)
      // Fallback scoring based on keyword overlap
      const reqLower = requirement.toLowerCase()
      scoredList = candidates.map((c) => {
        const matchingSkills = (c.skills || []).filter((s: string) => reqLower.includes(s.toLowerCase()))
        const score = Math.min(95, 60 + matchingSkills.length * 15)
        return {
          id: c.id,
          matchScore: score,
          matchReason: matchingSkills.length
            ? `Demonstrated domain expertise in ${matchingSkills.join(', ')}.`
            : 'Well-rounded engineering skill set suitable for rapid hackathon execution.',
          highlightedSkills: matchingSkills.length ? matchingSkills : (c.skills || []).slice(0, 3),
        }
      })
    }

    // Merge AI score with candidate profile details
    const matches = candidates
      .map((c) => {
        const scoreInfo = scoredList.find((s) => s.id === c.id) || {
          matchScore: 68,
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
