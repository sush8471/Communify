'use client'
import { useEffect, useState } from 'react'
import { supabase, DEMO_USER_ID, type Profile, type Post } from '@/lib/supabase'
import { TopBar } from '@/components/layout/TopBar'
import { LeftSidebar, MobileNav } from '@/components/layout/Sidebar'
import { AIChatWidget } from '@/components/ai/AIChatWidget'
import Link from 'next/link'

const SKILL_COLORS = [
  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'bg-pink-500/20 text-pink-300 border-pink-500/30',
]

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="glass rounded-xl px-4 py-3 text-center">
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 glass rounded-2xl p-6 w-full max-w-lg border border-white/10 slide-up">
        <h2 className="text-lg font-bold text-white mb-4">Edit Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1.5">Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1.5">Bio <span className="text-slate-600">{bio.length}/160</span></label>
            <textarea rows={2} maxLength={160} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all resize-none" />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1.5">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all" />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1.5">Skills</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((s) => (
                <span key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs">
                  {s}
                  <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} className="text-violet-400/60 hover:text-violet-300 leading-none">×</button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(skillInput) } }}
              placeholder="Type skill + Enter"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm hover:bg-white/5 transition-all">Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold transition-all glow-violet-sm disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</> : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PostRow({ post }: { post: Post }) {
  const typeColors: Record<string, string> = {
    event: 'bg-cyan-500/15 text-cyan-400',
    resource: 'bg-emerald-500/15 text-emerald-400',
    announcement: 'bg-violet-500/15 text-violet-400',
  }
  return (
    <div className="glass rounded-xl p-4 glass-hover cursor-pointer">
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 px-2 py-0.5 rounded-md text-xs font-medium ${typeColors[post.type] || 'bg-white/10 text-slate-400'}`}>
          {post.type}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{post.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{post.ai_summary || post.description}</p>
        </div>
        <span className="text-xs text-slate-600 whitespace-nowrap">
          {new Date(post.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  )
}

// Fallback demo profile (shown if DB row doesn't exist yet)
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

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <LeftSidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
            <div className="glass rounded-2xl h-48 shimmer mb-4" />
            <div className="glass rounded-xl h-24 shimmer mb-3" />
            <div className="glass rounded-xl h-24 shimmer" />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#080c14]">
      <LeftSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
          {/* Profile Hero */}
          <div className="glass rounded-2xl p-6 gradient-border mb-5 fade-in">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name} className="w-20 h-20 rounded-2xl object-cover ring-2 ring-violet-500/30" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white glow-violet-sm">
                    {initials}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#080c14]" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-white">{profile.name}</h1>
                  <span className="px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-xs">{roleLabel}</span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">@{profile.username}</p>
                {profile.bio && <p className="text-sm text-slate-400 mt-2 leading-relaxed">{profile.bio}</p>}
                {profile.location && (
                  <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-medium transition-all shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </div>

            {/* AI summary */}
            {profile.ai_summary && (
              <div className="mt-4 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-violet-500/8 border border-violet-500/15">
                <span className="text-sm">✨</span>
                <p className="text-xs text-slate-400 leading-relaxed">{profile.ai_summary}</p>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5 fade-in">
            <StatCard value={posts.length} label="Posts" />
            <StatCard value={profile.skills?.length ?? 0} label="Skills" />
            <StatCard value={new Date(profile.created_at).toLocaleDateString('en', { month: 'short', year: '2-digit' })} label="Joined" />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 glass rounded-xl mb-5 w-fit">
            {(['activity', 'skills'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  activeTab === tab ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'text-slate-500 hover:text-slate-300'
                }`}>
                {tab === 'activity' ? '📋 Activity' : '🛠 Skills'}
              </button>
            ))}
          </div>

          {/* Tab: Activity */}
          {activeTab === 'activity' && (
            <div className="space-y-2 fade-in">
              {posts.length === 0 ? (
                <div className="glass rounded-2xl p-10 text-center">
                  <p className="text-3xl mb-3">📝</p>
                  <p className="text-slate-400 text-sm">No posts yet.</p>
                  <Link href="/organizer/create-event" className="mt-3 inline-block text-xs text-violet-400 hover:text-violet-300 transition-colors">
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
            <div className="glass rounded-2xl p-5 fade-in">
              {profile.skills && profile.skills.length > 0 ? (
                <>
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Skills ({profile.skills.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s, i) => (
                      <span key={s} className={`px-3 py-1.5 rounded-full border text-sm font-medium ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => setShowEdit(true)} className="mt-4 text-xs text-violet-400 hover:text-violet-300 transition-colors">
                    + Add or edit skills
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-3xl mb-3">🛠</p>
                  <p className="text-slate-400 text-sm mb-3">No skills listed yet.</p>
                  <button onClick={() => setShowEdit(true)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Add your skills →</button>
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
