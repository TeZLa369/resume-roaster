'use client'

import { useState } from 'react'
import type { RoastData } from '@/app/page'

type Props = {
  data: RoastData
  onReset: () => void
}

const SCORE_COLORS = {
  low: { text: 'text-red-400', bg: 'bg-red-500', shadow: 'shadow-red-500/20' },
  mid: { text: 'text-orange-400', bg: 'bg-orange-500', shadow: 'shadow-orange-500/20' },
  high: { text: 'text-green-400', bg: 'bg-green-500', shadow: 'shadow-green-500/20' },
}

function getScoreColor(score: number) {
  if (score < 40) return SCORE_COLORS.low
  if (score < 70) return SCORE_COLORS.mid
  return SCORE_COLORS.high
}

export default function RoastResults({ data, onReset }: Props) {
  const [activeTab, setActiveTab] = useState<'roast' | 'fix'>('roast')
  const colors = getScoreColor(data.score)

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 space-y-6">

      {/* Score Card */}
      <div className="result-card rounded-2xl p-8 text-center burn-in">
        <div className="flex flex-col items-center gap-4">
          {/* Score Circle */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={data.score < 40 ? '#f87171' : data.score < 70 ? '#fb923c' : '#4ade80'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - data.score / 100)}`}
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${colors.text}`} style={{ fontFamily: 'var(--font-display)' }}>
                {data.score}
              </span>
              <span className="text-white/30 text-xs font-mono">/100</span>
            </div>
          </div>

          <div>
            <p className={`text-2xl font-bold tracking-widest ${colors.text}`} style={{ fontFamily: 'var(--font-display)' }}>
              {data.scoreLabel.toUpperCase()}
            </p>
            <p className="text-white/60 text-sm mt-2 max-w-md italic" style={{ fontFamily: 'var(--font-body)' }}>
              "{data.roastHeadline}"
            </p>
          </div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex rounded-xl overflow-hidden border border-white/10 p-1 bg-white/5 burn-in burn-in-delay-1">
        <button
          onClick={() => setActiveTab('roast')}
          className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
            activeTab === 'roast'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'text-white/40 hover:text-white/70'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          🔥 The Roast
        </button>
        <button
          onClick={() => setActiveTab('fix')}
          className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
            activeTab === 'fix'
              ? 'bg-green-600 text-white shadow-lg shadow-green-500/20'
              : 'text-white/40 hover:text-white/70'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          ✅ The Fixes
        </button>
      </div>

      {/* Issues List */}
      <div className="space-y-3 burn-in burn-in-delay-2">
        {data.roasts.map((item, i) => (
          <div key={i} className="result-card rounded-xl overflow-hidden">
            {/* Issue Header */}
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3">
              <span className="text-white/20 font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-white/70 text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>
                {item.issue}
              </span>
            </div>

            <div className="px-5 py-4">
              {activeTab === 'roast' ? (
                <p className="text-orange-300 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  🔥 {item.burn}
                </p>
              ) : (
                <p className="text-green-300 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  ✅ {item.fix}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Biggest Win */}
      <div className="result-card rounded-xl p-5 border-green-500/20 burn-in burn-in-delay-3" style={{ borderColor: 'rgba(74, 222, 128, 0.15)' }}>
        <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-2">Biggest Win 🏆</p>
        <p className="text-green-300 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
          {data.biggestWin}
        </p>
      </div>

      {/* Hiring Manager Verdict */}
      <div className="result-card rounded-xl p-5">
        <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-3">Hiring Manager's Verdict 👔</p>
        <p className="text-white/70 text-sm leading-relaxed italic" style={{ fontFamily: 'var(--font-body)' }}>
          "{data.hiringManagerVerdict}"
        </p>
      </div>

      {/* Top Priority */}
      <div className="rounded-xl p-5 bg-orange-500/10 border border-orange-500/25">
        <p className="text-orange-400/60 text-xs font-mono uppercase tracking-widest mb-2">Fix This First ⚡</p>
        <p className="text-orange-200 text-sm font-medium leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
          {data.topPriority}
        </p>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full py-4 rounded-xl border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all text-sm tracking-widest"
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.15em' }}
      >
        🔄 ROAST ANOTHER RESUME
      </button>
    </div>
  )
}
