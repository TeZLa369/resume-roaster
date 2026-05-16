'use client'

import { useState, useRef, useCallback } from 'react'

type Props = {
  onRoast: (text: string) => void
}

export default function UploadZone({ onRoast }: Props) {
  const [mode, setMode] = useState<'upload' | 'paste'>('upload')
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [pasteText, setPasteText] = useState('')
  const [fileText, setFileText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
      // For PDF, we'll send it as base64 and let the browser handle basic extraction
      // For a real app, use pdf-parse on the server side
      const arrayBuffer = await file.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      let text = ''
      // Basic PDF text extraction - look for text between BT/ET markers
      const decoder = new TextDecoder('latin1')
      const raw = decoder.decode(bytes)
      const matches = raw.match(/\(([^)]{2,})\)/g) || []
      text = matches
        .map(m => m.slice(1, -1))
        .filter(t => /[a-zA-Z]{2,}/.test(t))
        .join(' ')
      return text.length > 100 ? text : `[PDF: ${file.name}] — Please paste the text content manually for best results.`
    } else {
      // Plain text / docx fallback
      return await file.text()
    }
  }

  const handleFile = useCallback(async (file: File) => {
    if (!file) return
    const validTypes = ['application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const isValid = validTypes.includes(file.type) || file.name.match(/\.(pdf|txt|doc|docx)$/i)
    if (!isValid) {
      alert('Please upload a PDF, TXT, DOC, or DOCX file.')
      return
    }
    setFileName(file.name)
    const text = await extractTextFromFile(file)
    setFileText(text)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleSubmit = () => {
    const text = mode === 'upload' ? fileText : pasteText
    if (!text || text.trim().length < 50) {
      alert('Please provide more resume content (at least 50 characters).')
      return
    }
    onRoast(text)
  }

  const canSubmit = mode === 'upload' ? fileText.length > 50 : pasteText.trim().length > 50

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex rounded-lg overflow-hidden border border-white/10 p-1 bg-white/5">
        {(['upload', 'paste'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
              mode === m
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-white/40 hover:text-white/70'
            }`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {m === 'upload' ? '📄 Upload File' : '✏️ Paste Text'}
          </button>
        ))}
      </div>

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div
          className={`drop-zone rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {fileName ? (
            <div className="space-y-3">
              <div className="text-5xl">📄</div>
              <p className="text-orange-400 font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                {fileName}
              </p>
              <p className="text-white/40 text-sm">
                {fileText.length > 100
                  ? `✓ ${fileText.length.toLocaleString()} characters extracted`
                  : '⚠ Limited text extracted — try paste mode for PDFs'}
              </p>
              <p className="text-white/25 text-xs">Click to change file</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl opacity-40">📁</div>
              <div>
                <p className="text-white/70 font-medium mb-1" style={{ fontFamily: 'var(--font-body)' }}>
                  Drop your resume here
                </p>
                <p className="text-white/30 text-sm">PDF, TXT, DOC, DOCX · Click to browse</p>
              </div>
              <p className="text-orange-500/50 text-xs font-mono">
                💡 For PDFs, "Paste Text" mode gives better results
              </p>
            </div>
          )}
        </div>
      )}

      {/* Paste Mode */}
      {mode === 'paste' && (
        <div className="relative">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your entire resume here...

Name, contact info, work experience, education, skills — the whole thing. The more content you paste, the more specific and useful the roast will be."
            className="w-full h-72 bg-white/5 border border-white/10 rounded-xl p-4 text-white/80 text-sm resize-none focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all placeholder-white/20"
            style={{ fontFamily: 'var(--font-mono)', lineHeight: '1.7' }}
          />
          <div className="absolute bottom-3 right-3 text-white/20 text-xs font-mono">
            {pasteText.length} chars
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-4 rounded-xl font-bold text-lg tracking-widest transition-all duration-300 relative overflow-hidden group ${
          canSubmit
            ? 'bg-orange-500 text-white hover:bg-orange-400 shadow-xl shadow-orange-500/25 hover:shadow-orange-400/35 cursor-pointer'
            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
        }`}
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.15em' }}
      >
        {canSubmit && (
          <span className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-300/20 to-orange-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        )}
        🔥 ROAST MY RESUME
      </button>

      <p className="text-center text-white/20 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
        Your resume is not stored. Analysis happens in real-time.
      </p>
    </div>
  )
}
