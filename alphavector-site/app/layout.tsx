import type { Metadata } from 'next'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: { default: 'AlphaVector: your next move deserves more than a guess', template: '%s · AlphaVector' },
  description: 'For designers: connect your experience, your interests and where the industry is heading to see your strengths, explore career possibilities and choose your next move.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-signal focus:px-4 focus:py-2 focus:text-on-signal">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
