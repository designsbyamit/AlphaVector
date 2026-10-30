import type { Metadata } from 'next'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/newsreader/wght-italic.css'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: { default: 'AlphaVector: three signals, one fix on your calling', template: '%s · AlphaVector' },
  description: 'AlphaVector fixes your career position from three signals: what your projects prove, what pulls you, and what the market wants. Then it gives you the route.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
