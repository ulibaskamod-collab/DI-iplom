'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, Filter, X } from 'lucide-react'

interface ZodiacSign {
  id: number
  name: string
  slug: string
  element: string
  start_date: string
  end_date: string
  description: string
  style_desc: string
  colors: string[]
  image_url: string
}

export default function AdminZodiacPage() {
  const [signs, setSigns] = useState<ZodiacSign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterElement, setFilterElement] = useState('all')
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Данные для демонстрации (если БД пуста)
  const defaultSigns: ZodiacSign[] = [
    {
      id: 1,
      name: 'Овен',
      slug: 'oven',
      element: 'Огонь',
      start_date: '21.03',
      end_date: '19.04',
      description: 'Пионер, воин, первооткрыватель. Овен — первый знак зодиака.',
      style_desc: 'Авангард, динамика, функциональность. Кожа, металлические детали.',
      colors: ['#FF0000', '#FF4500', '#8B0000', '#1A1A1A', '#C0C0C0'],
      image_url: '/uploads/zodiac/oven.jpg'
    },
    {
      id: 2,
      name: 'Телец',
      slug: 'telec',
      element: 'Земля',
      start_date: '20.04',
      end_date: '20.05',
      description: 'Чувственность, стойкость, любовь к роскоши.',
      style_desc: 'Натуральные ткани, мягкие силуэты, теплые земляные оттенки.',
      colors: ['#8B7355', '#D2B48C', '#556B2F', '#FFB6C1', '#F5DEB3'],
      image_url: '/uploads/zodiac/telec.jpg'
    },
    {
      id: 3,
      name: 'Близнецы',
      slug: 'bliznetsy',
      element: 'Воздух',
      start_date: '21.05',
      end_date: '20.06',
      description: 'Двойственность, коммуникабельность, жажда перемен.',
      style_desc: 'Смешение фактур и направлений: спорт-шик с бохо.',
      colors: ['#FFD700', '#87CEEB', '#32CD32', '#FFA500', '#9370DB'],
      image_url: '/uploads/zodiac/bliznetsy.jpg'
    },
    {
      id: 4,
      name: 'Рак',
      slug: 'rak',
      element: 'Вода',
      start_date: '21.06',
      end_date: '22.07',
      description: 'Эмпатия, глубина чувств, любовь к дому.',
      style_desc: 'Мягкие драпировки, струящиеся ткани, пастельные оттенки.',
      colors: ['#FFFFFF', '#C0C0C0', '#F0F8FF', '#E6E6FA', '#48D1CC'],
      image_url: '/uploads/zodiac/rak.jpg'
    },
    {
      id: 5,
      name: 'Лев',
      slug: 'lev',
      element: 'Огонь',
      start_date: '23.07',
      end_date: '22.08',
      description: 'Величественный, страстный, королевский знак.',
      style_desc: 'Люкс-бренды, золото, леопардовый принт, бархат.',
      colors: ['#FFD700', '#8B008B', '#FF4500', '#1A1A1A', '#DAA520'],
      image_url: '/uploads/zodiac/lev.jpg'
    },
    {
      id: 6,
      name: 'Дева',
      slug: 'deva',
      element: 'Земля',
      start_date: '23.08',
      end_date: '22.09',
      description: 'Элегантность, аналитический ум, безупречный вкус.',
      style_desc: 'Лаконичные силуэты, натуральные ткани, нейтральные оттенки.',
      colors: ['#FFFFFF', '#808080', '#D3D3D3', '#F5F5DC', '#6B8E23'],
      image_url: '/uploads/zodiac/deva.jpg'
    },
    {
      id: 7,
      name: 'Весы',
      slug: 'vesy',
      element: 'Воздух',
      start_date: '23.09',
      end_date: '22.10',
      description: 'Гармония, дипломатичность, утончённость.',
      style_desc: 'Мягкие силуэты, пастельные тона, изысканные ткани.',
      colors: ['#FFB6C1', '#87CEEB', '#DDA0DD', '#F5DEB3', '#FFF0F5'],
      image_url: '/uploads/zodiac/vesy.jpg'
    },
    {
      id: 8,
      name: 'Скорпион',
      slug: 'skorpion',
      element: 'Вода',
      start_date: '23.10',
      end_date: '21.11',
      description: 'Страсть, магнетизм, трансформация.',
      style_desc: 'Кожа, латекс, глубокий чёрный, винный и кроваво-красный.',
      colors: ['#FF6B6B', '#8B0000', '#4B0082', '#800080', '#2E8B57'],
      image_url: '/uploads/zodiac/skorpion.jpg'
    },
    {
      id: 9,
      name: 'Стрелец',
      slug: 'strelets',
      element: 'Огонь',
      start_date: '22.11',
      end_date: '21.12',
      description: 'Искатель приключений, философ, огненный странник.',
      style_desc: 'Свободные силуэты, этнические мотивы, кожа, замша.',
      colors: ['#800080', '#0000CD', '#FFA500', '#40E0D0', '#DDA0DD'],
      image_url: '/uploads/zodiac/strelets.jpg'
    },
    {
      id: 10,
      name: 'Козерог',
      slug: 'kozerog',
      element: 'Земля',
      start_date: '22.12',
      end_date: '19.01',
      description: 'Дисциплина, амбиции, безупречный вкус.',
      style_desc: 'Кашемир, твид, идеально скроенные костюмы, минимализм.',
      colors: ['#1A1A1A', '#2F4F4F', '#696969', '#8B4513', '#F5F5DC'],
      image_url: '/uploads/zodiac/kozerog.jpg'
    },
    {
      id: 11,
      name: 'Водолей',
      slug: 'vodoley',
      element: 'Воздух',
      start_date: '20.01',
      end_date: '18.02',
      description: 'Инновации, свобода, авангард.',
      style_desc: 'Необычные акценты, асимметрия, техно-аксессуары.',
      colors: ['#00FFFF', '#C0C0C0', '#0000FF', '#FF00FF', '#40E0D0'],
      image_url: '/uploads/zodiac/vodoley.jpg'
    },
    {
      id: 12,
      name: 'Рыбы',
      slug: 'ryby',
      element: 'Вода',
      start_date: '19.02',
      end_date: '20.03',
      description: 'Интуиция, глубинная эмпатия, творческий дар.',
      style_desc: 'Невесомые ткани, переливчатые оттенки, струящийся шифон.',
      colors: ['#48D1CC', '#E0FFFF', '#D8BFD8', '#F0E68C', '#FFB6C1'],
      image_url: '/uploads/zodiac/ryby.jpg'
    }
  ]

  // Загрузка данных из API (если есть)
  useEffect(() => {
    const fetchSigns = async () => {
      try {
        const response = await fetch('/api/admin/zodiac')
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            setSigns(data)
            setLoading(false)
            return
          }
        }
        // Если API не отвечает или данных нет - используем дефолтные
        setSigns(defaultSigns)
      } catch (error) {
        console.error('Error fetching zodiac signs:', error)
        setSigns(defaultSigns)
      }
      setLoading(false)
    }

    fetchSigns()
  }, [])

  // Фильтрация знаков
  const filteredSigns = signs.filter(sign => {
    const matchesSearch = sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sign.element.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sign.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesElement = filterElement === 'all' || sign.element === filterElement
    return matchesSearch && matchesElement
  })

  // Удаление знака
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/zodiac/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setSigns(signs.filter(s => s.id !== id))
        setShowDeleteModal(false)
        setSelectedSign(null)
      } else {
        alert('Ошибка при удалении знака')
      }
    } catch (error) {
      console.error('Error deleting sign:', error)
      alert('Ошибка при удалении знака')
    }
  }

  // Элементы для фильтра
  const elements = ['Огонь', 'Земля', 'Воздух', 'Вода']

  // Получение цвета для стихии
  const getElementColor = (element: string) => {
    const colors: Record<string, string> = {
      'Огонь': 'text-red-400 bg-red-500/10 border-red-500/20',
      'Земля': 'text-green-400 bg-green-500/10 border-green-500/20',
      'Воздух': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      'Вода': 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    }
    return colors[element] || 'text-gray-400 bg-gray-500/10 border-gray-500/20'
  }

  return (
    <div>
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Знаки зодиака</h1>
          <p className="text-white/40 text-sm mt-1">Редактирование знаков зодиака</p>
        </div>
        <Link
          href="/admin/zodiac/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium hover:opacity-90 transition shadow-lg shadow-pink-500/25 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Добавить знак
        </Link>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Поиск по названию или стихии..."
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

        <div className="flex gap-2">
          <select
            value={filterElement}
            onChange={(e) => setFilterElement(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 transition"
          >
            <option value="all">Все стихии</option>
            {elements.map(el => (
              <option key={el} value={el}>{el}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Таблица */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-pink-500" />
        </div>
      ) : filteredSigns.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">🔮</div>
          <p className="text-white/50">Знаки зодиака не найдены</p>
          <Link
            href="/admin/zodiac/new"
            className="inline-block mt-4 text-pink-400 hover:text-pink-300 transition"
          >
            Создать первый знак →
          </Link>
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Знак</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Стихия</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Даты</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">Цвета</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredSigns.map((sign) => (
                  <tr key={sign.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {sign.image_url ? (
                          <img
                            src={sign.image_url}
                            alt={sign.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
                            {sign.name[0]}
                          </div>
                        )}
                        <div>
                          <div className="text-white font-medium">{sign.name}</div>
                          <div className="text-white/30 text-xs">@{sign.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getElementColor(sign.element)}`}>
                        {sign.element}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-sm">
                      {sign.start_date} – {sign.end_date}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex gap-1.5">
                        {sign.colors.slice(0, 4).map((color, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border border-white/10"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                        {sign.colors.length > 4 && (
                          <span className="text-white/30 text-xs flex items-center">+{sign.colors.length - 4}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/zodiac/${sign.id}/edit`}
                          className="p-2 rounded-lg hover:bg-white/10 transition text-white/40 hover:text-white"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedSign(sign)
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
            Всего: {filteredSigns.length} знаков
          </div>
        </div>
      )}

      {/* Модалка подтверждения удаления */}
      {showDeleteModal && selectedSign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-gray-900 rounded-2xl border border-white/10 p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Удаление знака</h3>
              <p className="text-white/60 mb-6">
                Вы уверены, что хотите удалить знак <span className="text-white font-medium">{selectedSign.name}</span>?<br />
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
                  onClick={() => handleDelete(selectedSign.id)}
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