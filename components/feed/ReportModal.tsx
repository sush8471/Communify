'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  postTitle: string
}

const REPORT_REASONS = [
  { id: 'misleading', label: 'Misleading or False Information', desc: 'Outdated dates, fake links, or incorrect facts' },
  { id: 'duplicate', label: 'Duplicate Content', desc: 'Already posted recently by another member' },
  { id: 'inappropriate', label: 'Inappropriate or Offensive', desc: 'Violates community guidelines or contains abusive language' },
  { id: 'spam', label: 'Spam or Unauthorized Promotion', desc: 'Irrelevant advertisement or repetitive promotional content' },
]

export function ReportModal({ isOpen, onClose, postId, postTitle }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('misleading')
  const [details, setDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate brief network reporting (or post to Supabase)
    await new Promise((r) => setTimeout(r, 600))
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white">Report Submitted</h4>
            <p className="text-sm text-slate-400">
              Thank you for keeping our community safe. Our moderators will review this post shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-rose-400 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Community Moderation</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Report Content</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                Post: <span className="text-slate-300 font-medium">"{postTitle}"</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Reason for reporting
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                      selectedReason === r.id
                        ? 'bg-rose-500/10 border-rose-500/40 text-white'
                        : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.04]'
                    )}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.id}
                      checked={selectedReason === r.id}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mt-0.5 text-rose-500 focus:ring-rose-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-200">{r.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                placeholder="Provide more context for moderators..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-rose-600 text-white hover:bg-rose-500 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
