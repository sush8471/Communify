'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const SKILL_SUGGESTIONS = [
  'React', 'Next.js', 'TypeScript', 'Python', 'Node.js', 'Rust', 'Go',
  'Machine Learning', 'Data Science', 'UI/UX Design', 'DevOps', 'Kubernetes',
  'Web3', 'Solidity', 'iOS', 'Android', 'Figma', 'GraphQL', 'PostgreSQL',
]

export default function SignupPage() {
  const router = useRouter()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  // Step 1: account
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Step 2: profile
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')

  // Step 3: skills & interests
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [role, setRole] = useState<'member' | 'organizer'>('member')

  function addSkill(s: string) {
    const trimmed = s.trim()
    if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
      setSkills([...skills, trimmed])
    }
    setSkillInput('')
  }

  function removeSkill(s: string) {
    setSkills(skills.filter((sk) => sk !== s))
  }

  async function handleGoogle() {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback?next=/auth/onboarding` },
    })
  }

  async function handleGitHub() {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${location.origin}/auth/callback?next=/auth/onboarding` },
    })
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    setStep(2)
  }

  function handleStep2(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Name is required'); return }
    if (!username.trim()) { setError('Username is required'); return }
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      setError('Username: 3–20 chars, lowercase letters, numbers, underscores only')
      return
    }
    setStep(3)
  }

  async function handleStep3(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Session expired — please sign in again'); setLoading(false); return }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: name.trim(),
      username: username.trim().toLowerCase(),
      bio: bio.trim(),
      location: location.trim(),
      skills,
      interests: skills,
      role,
      ai_summary: `${name} is a ${role} with skills in ${skills.slice(0, 3).join(', ')}.`,
    })

    setLoading(false)
    if (error) { setError(error.message); return }
    router.push('/dashboard')
    router.refresh()
  }

  const progressPct = step === 1 ? 33 : step === 2 ? 66 : 100

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-cyan-500/8 blur-[100px]" />
      </div>

      <div className="w-full max-w-md fade-in">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-lg glow-violet-sm">
              ⚡
            </div>
            <span className="font-bold text-xl gradient-text">Communify</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">
            {step === 1 ? 'Create your account' : step === 2 ? 'Your profile' : 'Skills & role'}
          </h1>
          <p className="text-slate-400 text-sm">
            {step === 1 ? 'Join the AI-powered community platform' : step === 2 ? 'Tell us about yourself' : 'Help us personalise your experience'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-600 mb-2">
            <span className={step >= 1 ? 'text-violet-400' : ''}>Account</span>
            <span className={step >= 2 ? 'text-violet-400' : ''}>Profile</span>
            <span className={step >= 3 ? 'text-violet-400' : ''}>Skills</span>
          </div>
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-6 gradient-border">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={handleGoogle} disabled={loading} className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium text-slate-300 disabled:opacity-50">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button onClick={handleGitHub} disabled={loading} className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium text-slate-300 disabled:opacity-50">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-3 bg-[#0d1320] text-slate-500">or with email</span></div>
              </div>

              <form onSubmit={handleStep1} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                  <input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <input id="signup-password" type={showPw ? 'text' : 'password'} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPw
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      }
                    </button>
                  </div>
                  {/* Strength indicator */}
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`h-0.5 flex-1 rounded-full transition-all ${
                        password.length >= i * 3
                          ? i <= 2 ? 'bg-orange-500' : i === 3 ? 'bg-yellow-400' : 'bg-emerald-400'
                          : 'bg-white/10'
                      }`} />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    {error}
                  </div>
                )}

                <button id="signup-next-1" type="submit" disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold transition-all glow-violet-sm disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</> : 'Continue →'}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-5">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign in</Link>
              </p>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Full name *</label>
                  <input id="signup-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Johnson"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Username *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">@</span>
                    <input id="signup-username" type="text" required value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} placeholder="alex_j"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 pl-7 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Bio</label>
                <textarea id="signup-bio" rows={2} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell the community about yourself…" maxLength={160}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all resize-none" />
                <p className="text-right text-xs text-slate-600 mt-1">{bio.length}/160</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Location</label>
                <input id="signup-location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Mumbai, India"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all" />
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm hover:bg-white/5 transition-all">← Back</button>
                <button id="signup-next-2" type="submit" className="flex-2 flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold transition-all glow-violet-sm">Continue →</button>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-4">
              {/* Role selection */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">I am a…</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['member', 'organizer'] as const).map((r) => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`py-2.5 rounded-xl border text-sm font-medium transition-all capitalize ${
                        role === r
                          ? 'border-violet-500/60 bg-violet-500/15 text-violet-300'
                          : 'border-white/10 text-slate-400 hover:bg-white/5'
                      }`}>
                      {r === 'member' ? '🙋 Community Member' : '🎯 Event Organizer'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Skills <span className="text-slate-600">(up to 10)</span></label>
                <div className="flex flex-wrap gap-1.5 mb-2 min-h-8">
                  {skills.map((s) => (
                    <span key={s} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} className="text-violet-400/60 hover:text-violet-300 transition-colors leading-none">×</button>
                    </span>
                  ))}
                </div>

                <div className="relative">
                  <input
                    id="signup-skill-input"
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) }
                      if (e.key === ',') { e.preventDefault(); addSkill(skillInput) }
                    }}
                    placeholder="Type a skill and press Enter…"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
                    disabled={skills.length >= 10}
                  />
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
                    <button key={s} type="button" onClick={() => addSkill(s)}
                      className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 text-xs hover:border-violet-500/40 hover:text-violet-300 hover:bg-violet-500/10 transition-all">
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm hover:bg-white/5 transition-all">← Back</button>
                <button id="signup-finish" type="submit" disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold transition-all glow-violet-sm disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Setting up…</> : '🚀 Join Communify'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
