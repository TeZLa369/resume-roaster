import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Resume Roaster 🔥 — Brutal Honest Feedback',
  description: 'Upload your resume. Get roasted. Get hired.',
  openGraph: {
    title: 'Resume Roaster 🔥',
    description: 'Upload your resume. Get roasted. Get hired.',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="noise">
        <div className="flame-bg" />
        {children}
      </body>
    </html>
  )
}
