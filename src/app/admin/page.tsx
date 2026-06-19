'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Users, Star, Shirt, Palette, Heart, 
  RefreshCw, TrendingUp, ArrowRight 
} from 'lucide-react'

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  const statsCards = [
    { 
      title: 'Пользователи', 
      value: stats.users, 
      icon: Users, 
      color: 'blue',
      bg: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400'
    },
    { 
      title: 'Знаки зодиака', 
      value: stats.zodiacSigns, 
      icon: Star, 
      color: 'yellow',
      bg: 'from-yellow-500/20 to-yellow-600/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400'
    },
    { 
      title: 'Одежда', 
      value: stats.clothingItems, 
      icon: Shirt, 
      color: 'green',
      bg: 'from-green-500/20 to-green-600/10',
      border: 'border-green-500/30',
      text: 'text-green-400'
    },
    { 
      title: 'Дизайнеры', 
      value: stats.designers, 
      icon: Palette, 
      color: 'purple',
      bg: 'from-purple-500/20 to-purple-600/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400'
    },
    { 
      title: 'Избранное', 
      value: stats.favorites, 
      icon: Heart, 
      color: 'red',
      bg: 'from-red-500/20 to-red-600/10',
      border: 'border-red-500/30',
      text: 'text-red-400'
    },
  ]

  const menuItems = [
    { 
      title: 'Знаки зодиака', 
      description: 'Управление знаками зодиака', 
      icon: Star, 
      href: '/admin/zodiac', 
      color: 'from-yellow-500 to-orange-500',
      bg: 'bg-yellow-500/10',
      border: 'hover:border-yellow-500/30'
    },
    { 
      title: 'Одежда', 
      description: 'Управление предметами одежды', 
      icon: Shirt, 
      href: '/admin/clothing', 
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-500/10',
      border: 'hover:border-green-500/30'
    },
    { 
      title: 'Дизайнеры', 
      description: 'Управление дизайнерами', 
      icon: Palette, 
      href: '/admin/designers', 
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500/30'
    },
    { 
      title: 'Пользователи', 
      description: 'Управление пользователями', 
      icon: Users, 
      href: '/admin/users', 
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500/30'
    },
    { 
      title: 'Избранное', 
      description: 'Статистика избранного', 
      icon: Heart, 
      href: '/admin/favorites', 
      color: 'from-red-500 to-pink-500',
      bg: 'bg-red-500/10',
      border: 'hover:border-red-500/30'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <span>Панель управления</span>
            <span className="text-sm font-normal text-white/40 hidden sm:inline">
              {new Date().toLocaleDateString('ru-RU', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
          </h1>
          <p className="text-white/50 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
            Добро пожаловать, {session?.user?.email}
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-all duration-200 text-sm border border-white/10 hover:border-white/20 shrink-0"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Обновить
        </button>
      </div>

      {/* Статистика */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-center">
          {error}
          <button onClick={fetchStats} className="ml-3 underline hover:text-red-300">Повторить</button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statsCards.map((stat) => (
          <div
            key={stat.title}
            className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-4 border ${stat.border} hover:scale-[1.02] transition-transform duration-200`}
          >
            <stat.icon className={`w-6 h-6 ${stat.text} mb-2`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-white/50 text-xs truncate">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Меню-карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={`group ${item.bg} rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20`}
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-white mt-4 group-hover:text-pink-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-white/40 text-sm mt-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}