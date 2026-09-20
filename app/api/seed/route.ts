// app/api/seed/route.ts — Run once to populate Supabase + Cognee
import { NextResponse } from 'next/server'
import { supabase, DEMO_USER_ID } from '@/lib/supabase'
import { cogneeAdd, cogneeProcess, formatPostForCognee } from '@/lib/cognee'

export const dynamic = 'force-dynamic'

const SEED_POSTS = [
  {
    type: 'event', title: 'React Summit 2025',
    description: 'Deep dive into React 19 features, Server Components, and the new compiler. Workshops by core team members.',
    tags: ['react', 'javascript', 'frontend', 'workshop'], location: 'Online', start_time: '2025-03-20T10:00:00Z',
    ai_summary: 'A premier React conference featuring React 19 deep-dives, Server Components workshops, and sessions by the core team. Perfect for frontend developers looking to stay ahead.',
  },
  {
    type: 'event', title: 'AI/ML Hackathon — Build with Gemini',
    description: 'Build AI-powered products using Google Gemini API. Prizes worth $10,000. Teams of 1-4.',
    tags: ['ai', 'ml', 'gemini', 'hackathon'], location: 'Hybrid — Mumbai + Online', start_time: '2025-04-05T09:00:00Z',
    ai_summary: 'A competitive hackathon where teams of up to 4 build AI products using Google Gemini. $10,000 in prizes — ideal for ML enthusiasts and product builders.',
  },
  {
    type: 'event', title: 'Python for Data Science Bootcamp',
    description: '3-day intensive bootcamp covering Pandas, NumPy, Matplotlib and scikit-learn. Beginner friendly.',
    tags: ['python', 'data-science', 'ml', 'beginner'], location: 'Bangalore, India', start_time: '2025-03-28T09:00:00Z',
    ai_summary: 'A 3-day beginner-friendly bootcamp covering Python\'s key data science libraries. Hands-on sessions with real datasets, suitable for anyone starting their ML journey.',
  },
  {
    type: 'resource', title: 'Next.js 14 Complete Guide',
    description: 'Comprehensive guide to App Router, Server Actions, caching strategies, and deployment on Vercel.',
    tags: ['nextjs', 'react', 'fullstack', 'guide'], location: '',
    ai_summary: 'A thorough resource covering Next.js 14\'s App Router, Server Actions, and caching. Essential for full-stack developers moving beyond the Pages Router.',
  },
  {
    type: 'resource', title: 'LangChain + RAG: Build a Document Chatbot',
    description: 'Step-by-step tutorial to build a RAG-powered chatbot using LangChain, Pinecone, and OpenAI.',
    tags: ['langchain', 'rag', 'ai', 'tutorial'], location: '',
    ai_summary: 'A practical tutorial demonstrating how to build a document-aware chatbot using LangChain and RAG architecture. Covers ingestion, retrieval, and prompt engineering.',
  },
  {
    type: 'event', title: 'DevConnect — Networking for Developers',
    description: 'Monthly in-person networking event for developers. Lightning talks, demos, and coffee.',
    tags: ['networking', 'community', 'developers'], location: 'Pune, India', start_time: '2025-03-22T18:00:00Z',
    ai_summary: 'A monthly in-person event for developers to network, share demos, and give lightning talks. Great for finding co-founders, collaborators, and mentors.',
  },
  {
    type: 'resource', title: 'System Design Interview Handbook',
    description: 'Free resource covering distributed systems, databases, caching, load balancing and real interview questions.',
    tags: ['system-design', 'interview', 'backend'], location: '',
    ai_summary: 'A comprehensive free handbook on system design concepts—distributed systems, databases, and caching—with real interview questions from top tech companies.',
  },
  {
    type: 'event', title: 'Web3 & Blockchain for Builders',
    description: 'Learn Solidity, smart contracts, and how to ship your first DApp on Ethereum.',
    tags: ['web3', 'blockchain', 'solidity', 'ethereum'], location: 'Online', start_time: '2025-04-10T14:00:00Z',
    ai_summary: 'A hands-on event for developers entering Web3. Covers Solidity basics and smart contract deployment, ending with participants shipping their first DApp.',
  },
  {
    type: 'announcement', title: 'Communify is Now Live! 🚀',
    description: 'Welcome to Communify — your AI-powered community platform. Discover events, find collaborators, and ask our AI anything about your community.',
    tags: ['announcement', 'platform', 'ai'], location: '',
    ai_summary: 'Communify is officially live! Use AI-powered semantic search to discover events, find teammates with matching skills, and get instant answers from the community knowledge assistant.',
  },
  {
    type: 'resource', title: 'Open Source Contribution Guide for Beginners',
    description: 'How to find projects, understand codebases, write good PRs and get your first contribution merged.',
    tags: ['opensource', 'github', 'beginner', 'git'], location: '',
    ai_summary: 'A beginner\'s guide to contributing to open source—from finding the right project to writing clean PRs. Ideal for developers looking to build their portfolio.',
  },
]

export async function GET() {
  try {
    // Ensure demo profile exists
    await supabase.from('profiles').upsert({
      id: DEMO_USER_ID,
      name: 'Communify Demo',
      username: 'demo',
      bio: 'Demo account for hackathon.',
      location: 'India',
      skills: ['React', 'Next.js', 'AI', 'TypeScript'],
      interests: ['AI', 'hackathons', 'open-source'],
      role: 'organizer',
      ai_summary: 'The Communify demo organizer account.',
    })

    const insertedPosts = []

    for (const post of SEED_POSTS) {
      const { data, error } = await supabase
        .from('posts')
        .insert({ ...post, author_id: DEMO_USER_ID, status: 'published' })
        .select()
        .single()

      if (!error && data) {
        insertedPosts.push(data)
        await cogneeAdd(formatPostForCognee(post), 'community-global')
      }
    }

    await cogneeProcess('community-global')

    return NextResponse.json({
      success: true,
      seeded: insertedPosts.length,
      message: 'Seed complete! Cognee is building the knowledge graph...',
    })
  } catch (e) {
    console.error('Seed error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
