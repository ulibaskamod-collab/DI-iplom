'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import HomePageAllSigns from './(home)/page'
import UserZodiacPage from '@/src/components/UserZodiacPage'
import { Link } from 'lucide-react'

export default function Page() {
  const { data: session, status } = useSession()
  const [userZodiacSlug, setUserZodiacSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetch('/api/user/zodiac')
        .then(res => res.json())
        .then(data => {
          setUserZodiacSlug(data.slug)
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

  // Если пользователь не авторизован - показываем все знаки
  if (status === 'unauthenticated') {
    return <HomePageAllSigns />
  }

  // Если пользователь авторизован, но знак не найден
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