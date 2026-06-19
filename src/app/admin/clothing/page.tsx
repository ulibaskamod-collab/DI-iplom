
'use client'
export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Shirt, Trash2, Plus, Search, Edit } from 'lucide-react'

interface ClothingItem {
  id: number
  title: string
  description: string
  image_url: string
  season: string
  gender: string
  zodiac_sign_id: number
  created_at: string
}

export default function AdminClothingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

    fetch('/api/admin/clothing')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [session, status, router])

  const deleteItem = async (id: number) => {
    if (confirm('Удалить этот предмет одежды?')) {
      await fetch(`/api/admin/clothing?id=${id}`, { method: 'DELETE' })
      setItems(items.filter(i => i.id !== id))
    }
  }

  const filteredItems = items.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getSeasonEmoji = (season: string) => {
    switch (season) {
      case 'winter': return '❄️'
      case 'spring': return '🌸'
      case 'summer': return '☀️'
      case 'autumn': return '🍂'
      default: return '👕'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-white">Одежда</h1>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
              {items.length} предметов
            </span>
          </div>
          <Link
            href="/admin/clothing/new"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-xl text-white hover:bg-green-600 transition"
          >
            <Plus size={18} />
            Добавить
          </Link>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="admin-table-wrapper">
          <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="admin-table w-full">
                <thead className="bg-white/10 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-white">ID</th>
                    <th className="px-6 py-4 text-left text-white">Название</th>
                    <th className="px-6 py-4 text-left text-white">Сезон</th>
                    <th className="px-6 py-4 text-left text-white">Пол</th>
                    <th className="px-6 py-4 text-left text-white">Знак ID</th>
                    <th className="px-6 py-4 text-center text-white">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-white/60">{item.id}</td>
                      <td className="px-6 py-4 text-white font-medium">{item.title || 'Без названия'}</td>
                      <td className="px-6 py-4 text-white">{getSeasonEmoji(item.season)} {item.season}</td>
                      <td className="px-6 py-4 text-white">
                        {item.gender === 'female' ? '👩 Женский' : item.gender === 'male' ? '👨 Мужской' : '👥 Унисекс'}
                      </td>
                      <td className="px-6 py-4 text-white/60">{item.zodiac_sign_id}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/admin/clothing/${item.id}/edit`}>
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-green-500/20 transition" title="Редактировать">
                              <Edit size={16} className="text-green-400" />
                            </button>
                          </Link>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition"
                            title="Удалить"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            Ничего не найдено
          </div>
        )}

      </div>
    </div>
  )
}