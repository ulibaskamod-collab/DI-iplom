import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>
        <Providers>  {/* ← ОБЁРНИТЕ ВСЁ В Providers */}
          {children}
        </Providers>
      </body>
    </html>
  )
}