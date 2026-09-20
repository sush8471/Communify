import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Communify — Discover. Connect. Collaborate.',
  description:
    'AI-powered community platform. Find relevant events, resources, and collaborators with semantic search and intelligent matching.',
  keywords: ['community', 'AI', 'events', 'collaboration', 'hackathon', 'networking'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
