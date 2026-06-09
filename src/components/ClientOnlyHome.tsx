'use client'

import dynamic from 'next/dynamic'

// Динамически импортируем главную страницу с отключенным SSR
const HomePageContent = dynamic(() => import('@/src/app/(home)/page'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    </div>
  ),
})

export default function ClientOnlyHome() {
  return <HomePageContent />
}