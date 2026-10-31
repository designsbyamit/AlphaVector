// app/layout.tsx
import type { Metadata } from 'next'
import { Sora, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { WingspanProvider } from '@/context/WingspanContext'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AlphaVector: your Future Blueprint',
  description: 'Your next move deserves more than a guess. For designers: see your strengths, explore career possibilities and choose your next move.',
  verification: {
    google: 'oLN6nHM8tsRnwQYdaYN9reXxItorFTB6FWE0in8dAtQ',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply a saved theme before first paint so every screen, including the Blueprint, uses the same one. Dark is the default. */}
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('alphavector-theme-v2')==='light')document.documentElement.classList.add('light')}catch(e){}" }} />
      </head>
      <body>
        <WingspanProvider>{children}</WingspanProvider>
      </body>
    </html>
  )
}
