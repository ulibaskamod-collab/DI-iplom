'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, X, Eye } from 'lucide-react'

interface Designer {
  id: number
  designer_name: string
  bio: string
  designer_image: string
  social_links: any
  created_at?: string
}

export default function AdminDesignersPage() {
  const [designers, setDesigners] = useState<Designer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Загрузка данных
  useEffect(() => {
    fetchDesigners()
  }, [])

  const fetchDesigners = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/designers')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setDesigners(data)
      } else {
        console.error('API вернул не массив:', data)
        setDesigners([])
        setError('Неверный формат данных')
      }
    } catch (err) {
      console.error('Error fetching designers:', err)
      setError('Не удалось загрузить данные')
      setDesigners([])
    } finally {
      setLoading(false)
    }
  }

  // Фильтрация
  const filteredDesigners = designers.filter(designer =>
    designer.designer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    designer.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Удаление
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/designers/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setDesigners(designers.filter(item => item.id !== id))
        setShowDeleteModal(false)
        setSelectedDesigner(null)
      } else {
        const error = await response.json()
        alert('Ошибка при удалении: ' + (error.error || 'Неизвестная ошибка'))
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ошибка при удалении')
    }
  }

  return (
    <div>
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Дизайнеры</h1>
          <p className="text-white/40 text-sm mt-1">Управление дизайнерами</p>
        </div>
        <Link
          href="/admin/designers/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium hover:opacity-90 transition shadow-lg shadow-pink-500/25 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Добавить дизайнера
        </Link>
      </div>

      {/* Поиск */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Поиск по имени..."
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

      {/* Ошибка */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
          <button 
            onClick={fetchDesigners}
            className="ml-4 text-pink-400 hover:text-pink-300 transition"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* Таблица */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-pink-500" />
        </div>
      ) : filteredDesigners.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">👤</div>
          <p className="text-white/50">Дизайнеры не найдены</p>
          <Link
            href="/admin/designers/new"
            className="inline-block mt-4 text-pink-400 hover:text-pink-300 transition"
          >
            Добавить первого дизайнера →
          </Link>
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Дизайнер</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">Биография</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredDesigners.map((designer) => (
                  <tr key={designer.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={designer.designer_image || '/images/designers/placeholder.svg'}
                          alt={designer.designer_name}
                          className="w-12 h-12 rounded-full object-cover bg-gray-800"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/designers/placeholder.svg'
                          }}
                        />
                        <span className="text-white font-medium">{designer.designer_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-sm hidden md:table-cell max-w-[200px] truncate">
                      {designer.bio || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/designers/${designer.id}/edit`}
                          className="p-2 rounded-lg hover:bg-white/10 transition text-white/40 hover:text-white"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedDesigner(designer)
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
            Всего: {filteredDesigners.length} дизайнеров
          </div>
        </div>
      )}

      {/* Модалка удаления */}
      {showDeleteModal && selectedDesigner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-gray-900 rounded-2xl border border-white/10 p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Удаление дизайнера</h3>
              <p className="text-white/60 mb-6">
                Вы уверены, что хотите удалить <span className="text-white font-medium">{selectedDesigner.designer_name}</span>?<br />
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
                  onClick={() => handleDelete(selectedDesigner.id)}
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