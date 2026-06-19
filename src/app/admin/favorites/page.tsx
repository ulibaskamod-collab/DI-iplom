'use client'
export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, Users, Star, RefreshCw } from 'lucide-react'

interface FavoriteStats {
  total_favorites: number
  total_users: number
  top_items: any[]
  top_users: any[]
}

export default function AdminFavoritesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<FavoriteStats | null>(null)
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
      const res = await fetch('/api/admin/favorites')
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      console.log('Favorites stats:', data)
      setStats(data)
    } catch (error) {
      console.error('Error fetching favorites stats:', error)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
        <button 
          onClick={fetchStats}
          className="px-4 py-2 bg-pink-500 rounded-lg text-white hover:bg-pink-600 transition"
        >
          Повторить попытку
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Избранное</h1>
          <p className="text-white/50 text-sm mt-1">Статистика избранных товаров</p>
        </div>
        <button
          onClick={fetchStats}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          title="Обновить"
        >
          <RefreshCw size={18} className="text-white/60" />
        </button>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl p-6 border border-red-500/30">
          <Heart className="w-8 h-8 text-red-400 mb-3" />
          <p className="text-3xl font-bold text-white">{stats?.total_favorites || 0}</p>
          <p className="text-red-300 text-sm mt-1">Всего в избранном</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30">
          <Users className="w-8 h-8 text-blue-400 mb-3" />
          <p className="text-3xl font-bold text-white">{stats?.total_users || 0}</p>
          <p className="text-blue-300 text-sm mt-1">Пользователей с избранным</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
          <Star className="w-8 h-8 text-purple-400 mb-3" />
          <p className="text-3xl font-bold text-white">{stats?.top_items?.length || 0}</p>
          <p className="text-purple-300 text-sm mt-1">Популярных товаров</p>
        </div>
      </div>

      {/* Топ товаров */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Heart size={20} className="text-red-400" />
          Топ товаров в избранном
        </h2>
        
        {stats?.top_items && stats.top_items.length > 0 ? (
          <div className="space-y-3">
            {stats.top_items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '❤️'}
                  </span>
                  <div>
                    <p className="text-white font-medium">{item.title || `Товар #${item.clothing_item_id}`}</p>
                    <p className="text-gray-400 text-sm">ID: {item.clothing_item_id}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                  {item.count} ❤️
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-white/20 mx-auto mb-2" />
            <p className="text-gray-400">Нет данных об избранных товарах</p>
            <p className="text-white/25 text-sm">Добавьте товары в избранное, чтобы увидеть статистику</p>
          </div>
        )}
      </div>

      {/* Топ пользователей */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users size={20} className="text-blue-400" />
          Активные пользователи
        </h2>
        
        {stats?.top_users && stats.top_users.length > 0 ? (
          <div className="space-y-3">
            {stats.top_users.map((user: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '👤'}
                  </span>
                  <div>
                    <p className="text-white font-medium">{user.name || user.email}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  {user.count} товаров
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-2" />
            <p className="text-gray-400">Нет данных об активных пользователях</p>
            <p className="text-white/25 text-sm">Пользователи ещё не добавляли товары в избранное</p>
          </div>
        )}
      </div>
    </div>
  )
}