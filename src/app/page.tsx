'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import HomePageAllSigns from './(home)/page'

// Временный компонент страницы знака (встроенный)
function UserZodiacPage({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(true)
  const [sign, setSign] = useState<any>(null)
  const [clothingItems, setClothingItems] = useState<any[]>([])

  useEffect(() => {
    // Получаем данные знака
    fetch(`/api/zodiac/${slug}`)
      .then(res => res.json())
      .then(data => setSign(data))
      .catch(console.error)
    
    // Получаем одежду
    fetch(`/api/zodiac/items?zodiacSlug=${slug}`)
      .then(res => res.json())
      .then(data => setClothingItems(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!sign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center">
          <p className="text-white mb-4">Знак не найден</p>
          <Link href="/zodiac" className="text-pink-400">Перейти ко всем знакам</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="relative h-[450px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-20">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-3">{sign.name}</h1>
          <p className="text-white/70 text-lg max-w-xl">{sign.description}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-white mb-6">Гардероб {sign.name}</h2>
        {clothingItems.length === 0 ? (
          <p className="text-white/40">Товары пока не добавлены</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {clothingItems.map((item) => (
              <div key={item.id} className="bg-white/5 rounded-xl p-4">
                {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover rounded-lg mb-2" />}
                <p className="text-white text-sm">{item.title}</p>
              </div>
            ))}
          </div>
        )}
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

  // Неавторизованный пользователь -> все знаки
  if (status === 'unauthenticated') {
    return <HomePageAllSigns />
  }

  // Авторизованный, но знак не найден
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