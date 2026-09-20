'use client'
import { useEffect, useState } from 'react'
import { supabase, DEMO_USER_ID, type Profile, type Post } from '@/lib/supabase'
import { TopBar } from '@/components/layout/TopBar'
import { LeftSidebar, MobileNav } from '@/components/layout/Sidebar'
import { AIChatWidget } from '@/components/ai/AIChatWidget'
import Link from 'next/link'

const SKILL_COLORS = [
  'bg-[#8b5cf6]/15 text-[#c4b5fd] border-[#8b5cf6]/30',
  'bg-[#3b82f6]/15 text-[#93c5fd] border-[#3b82f6]/30',
  'bg-[#10b981]/15 text-[#6ee7b7] border-[#10b981]/30',
  'bg-[#f59e0b]/15 text-[#fcd34d] border-[#f59e0b]/30',
]

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-3 text-center shadow-sm">
      <p className="text-lg font-bold text-white font-mono">{value}</p>
      <p className="text-xs text-[#6b6b6b] mt-0.5">{label}</p>
    </div>
  )
}

function EditModal({
  profile,
  onClose,
  onSaved,
}: {
  profile: Profile
  onClose: () => void
  onSaved: (p: Profile) => void
}) {
  const [name, setName] = useState(profile.name || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [location, setLocation] = useState(profile.location || '')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<string[]>(profile.skills || [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function addSkill(s: string) {
    const t = s.trim()
    if (t && !skills.includes(t) && skills.length < 15) setSkills([...skills, t])
    setSkillInput('')
  }

  async function save() {
    setSaving(true)
    setError('')
    const { error, data } = await supabase
      .from('profiles')
      .update({ name, bio, location, skills })
      .eq('id', profile.id)
      .select()
      .single()
    setSaving(false)
    if (error) { setError(error.message); return }
    if (data) onSaved(data as Profile)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 bg-[#0a0a0a] rounded-xl p-6 w-full max-w-lg border border-[#1f1f1f] shadow-[0_24px_48px_0_rgba(0,0,0,0.8)] slide-up">
        <h2 className="text-lg font-bold text-white mb-4">Edit Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-[#a1a1a1] uppercase tracking-wider block mb-1.5">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#111111] border border-[#1f1f1f] rounded-md px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#a1a1a1] uppercase tracking-wider block mb-1.5">
              Bio <span className="text-[#6b6b6b]">({bio.length}/160)</span>
            </label>
            <textarea
              rows={2}
              maxLength={160}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#111111] border border-[#1f1f1f] rounded-md px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-all resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#a1a1a1] uppercase tracking-wider block mb-1.5">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#111111] border border-[#1f1f1f] rounded-md px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#a1a1a1] uppercase tracking-wider block mb-1.5">Skills</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((s) => (
                <span key={s} className="font-mono text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-[#c4b5fd]">
                  {s}
                  <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} className="text-[#8b5cf6] hover:text-white leading-none">×</button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(skillInput) } }}
              placeholder="Type skill and press Enter"
              className="w-full bg-[#111111] border border-[#1f1f1f] rounded-md px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
            />
          </div>
        </div>

        {error && <p className="text-[#ef4444] text-xs mt-3 font-mono">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-md border border-[#1f1f1f] bg-[#111111] text-[#a1a1a1] text-xs font-medium hover:text-white hover:bg-[#161616] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 py-2 rounded-md bg-[#8b5cf6] hover:bg-[#a78bfa] text-white text-xs font-semibold shadow-[0_0_8px_rgba(139,92,246,0.3)] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PostRow({ post }: { post: Post }) {
  const typeColors: Record<string, string> = {
    event: 'bg-[#8b5cf6]/15 text-[#c4b5fd] border-[#8b5cf6]/30',
    resource: 'bg-[#3b82f6]/15 text-[#93c5fd] border-[#3b82f6]/30',
    announcement: 'bg-[#f59e0b]/15 text-[#fcd34d] border-[#f59e0b]/30',
  }

  return (
    <div className="bg-[#0a0a0a] hover:bg-[#111111] border border-[#1f1f1f] hover:border-[#2e2e2e] rounded-lg p-4 transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 px-2 py-0.5 rounded border text-[11px] font-mono font-medium capitalize ${typeColors[post.type] || 'bg-[#161616] text-[#a1a1a1] border-[#1f1f1f]'}`}>
          {post.type}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{post.title}</p>
          <p className="text-xs text-[#6b6b6b] mt-0.5 line-clamp-1">{post.ai_summary || post.description}</p>
        </div>
        <span className="text-xs font-mono text-[#6b6b6b] whitespace-nowrap">
          {new Date(post.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  )
}

// Fallback demo profile
const FALLBACK_PROFILE: Profile = {
  id: DEMO_USER_ID,
  name: 'Communify Demo',
  username: 'demo',
  bio: 'AI-powered community platform built at a hackathon 🚀',
  location: 'India',
  avatar_url: '',
  skills: ['React', 'Next.js', 'TypeScript', 'AI', 'Cognee'],
  interests: ['AI', 'hackathons', 'open-source'],
  role: 'organizer',
  ai_summary: 'Communify Demo is an organizer with expertise in React, Next.js, and AI. Passionate about building community tools.',
  created_at: new Date().toISOString(),
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(FALLBACK_PROFILE)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)
  const [activeTab, setActiveTab] = useState<'activity' | 'skills'>('activity')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    setLoading(true)
    const [{ data: prof }, { data: postsData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', DEMO_USER_ID).single(),
      supabase.from('posts').select('*').eq('author_id', DEMO_USER_ID).order('created_at', { ascending: false }).limit(20),
    ])

    if (prof) setProfile(prof as Profile)
    if (postsData) setPosts(postsData as Post[])
    setLoading(false)
  }

  const initials = profile.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'CD'

  const roleLabel = profile.role === 'organizer' ? '🎯 Organizer' : '🙋 Member'

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <TopBar />
      <div className="flex flex-1 max-w-[1400px] mx-auto w-full">
        <LeftSidebar />

        <main className="flex-1 py-6 px-4 sm:px-6 max-w-3xl mx-auto w-full">
          {/* Profile Hero Card */}
          <div className="bg-[#0a0a0a] rounded-lg p-6 border border-[#1f1f1f] mb-6 fade-in shadow-[0_2px_4px_0_rgba(0,0,0,0.5)]">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name} className="w-16 h-16 rounded-lg object-cover border border-[#8b5cf6]/40" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center text-xl font-bold text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]">
                    {initials}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10b981] border-2 border-black" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-white">{profile.name}</h1>
                  <span className="px-2 py-0.5 rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-[#c4b5fd] font-mono text-[11px]">{roleLabel}</span>
                </div>
                <p className="text-xs font-mono text-[#6b6b6b] mt-0.5">@{profile.username}</p>
                {profile.bio && <p className="text-sm text-[#a1a1a1] mt-2 leading-relaxed">{profile.bio}</p>}
                {profile.location && (
                  <p className="flex items-center gap-1.5 text-xs text-[#6b6b6b] mt-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location}
                  </p>
                )}
              </div>

              {/* Edit button */}
              <button
                id="edit-profile-btn"
                onClick={() => setShowEdit(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111111] border border-[#1f1f1f] hover:border-[#2e2e2e] hover:bg-[#161616] text-[#a1a1a1] hover:text-white text-xs font-medium transition-all shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </div>

            {/* AI Summary Banner */}
            {profile.ai_summary && (
              <div className="mt-4 flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20">
                <span className="text-sm">✨</span>
                <p className="text-xs text-[#c4b5fd] leading-relaxed">{profile.ai_summary}</p>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-6 fade-in">
            <StatCard value={posts.length} label="Posts" />
            <StatCard value={profile.skills?.length ?? 0} label="Skills" />
            <StatCard value={new Date(profile.created_at).toLocaleDateString('en', { month: 'short', year: '2-digit' })} label="Joined" />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 p-1 bg-[#0a0a0a] rounded-lg border border-[#1f1f1f] mb-6 w-fit">
            {(['activity', 'skills'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-[#161616] text-white border border-[#2e2e2e] shadow-sm'
                    : 'text-[#6b6b6b] hover:text-[#a1a1a1]'
                }`}
              >
                {tab === 'activity' ? '📋 Activity' : '🛠 Skills'}
              </button>
            ))}
          </div>

          {/* Tab: Activity */}
          {activeTab === 'activity' && (
            <div className="space-y-2.5 fade-in">
              {posts.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-10 text-center">
                  <p className="text-3xl mb-3">📝</p>
                  <p className="text-[#a1a1a1] text-sm">No community posts yet.</p>
                  <Link href="/organizer/create-event" className="mt-3 inline-block text-xs font-mono text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">
                    Create your first post →
                  </Link>
                </div>
              ) : (
                posts.map((p) => <PostRow key={p.id} post={p} />)
              )}
            </div>
          )}

          {/* Tab: Skills */}
          {activeTab === 'skills' && (
            <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-5 fade-in">
              {profile.skills && profile.skills.length > 0 ? (
                <>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#6b6b6b] mb-3">
                    Active Skills ({profile.skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s, i) => (
                      <span key={s} className={`font-mono text-xs px-3 py-1.5 rounded-md border font-medium ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowEdit(true)}
                    className="mt-4 text-xs font-mono text-[#a78bfa] hover:text-[#c4b5fd] transition-colors"
                  >
                    + Add or edit skills
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-3xl mb-3">🛠</p>
                  <p className="text-[#a1a1a1] text-sm mb-3">No skills listed yet.</p>
                  <button onClick={() => setShowEdit(true)} className="text-xs font-mono text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">
                    Add your skills →
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <AIChatWidget />
      <MobileNav />

      {showEdit && (
        <EditModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => setProfile(updated)}
        />
      )}
    </div>
  )
}
