// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn(
      'GEMINI_API_KEY is not set in environment variables. Please add GEMINI_API_KEY to your Vercel Project Settings > Environment Variables.'
    )
    return null
  }
  return new GoogleGenerativeAI(apiKey)
}

export const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-pro',
]

/**
 * Resilient Gemini Model wrapper that attempts newer models first,
 * and automatically falls back if a specific model version is unavailable on the deployed environment.
 */
export const geminiFlash = {
  async generateContent(params: any) {
    const client = getGeminiClient()
    if (!client) {
      return {
        response: {
          text: () =>
            'Please ensure GEMINI_API_KEY is configured in your Vercel Project Settings > Environment Variables to enable AI responses.',
        },
      }
    }

    let lastErr: any = null
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = client.getGenerativeModel({ model: modelName })
        return await model.generateContent(params)
      } catch (err: any) {
        lastErr = err
        const msg = String(err?.message || '').toLowerCase()
        if (
          msg.includes('404') ||
          msg.includes('not found') ||
          msg.includes('no longer available') ||
          msg.includes('unsupported')
        ) {
          continue
        }
        throw err
      }
    }
    throw lastErr
  },

  async generateContentStream(params: any) {
    const client = getGeminiClient()
    if (!client) {
      async function* fallbackStream() {
        yield {
          text: () =>
            'Please add GEMINI_API_KEY in your Vercel Project Settings > Environment Variables to activate AI streaming.',
        }
      }
      return { stream: fallbackStream() }
    }

    let lastErr: any = null
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = client.getGenerativeModel({ model: modelName })
        return await model.generateContentStream(params)
      } catch (err: any) {
        lastErr = err
        const msg = String(err?.message || '').toLowerCase()
        if (
          msg.includes('404') ||
          msg.includes('not found') ||
          msg.includes('no longer available') ||
          msg.includes('unsupported')
        ) {
          continue
        }
        throw err
      }
    }
    throw lastErr
  },
}

/** Summarize content in 2-3 engaging sentences */
export async function summarizeContent(text: string): Promise<string> {
  try {
    const result = await geminiFlash.generateContent(
      `Summarize the following in 2-3 concise, engaging sentences suitable for a community platform card. Be specific about what, when, and why it matters:\n\n${text}`
    )
    return result.response.text()
  } catch (e) {
    console.error('Gemini summarize error:', e)
    return text.slice(0, 200) + '...'
  }
}

/** Generate a streaming response given context and a question */
export async function streamAnswer(
  question: string,
  context: string[],
  systemPrompt?: string
) {
  const system =
    systemPrompt ||
    `You are Communify AI, an intelligent assistant for a developer community platform. 
Answer based on the provided context. Be concise, helpful, and cite specific events or people when relevant.
If you reference an event or resource, mention its name clearly.`

  const fullPrompt = `${system}

Context from community knowledge base:
${context.map((c, i) => `[${i + 1}] ${c}`).join('\n\n')}

User question: ${question}

Answer:`

  return geminiFlash.generateContentStream(fullPrompt)
}
