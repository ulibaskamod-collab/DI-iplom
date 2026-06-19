'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, Users, Star, Shirt, Palette, Heart, RefreshCw } from 'lucide-react'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
  }, [status, router])

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/admin/stats')
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      console.log('Stats received:', data)
      setStats({
        users: data.users || 0,
        zodiacSigns: data.zodiacSigns || 0,
        clothingItems: data.clothingItems || 0,
        designers: data.designers || 0,
        favorites: data.favorites || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Не удалось загрузить статистику')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.email) {
      fetchStats()
    }
  }, [session])

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  const statsCards = [
    { title: 'Пользователи', value: stats.users, icon: Users, color: 'blue', bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    { title: 'Знаки зодиака', value: stats.zodiacSigns, icon: Star, color: 'yellow', bg: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    { title: 'Одежда', value: stats.clothingItems, icon: Shirt, color: 'green', bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30', text: 'text-green-400' },
    { title: 'Дизайнеры', value: stats.designers, icon: Palette, color: 'purple', bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/30', text: 'text-purple-400' },
    { title: 'Избранное', value: stats.favorites, icon: Heart, color: 'red', bg: 'from-red-500/20 to-red-600/10', border: 'border-red-500/30', text: 'text-red-400' },
  ]

  const menuItems = [
    { title: 'Знаки зодиака', description: 'Управление знаками зодиака', icon: Star, href: '/admin/zodiac', color: 'from-yellow-500 to-orange-500' },
    { title: 'Одежда', description: 'Управление предметами одежды', icon: Shirt, href: '/admin/clothing', color: 'from-green-500 to-emerald-500' },
    { title: 'Дизайнеры', description: 'Управление дизайнерами', icon: Palette, href: '/admin/designers', color: 'from-purple-500 to-pink-500' },
    { title: 'Пользователи', description: 'Управление пользователями', icon: Users, href: '/admin/users', color: 'from-blue-500 to-cyan-500' },
    { title: 'Избранное', description: 'Статистика избранного', icon: Heart, href: '/admin/favorites', color: 'from-red-500 to-pink-500' },
  ]

  return (
    <div>
      {/* Заголовок */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Панель управления</h1>
            <p className="text-white/50">
              Добро пожаловать, {session?.user?.email}
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            title="Обновить статистику"
          >
            <RefreshCw size={18} className="text-white/60" />
          </button>
        </div>
      </div>

      {/* Карточки статистики */}
// Замените grid на:
<div className="stats-grid grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
  {statsCards.map((stat) => (
    <div
      key={stat.title}
      className={`stats-card bg-gradient-to-br ${stat.bg} rounded-2xl p-4 border ${stat.border}`}
    >
      <stat.icon className={`stats-icon w-8 h-8 ${stat.text} mb-2`} />
      <p className="stats-value text-2xl font-bold text-white">{stat.value}</p>
      <p className="stats-label text-white/50 text-sm">{stat.title}</p>
    </div>
  ))}
</div>

      {/* Меню-карточки */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-center">
          {error}
          <button onClick={fetchStats} className="ml-3 underline">Повторить</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-105"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition mb-1">
              {item.title}
            </h3>
            <p className="text-white/40 text-sm">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}