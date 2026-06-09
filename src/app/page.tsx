'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import HomePageAllSigns from './(home)/page'
import UserZodiacPage from '@/components/UserZodiacPage'

export default function Page() {
  const { data: session, status } = useSession()
  const [userZodiacSlug, setUserZodiacSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetch('/api/user/zodiac')
        .then(res => res.json())
        .then(data => {
          console.log('Zodiac API response:', data)
          if (data.slug) {
            setUserZodiacSlug(data.slug)
          } else if (data.error) {
            setError(data.message || 'Не удалось определить знак')
          } else {
            setError('Знак зодиака не найден. Заполните дату рождения в профиле.')
          }
        })
        .catch(err => {
          console.error('Error fetching zodiac:', err)
          setError('Ошибка загрузки знака зодиака')
        })
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

  // Если пользователь не авторизован - показываем все знаки
  if (status === 'unauthenticated') {
    return <HomePageAllSigns />
  }

  // Если есть ошибка - показываем сообщение и ссылку на профиль
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-white text-lg mb-4">{error}</p>
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
        </div>
      </div>
    )
  }

  // Если знак не найден
  if (!userZodiacSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center">
          <p className="text-white mb-4">Не удалось определить ваш знак зодиака</p>
          <Link href="/profile" className="text-pink-400 hover:text-pink-300">
            Заполните дату рождения в профиле
          </Link>
        </div>
      </div>
    )
  }

  // Показываем страницу знака пользователя
  return <UserZodiacPage slug={userZodiacSlug} />
}