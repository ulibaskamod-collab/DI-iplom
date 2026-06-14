import type { Metadata } from 'next'
import Navigation from '@/src/components/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'StellarFit - Астрология стиля',
  description: 'Подбери свой идеальный образ по знаку зодиака',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}