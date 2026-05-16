'use client'

import { useEffect, useState } from 'react'

const BURN_LINES = [
  'Scanning for buzzwords...',
  'Counting synergies...',
  'Measuring gap between skills and claims...',
  'Checking if "proficient in Excel" means you know VLOOKUP...',
  'Estimating resume padding density...',
  'Calculating cringe coefficient...',
  'Consulting the hiring gods...',
  'Preparing the burns...',
  'Almost done roasting...',
]

export default function LoadingRoast() {
  const [lineIndex, setLineIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const lineTimer = setInterval(() => {
      setLineIndex(i => (i + 1) % BURN_LINES.length)
    }, 2200)

    const progressTimer = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 3, 92))
    }, 150)

    return () => {
      clearInterval(lineTimer)
      clearInterval(progressTimer)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Flame */}
      <div className="relative mb-8">
        <div className="text-8xl flame-icon animate-pulse-flame">🔥</div>
        <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full" />
      </div>

      {/* Title */}
      <h2
        className="text-4xl text-white mb-2 tracking-widest"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        ROASTING...
      </h2>

      {/* Animated line */}
      <p
        className="text-orange-400/70 text-sm mb-8 h-5 typing-cursor transition-all duration-500"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {BURN_LINES[lineIndex]}
      </p>

      {/* Progress bar */}
      <div className="w-64 bg-white/5 rounded-full overflow-hidden h-1 mb-3">
        <div
          className="h-full bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-white/20 text-xs font-mono">{Math.round(progress)}%</p>
    </div>
  )
}
