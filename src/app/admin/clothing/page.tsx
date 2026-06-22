'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, X, Eye } from 'lucide-react'

interface ClothingItem {
  id: number
  title: string
  description: string
  image_url: string
  season: string
  gender: string
  zodiac_sign_id: number
  zodiac_sign?: {
    name: string
  }
}

export default function AdminClothingPage() {
  const [items, setItems] = useState<ClothingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Загрузка данных
  useEffect(() => {
    fetch('/api/admin/clothing')
      .then(res => res.json())
      .then(data => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Фильтрация
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Удаление
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/clothing/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setItems(items.filter(item => item.id !== id))
        setShowDeleteModal(false)
        setSelectedItem(null)
      } else {
        alert('Ошибка при удалении')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ошибка при удалении')
    }
  }

  // Получение названия сезона
  const getSeasonLabel = (season: string) => {
    const labels: Record<string, string> = {
      spring: 'Весна',
      summer: 'Лето',
      autumn: 'Осень',
      winter: 'Зима'
    }
    return labels[season] || season
  }

  // Получение названия пола
  const getGenderLabel = (gender: string) => {
    const labels: Record<string, string> = {
      male: 'Мужской',
      female: 'Женский',
      unisex: 'Унисекс'
    }
    return labels[gender] || gender
  }

  return (
    <div>
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Одежда</h1>
          <p className="text-white/40 text-sm mt-1">Управление предметами одежды</p>
        </div>
        <Link
          href="/admin/clothing/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium hover:opacity-90 transition shadow-lg shadow-pink-500/25 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Добавить предмет
        </Link>
      </div>

      {/* Поиск */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-pink-500/50 transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Таблица */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-pink-500" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">👕</div>
          <p className="text-white/50">Предметы одежды не найдены</p>
          <Link
            href="/admin/clothing/new"
            className="inline-block mt-4 text-pink-400 hover:text-pink-300 transition"
          >
            Добавить первый предмет →
          </Link>
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Предмет</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">Описание</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Сезон</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Пол</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider hidden lg:table-cell">Знак</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
                            👕
                          </div>
                        )}
                        <span className="text-white font-medium">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-sm hidden md:table-cell max-w-[200px] truncate">
                      {item.description || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {getSeasonLabel(item.season)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border
                        ${item.gender === 'male' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                        ${item.gender === 'female' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : ''}
                        ${item.gender === 'unisex' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                      `}>
                        {getGenderLabel(item.gender)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-white/50 text-sm">
                        {item.zodiac_sign?.name || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/clothing/${item.id}/edit`}
                          className="p-2 rounded-lg hover:bg-white/10 transition text-white/40 hover:text-white"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedItem(item)
                            setShowDeleteModal(true)
                          }}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition text-white/40 hover:text-red-400"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-white/10 text-white/30 text-sm">
            Всего: {filteredItems.length} предметов
          </div>
        </div>
      )}

      {/* Модалка удаления */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-gray-900 rounded-2xl border border-white/10 p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Удаление предмета</h3>
              <p className="text-white/60 mb-6">
                Вы уверены, что хотите удалить <span className="text-white font-medium">{selectedItem.title}</span>?<br />
                <span className="text-red-400/60 text-sm">Это действие нельзя отменить.</span>
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleDelete(selectedItem.id)}
                  className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition shadow-lg shadow-red-500/25"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}