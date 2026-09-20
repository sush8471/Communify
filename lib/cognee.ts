// lib/cognee.ts
const COGNEE_BASE = process.env.COGNEE_BASE_URL
const COGNEE_KEY = process.env.COGNEE_API_KEY

const headers = {
  'Authorization': `Bearer ${COGNEE_KEY}`,
  'Content-Type': 'application/json',
}

export interface CogneeResult {
  id?: string
  text: string
  score?: number
  metadata?: Record<string, unknown>
}

/** Feed raw text into Cognee memory */
export async function cogneeAdd(text: string, datasetName = 'community-global') {
  try {
    const res = await fetch(`${COGNEE_BASE}/api/v1/add`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, datasetName }),
    })
    if (!res.ok) {
      console.error('Cognee add failed:', await res.text())
      return false
    }
    return true
  } catch (e) {
    console.error('Cognee add error:', e)
    return false
  }
}

/** Build knowledge graph from added data (async — fire and forget) */
export async function cogneeProcess(datasetName = 'community-global') {
  try {
    const res = await fetch(`${COGNEE_BASE}/api/v1/cognify`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ datasetName }),
    })
    if (!res.ok) {
      console.error('Cognee process failed:', await res.text())
      return false
    }
    return true
  } catch (e) {
    console.error('Cognee cognify error:', e)
    return false
  }
}

/** Semantic + graph search over Cognee memory */
export async function cogneeSearch(
  query: string,
  datasetName = 'community-global',
  limit = 5
): Promise<CogneeResult[]> {
  try {
    const res = await fetch(`${COGNEE_BASE}/api/v1/search`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ searchQuery: query, datasetName, limit }),
    })
    if (!res.ok) {
      console.error('Cognee search failed:', await res.text())
      return []
    }
    const data = await res.json()
    // Normalize: Cognee may return array or { results: [] }
    return Array.isArray(data) ? data : (data.results ?? [])
  } catch (e) {
    console.error('Cognee search error:', e)
    return []
  }
}

/** Format a post/profile as text for Cognee indexing */
export function formatPostForCognee(post: {
  type: string
  title: string
  description: string
  tags?: string[]
  location?: string
  ai_summary?: string
}): string {
  return [
    `[${post.type.toUpperCase()}] ${post.title}`,
    post.ai_summary || post.description,
    post.tags?.length ? `Tags: ${post.tags.join(', ')}` : '',
    post.location ? `Location: ${post.location}` : '',
  ].filter(Boolean).join('\n')
}

export function formatProfileForCognee(profile: {
  name: string
  bio?: string
  skills?: string[]
  interests?: string[]
}): string {
  return [
    `[PROFILE] ${profile.name}`,
    profile.bio || '',
    profile.skills?.length ? `Skills: ${profile.skills.join(', ')}` : '',
    profile.interests?.length ? `Interests: ${profile.interests.join(', ')}` : '',
  ].filter(Boolean).join('\n')
}
