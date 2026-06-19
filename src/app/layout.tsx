import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '../components/Navigation'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'StellarFit | Звёздный стиль',
  description: 'Персонализированные рекомендации по стилю на основе знака зодиака',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="stars-container" id="starsCanvas" />
        <Providers>
          <Navigation />
          <main className="pt-20">{children}</main>
        </Providers>
      </body>
    </html>
  )
}