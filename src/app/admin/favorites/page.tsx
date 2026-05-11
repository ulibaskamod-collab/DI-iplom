'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.email) {
      fetch(`/api/user/role?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.role !== 'admin') router.push('/')
        })
        .catch(() => router.push('/'))
    }

    fetch('/api/admin/favorites')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [session, status, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Избранное</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl p-6 border border-red-500/30">
            <Heart className="w-8 h-8 text-red-400 mb-3" />
            <p className="text-3xl font-bold text-white">{stats?.total_favorites || 0}</p>
            <p className="text-red-300 text-sm mt-1">Всего в избранном</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30">
            <Heart className="w-8 h-8 text-blue-400 mb-3" />
            <p className="text-3xl font-bold text-white">{stats?.total_users || 0}</p>
            <p className="text-blue-300 text-sm mt-1">Пользователей с избранным</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
            <Heart className="w-8 h-8 text-purple-400 mb-3" />
            <p className="text-3xl font-bold text-white">
              {stats?.top_items?.length || 0}
            </p>
            <p className="text-purple-300 text-sm mt-1">Популярных товаров</p>
          </div>
        </div>

        {/* Топ товаров */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">🔥 Топ товаров в избранном</h2>
          {stats?.top_items?.length > 0 ? (
            <div className="space-y-3">
              {stats.top_items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '❤️'}</span>
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
            <p className="text-gray-400 text-center py-8">Нет данных</p>
          )}
        </div>

        {/* Топ пользователей */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">👥 Активные пользователи</h2>
          {stats?.top_users?.length > 0 ? (
            <div className="space-y-3">
              {stats.top_users.map((user: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '👤'}</span>
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
            <p className="text-gray-400 text-center py-8">Нет данных</p>
          )}
        </div>

      </div>
    </div>
  )
}