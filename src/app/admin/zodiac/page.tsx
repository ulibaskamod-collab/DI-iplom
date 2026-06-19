'use client'

export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Edit, Eye, Search, RefreshCw, Plus, ArrowLeft } from 'lucide-react'
import { AdminButton } from '@/src/components/AdminButton'

interface ZodiacSign {
  id: number
  name: string
  slug: string
  element: string
  start_date: string
  end_date: string
}

export default function AdminZodiacPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [signs, setSigns] = useState<ZodiacSign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    fetchZodiacSigns()
  }, [status, router])

  const fetchZodiacSigns = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/zodiac')
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      setSigns(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching zodiac signs:', error)
      setError('Не удалось загрузить знаки зодиака')
    } finally {
      setLoading(false)
    }
  }

  const filteredSigns = signs.filter(sign =>
    sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sign.element.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getElementDisplay = (element: string) => {
    switch (element) {
      case 'fire': return { text: '🔥 Огонь', className: 'bg-red-500/20 text-red-300' }
      case 'earth': return { text: '🌍 Земля', className: 'bg-green-500/20 text-green-300' }
      case 'air': return { text: '💨 Воздух', className: 'bg-blue-500/20 text-blue-300' }
      case 'water': return { text: '💧 Вода', className: 'bg-cyan-500/20 text-cyan-300' }
      default: return { text: element, className: 'bg-white/20 text-white' }
    }
  }

  const getZodiacEmoji = (name: string) => {
    const emojis: Record<string, string> = {
      'Овен': '♈', 'Телец': '♉', 'Близнецы': '♊', 'Рак': '♋',
      'Лев': '♌', 'Дева': '♍', 'Весы': '♎', 'Скорпион': '♏',
      'Стрелец': '♐', 'Козерог': '♑', 'Водолей': '♒', 'Рыбы': '♓'
    }
    return emojis[name] || '⭐'
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
              <Star className="w-7 h-7 text-yellow-400" />
              Знаки зодиака
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              Редактирование знаков зодиака
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            variant="ghost"
            size="sm"
            icon={<RefreshCw size={16} />}
            onClick={fetchZodiacSigns}
            title="Обновить" children={undefined}          />
          <Link href="/admin/zodiac/new">
            <AdminButton
              variant="primary"
              size="md"
              icon={<Plus size={18} />}
            >
              Добавить знак
            </AdminButton>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-center">
          {error}
          <button onClick={fetchZodiacSigns} className="ml-3 underline">Повторить</button>
        </div>
      )}

      {/* Поиск */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="Поиск по названию или стихии..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 transition"
        />
      </div>

      {/* Таблица */}
      {signs.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <Star className="w-20 h-20 text-white/20 mx-auto mb-4" />
          <p className="text-xl text-white/40">Знаки зодиака не найдены</p>
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
                  <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">Стихия</th>
                  <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">Даты</th>
                  <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-center text-white text-xs font-medium uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredSigns.map((sign) => {
                  const elementDisplay = getElementDisplay(sign.element)
                  return (
                    <tr key={sign.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-white/60 text-sm">{sign.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getZodiacEmoji(sign.name)}</span>
                          <span className="text-white font-medium">{sign.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${elementDisplay.className}`}>
                          {elementDisplay.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60 text-sm">{sign.start_date} - {sign.end_date}</td>
                      <td className="px-6 py-4 text-white/60 text-sm">{sign.slug}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/zodiac/${sign.slug}`} target="_blank">
                            <AdminButton
                              variant="ghost"
                              size="sm"
                              icon={<Eye size={16} className="text-white/60" />}
                              title="Просмотр на сайте" children={undefined}                            />
                          </Link>
                          <Link href={`/admin/zodiac/${sign.id}/edit`}>
                            <AdminButton
                              variant="ghost"
                              size="sm"
                              icon={<Edit size={16} className="text-yellow-400" />}
                              title="Редактировать" children={undefined}                            />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Мобильные карточки */}
          <div className="md:hidden divide-y divide-white/5">
            {filteredSigns.map((sign) => {
              const elementDisplay = getElementDisplay(sign.element)
              return (
                <div key={sign.id} className="p-4 hover:bg-white/5 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{getZodiacEmoji(sign.name)}</span>
                        <span className="text-white font-medium">{sign.name}</span>
                        <span className="text-white/40 text-xs">#{sign.id}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-full ${elementDisplay.className}`}>
                          {elementDisplay.text}
                        </span>
                        <span className="px-2 py-0.5 bg-white/10 rounded-full text-white/60">
                          {sign.start_date} - {sign.end_date}
                        </span>
                        <span className="px-2 py-0.5 bg-white/10 rounded-full text-white/60">
                          {sign.slug}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Link href={`/zodiac/${sign.slug}`} target="_blank">
                        <AdminButton
                          variant="ghost"
                          size="sm"
                          icon={<Eye size={15} className="text-white/60" />} children={undefined}                        />
                      </Link>
                      <Link href={`/admin/zodiac/${sign.id}/edit`}>
                        <AdminButton
                          variant="ghost"
                          size="sm"
                          icon={<Edit size={15} className="text-yellow-400" />} children={undefined}                        />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}