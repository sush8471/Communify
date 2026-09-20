// lib/cognee.ts
const COGNEE_BASE =
  process.env.COGNEE_BASE_URL ||
  'https://tenant-678ec9db-5dc3-4e8e-a1ac-d22d8dd871fa.aws.cognee.ai'
const COGNEE_KEY =
  process.env.COGNEE_API_KEY ||
  '667a2c3569a352b13885328ee5120c277f60f33d2ad92ada53c651191e544740'

export interface CogneeResult {
  id?: string
  text: string
  score?: number
  metadata?: Record<string, unknown>
}

/** Feed raw text into Cognee memory via multipart/form-data */
export async function cogneeAdd(text: string, datasetName = 'community-global') {
  try {
    const form = new FormData()
    const blob = new Blob([text], { type: 'text/plain' })
    form.append('data', blob, `doc-${Date.now()}.txt`)
    form.append('datasetName', datasetName)

    const res = await fetch(`${COGNEE_BASE}/api/v1/add`, {
      method: 'POST',
      headers: {
        'x-api-key': COGNEE_KEY,
      },
      body: form,
      signal: AbortSignal.timeout(10000),
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

/** Build knowledge graph from added data (async in background) */
export async function cogneeProcess(datasetName = 'community-global') {
  try {
    const res = await fetch(`${COGNEE_BASE}/api/v1/cognify`, {
      method: 'POST',
      headers: {
        'x-api-key': COGNEE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        datasets: [datasetName],
        run_in_background: true,
      }),
      signal: AbortSignal.timeout(10000),
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

/** Semantic + graph search over Cognee memory with timeout safety */
export async function cogneeSearch(
  query: string,
  datasetName = 'community-global',
  limit = 5
): Promise<CogneeResult[]> {
  try {
    const res = await fetch(`${COGNEE_BASE}/api/v1/search`, {
      method: 'POST',
      headers: {
        'x-api-key': COGNEE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        datasets: [datasetName],
        top_k: limit,
      }),
      signal: AbortSignal.timeout(8000), // 8s timeout to protect serverless functions
    })
    if (!res.ok) {
      console.error('Cognee search failed with status:', res.status)
      return []
    }
    const data = await res.json()
    // Cognee returns array of results: [{ search_result: [...] }] or strings
    if (Array.isArray(data)) {
      const results: CogneeResult[] = []
      for (const item of data) {
        if (typeof item === 'string') {
          results.push({ text: item })
        } else if (item.search_result && Array.isArray(item.search_result)) {
          for (const s of item.search_result) {
            results.push({ text: typeof s === 'string' ? s : JSON.stringify(s) })
          }
        } else if (item.text) {
          results.push(item)
        }
      }
      return results
    }
    return []
  } catch (e: any) {
    if (e?.name === 'TimeoutError' || e?.name === 'AbortError') {
      console.warn('Cognee search timed out after 8s, falling back to local graph/database.')
    } else {
      console.error('Cognee search error:', e)
    }
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
