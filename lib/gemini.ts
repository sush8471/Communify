// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiFlash = genai.getGenerativeModel({ model: 'gemini-1.5-flash' })

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
    `You are Communify AI, an intelligent assistant for a community platform. 
Answer based on the provided context. Be concise, helpful, and cite specific events or people when relevant.
If you reference an event or resource, mention its name clearly.`

  const fullPrompt = `${system}

Context from community knowledge base:
${context.map((c, i) => `[${i + 1}] ${c}`).join('\n\n')}

User question: ${question}

Answer:`

  return geminiFlash.generateContentStream(fullPrompt)
}
