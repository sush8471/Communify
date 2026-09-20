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
    await new Promise((r) => setTimeout(r, 600))
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in">
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-[#1f1f1f] rounded-xl p-6 shadow-[0_24px_48px_0_rgba(0,0,0,0.7)] slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6b6b6b] hover:text-white p-1 rounded hover:bg-[#111111] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center mx-auto border border-[#10b981]/30 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white">Report Submitted</h4>
            <p className="text-sm text-[#a1a1a1]">
              Thank you for keeping our community safe. Our moderators will review this post shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-[#ef4444] text-xs font-mono font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>COMMUNITY MODERATION</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Report Content</h3>
              <p className="text-xs text-[#6b6b6b] mt-1 line-clamp-1">
                Target: <span className="text-[#a1a1a1] font-medium">"{postTitle}"</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[#a1a1a1] uppercase tracking-wider block">
                Reason for reporting
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                      selectedReason === r.id
                        ? 'bg-[#ef4444]/10 border-[#ef4444]/40 text-white'
                        : 'bg-[#111111] border-[#1f1f1f] text-[#a1a1a1] hover:bg-[#161616] hover:border-[#2e2e2e]'
                    )}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.id}
                      checked={selectedReason === r.id}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mt-0.5 text-[#ef4444] focus:ring-[#ef4444]"
                    />
                    <div>
                      <div className="text-sm font-medium text-white">{r.label}</div>
                      <div className="text-xs text-[#6b6b6b] mt-0.5">{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-[#a1a1a1] uppercase tracking-wider block mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                placeholder="Provide context for moderators..."
                className="w-full bg-[#111111] border border-[#1f1f1f] rounded-md px-3 py-2 text-sm text-white placeholder-[#4a4a4a] focus:outline-none focus:border-[#8b5cf6]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-md text-sm font-medium bg-[#111111] border border-[#1f1f1f] text-[#a1a1a1] hover:text-white hover:bg-[#161616] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 rounded-md text-sm font-medium bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors disabled:opacity-50"
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
