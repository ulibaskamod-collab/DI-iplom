'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, Users, Star, Shirt, Palette, Heart } from 'lucide-react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    users: 0,
    zodiacSigns: 0,
    clothingItems: 0,
    designers: 0,
    favorites: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.email) {
      // Проверка роли
      fetch(`/api/user/role?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.role !== 'admin') {
            router.push('/')
          }
        })

      // Загрузка статистики
      fetch('/api/admin/stats')
        .then(res => res.json())
        .then(data => {
          setStats({
            users: data.users || 0,
            zodiacSigns: data.zodiacSigns || 0,
            clothingItems: data.clothingItems || 0,
            designers: data.designers || 0,
            favorites: data.favorites || 0,
          })
        })
        .catch(console.error)
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  const statsCards = [
    { title: 'Пользователи', value: stats.users, icon: Users, color: 'blue' },
    { title: 'Знаки зодиака', value: stats.zodiacSigns, icon: Star, color: 'yellow' },
    { title: 'Одежда', value: stats.clothingItems, icon: Shirt, color: 'green' },
    { title: 'Дизайнеры', value: stats.designers, icon: Palette, color: 'purple' },
    { title: 'Избранное', value: stats.favorites, icon: Heart, color: 'red' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Панель управления</h1>
        <p className="text-white/50">
          Добро пожаловать, {session?.user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statsCards.map((stat) => (
          <div
            key={stat.title}
            className={`bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/10 rounded-2xl p-6 border border-${stat.color}-500/30`}
          >
            <stat.icon className={`w-8 h-8 text-${stat.color}-400 mb-3`} />
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-white/50 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/zodiac"
          className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition"
        >
          <Star className="w-10 h-10 text-yellow-400 mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Знаки зодиака</h3>
          <p className="text-white/40 text-sm">Управление знаками зодиака</p>
        </Link>

        <Link
          href="/admin/clothing"
          className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition"
        >
          <Shirt className="w-10 h-10 text-green-400 mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Одежда</h3>
          <p className="text-white/40 text-sm">Управление предметами одежды</p>
        </Link>

        <Link
          href="/admin/designers"
          className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition"
        >
          <Palette className="w-10 h-10 text-purple-400 mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Дизайнеры</h3>
          <p className="text-white/40 text-sm">Управление дизайнерами</p>
        </Link>

        <Link
          href="/admin/users"
          className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition"
        >
          <Users className="w-10 h-10 text-blue-400 mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Пользователи</h3>
          <p className="text-white/40 text-sm">Управление пользователями</p>
        </Link>

        <Link
          href="/admin/favorites"
          className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition"
        >
          <Heart className="w-10 h-10 text-red-400 mb-3" />
          <h3 className="text-xl font-semibold text-white mb-2">Избранное</h3>
          <p className="text-white/40 text-sm">Статистика избранного</p>
        </Link>
      </div>
    </div>
  )
}