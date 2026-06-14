import type { Metadata } from 'next'
import { ThemeProvider } from '@/src/context/ThemeContext'
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
        <ThemeProvider>
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}