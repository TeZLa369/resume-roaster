'use client'

import { useState, useRef, useCallback } from 'react'
import UploadZone from '@/components/UploadZone'
import RoastResults from '@/components/RoastResults'
import LoadingRoast from '@/components/LoadingRoast'

export type RoastData = {
  score: number
  scoreLabel: string
  roastHeadline: string
  roasts: Array<{ issue: string; burn: string; fix: string }>
  biggestWin: string
  hiringManagerVerdict: string
  topPriority: string
}

export default function Home() {
  const [state, setState] = useState<'idle' | 'loading' | 'results' | 'error'>('idle')
  const [roastData, setRoastData] = useState<RoastData | null>(null)
  const [error, setError] = useState('')
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleRoast = useCallback(async (text: string) => {
    setState('loading')
    setError('')

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setRoastData(data)
      setState('results')

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setState('error')
    }
  }, [])

  const handleReset = () => {
    setState('idle')
    setRoastData(null)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="relative z-10 min-h-screen">
      {/* Header */}
      <header className="text-center pt-16 pb-8 px-4">
        <div className="inline-block mb-4">
          <span className="text-7xl flame-icon">🔥</span>
        </div>
        <h1
          className="text-[clamp(3rem,10vw,7rem)] leading-none tracking-wider text-white mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          RESUME ROASTER
        </h1>
        <p
          className="text-[clamp(0.95rem,2.5vw,1.2rem)] text-orange-300/70 max-w-lg mx-auto font-light tracking-wide"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Upload your resume. Brace yourself. Get brutally honest feedback that actually gets you hired.
        </p>

        {/* Divider */}
        <div className="mt-8 mx-auto max-w-xs section-divider" />
      </header>

      {/* Upload Section */}
      {(state === 'idle' || state === 'error') && (
        <section className="px-4 pb-16 max-w-2xl mx-auto">
          <UploadZone onRoast={handleRoast} />
          {state === 'error' && (
            <div className="mt-4 p-4 rounded-lg border border-red-500/30 bg-red-900/10 text-center">
              <p className="text-red-400 font-mono text-sm">⚠ {error}</p>
              <p className="text-red-300/50 text-xs mt-1">Check your API key or try again.</p>
            </div>
          )}
        </section>
      )}

      {/* Loading */}
      {state === 'loading' && <LoadingRoast />}

      {/* Results */}
      {state === 'results' && roastData && (
        <div ref={resultsRef}>
          <RoastResults data={roastData} onReset={handleReset} />
        </div>
      )}

      {/* Footer */}
      <footer className="text-center pb-8 px-4">
        <p className="text-white/15 text-xs font-mono">
          Powered by OpenRouter · Llama 3.3 70B · Built with Next.js
        </p>
      </footer>
    </main>
  )
}
