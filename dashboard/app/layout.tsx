import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SEPE Dashboard — oh-my-pmf',
  description: 'Real-time SEPE engine status dashboard for autonomous PMF discovery',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen`}>
        <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-white tracking-tight">SEPE</span>
              <span className="text-gray-500 text-sm">oh-my-pmf</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Hakathon: 2026-03-29</span>
              <a href="/" className="hover:text-white transition-colors">Dashboard</a>
              <a href="/validator" className="hover:text-white transition-colors">Validator v2</a>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
