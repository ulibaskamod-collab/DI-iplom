'use client'

export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Shirt, Trash2, Plus, Search, Edit, RefreshCw } from 'lucide-react'
import { AdminButton } from '@/src/components/AdminButton'

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

    fetchItems()
  }, [session, status, router])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/clothing')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const getSeasonLabel = (season: string) => {
    switch (season) {
      case 'winter': return 'Зима'
      case 'spring': return 'Весна'
      case 'summer': return 'Лето'
      case 'autumn': return 'Осень'
      default: return season
    }
  }

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'female': return '👩 Женский'
      case 'male': return '👨 Мужской'
      default: return '👥 Унисекс'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    )
  }

  return (
    <div>
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-white/5">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <Shirt className="w-7 h-7 text-green-400" />
              Одежда
            </h1>
            <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full text-xs">
                {items.length} предметов
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            variant="ghost"
            size="sm"
            icon={<RefreshCw size={16} />}
            onClick={fetchItems}
            title="Обновить" children={undefined}          />
          <Link href="/admin/clothing/new">
            <AdminButton
              variant="success"
              size="md"
              icon={<Plus size={18} />}
            >
              <span className="hidden xs:inline">Добавить</span>
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* Поиск */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-green-500 transition"
        />
      </div>

      {/* Таблица */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <Shirt className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">
            {searchTerm ? 'Ничего не найдено' : 'Предметов одежды пока нет'}
          </p>
          {!searchTerm && (
            <Link href="/admin/clothing/new" className="inline-block mt-4">
              <AdminButton variant="success" icon={<Plus size={18} />}>
                Добавить первый предмет
              </AdminButton>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
          {/* Десктопная таблица */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">Название</th>
                  <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">Сезон</th>
                  <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">Пол</th>
                  <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">Знак ID</th>
                  <th className="px-6 py-4 text-center text-white text-xs font-medium uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-white/60 text-sm">{item.id}</td>
                    <td className="px-6 py-4 text-white font-medium text-sm">{item.title || 'Без названия'}</td>
                    <td className="px-6 py-4 text-white/80 text-sm">
                      <span className="flex items-center gap-1.5">
                        {getSeasonEmoji(item.season)} {getSeasonLabel(item.season)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/80 text-sm">{getGenderLabel(item.gender)}</td>
                    <td className="px-6 py-4 text-white/60 text-sm">{item.zodiac_sign_id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/clothing/${item.id}/edit`}>
                          <AdminButton
                            variant="ghost"
                            size="sm"
                            icon={<Edit size={16} className="text-green-400" />}
                            title="Редактировать" children={undefined}                          />
                        </Link>
                        <AdminButton
                          variant="danger"
                          size="sm"
                          icon={<Trash2 size={16} className="text-red-400" />}
                          onClick={() => deleteItem(item.id)}
                          title="Удалить" children={undefined}                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Мобильные карточки */}
          <div className="md:hidden divide-y divide-white/5">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 hover:bg-white/5 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/40 text-xs">#{item.id}</span>
                      <span className="text-white font-medium truncate">{item.title || 'Без названия'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-white/10 rounded-full text-white/60">
                        {getSeasonEmoji(item.season)} {getSeasonLabel(item.season)}
                      </span>
                      <span className="px-2 py-0.5 bg-white/10 rounded-full text-white/60">
                        {getGenderLabel(item.gender)}
                      </span>
                      <span className="px-2 py-0.5 bg-white/10 rounded-full text-white/60">
                        Знак: {item.zodiac_sign_id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link href={`/admin/clothing/${item.id}/edit`}>
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        icon={<Edit size={15} className="text-green-400" />} children={undefined}                      />
                    </Link>
                    <AdminButton
                      variant="danger"
                      size="sm"
                      icon={<Trash2 size={15} className="text-red-400" />}
                      onClick={() => deleteItem(item.id)} children={undefined}                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}