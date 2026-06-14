'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import HomePageAllSigns from './(home)/page'

export default function Page() {
  const { data: session, status } = useSession()
  const [userZodiacSlug, setUserZodiacSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Проверяем API
      fetch('/api/user/zodiac')
        .then(res => res.json())
        .then(data => {
          console.log('Zodiac API response:', data)
          setDebugInfo(data)
          if (data.slug) {
            setUserZodiacSlug(data.slug)
          }
        })
        .catch(err => console.error('Error:', err))
        .finally(() => setLoading(false))
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  // Диагностическая информация (временно)
  if (status === 'authenticated' && debugInfo) {
    console.log('Debug:', debugInfo)
  }

  if (status === 'unauthenticated') {
    return <HomePageAllSigns />
  }

  // Если знак не найден - показываем профиль с предложением заполнить дату
  if (!userZodiacSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⭐</div>
          <p className="text-white text-lg mb-2">Не удалось определить ваш знак зодиака</p>
          <p className="text-white/50 text-sm mb-6">
            {debugInfo?.message || 'Заполните дату рождения в профиле'}
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              href="/profile" 
              className="px-6 py-2 bg-pink-500 rounded-full text-white hover:bg-pink-600 transition"
            >
              Заполнить профиль
            </Link>
            <Link 
              href="/zodiac" 
              className="text-purple-400 hover:text-purple-300 transition"
            >
              ← Перейти ко всем знакам
            </Link>
          </div>
          {debugInfo && (
            <pre className="mt-6 text-left text-xs text-white/30 bg-white/5 p-3 rounded-lg overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}
        </div>
      </div>
    )
  }

  // Перенаправляем на страницу знака
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Ваш знак: {debugInfo?.zodiac_sign || 'Загрузка...'}
        </h1>
        <Link 
          href={`/zodiac/${userZodiacSlug}`}
          className="inline-block mt-6 px-6 py-2 bg-pink-500 rounded-full text-white hover:bg-pink-600"
        >
          Перейти к странице знака →
        </Link>
      </div>
    </div>
  )
}