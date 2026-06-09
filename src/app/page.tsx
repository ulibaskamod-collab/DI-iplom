'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import HomePageAllSigns from './(home)/page'

// Компонент страницы знака пользователя
function UserZodiacPage({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(true)
  const [signName, setSignName] = useState('')

  useEffect(() => {
    // Получаем название знака по slug
    const names: Record<string, string> = {
      'oven': 'Овен', 'telec': 'Телец', 'bliznetsy': 'Близнецы',
      'rak': 'Рак', 'lev': 'Лев', 'deva': 'Дева', 'vesy': 'Весы',
      'skorpion': 'Скорпион', 'strelets': 'Стрелец', 'kozerog': 'Козерог',
      'vodoley': 'Водолей', 'ryby': 'Рыбы'
    }
    setSignName(names[slug] || slug)
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">{signName}</h1>
        <p className="text-purple-300 text-lg mb-8">Ваш персональный стиль</p>
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <p className="text-white/60">Здесь будут рекомендации для вашего знака зодиака</p>
          <Link href="/zodiac" className="inline-block mt-6 px-6 py-2 bg-purple-500 rounded-full text-white hover:bg-purple-600">
            Посмотреть все знаки →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const { data: session, status } = useSession()
  const [userZodiacSlug, setUserZodiacSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetch('/api/user/zodiac')
        .then(res => res.json())
        .then(data => {
          if (data.slug) setUserZodiacSlug(data.slug)
        })
        .catch(console.error)
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

  // Неавторизованные видят страницу со всеми знаками
  if (status === 'unauthenticated') {
    return <HomePageAllSigns />
  }

  // Авторизованные видят свой знак
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

  return <UserZodiacPage slug={userZodiacSlug} />
}