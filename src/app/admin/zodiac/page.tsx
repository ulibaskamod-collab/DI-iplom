'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Edit, Trash2, Plus, Eye, Search, RefreshCw } from 'lucide-react'

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
      console.log('Получены знаки:', data)
      setSigns(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching zodiac signs:', error)
      setError('Не удалось загрузить знаки зодиака')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Удалить знак "${name}"? Это действие необратимо.`)) {
      try {
        const res = await fetch(`/api/admin/zodiac?id=${id}`, { method: 'DELETE' })
        if (res.ok) {
          await fetchZodiacSigns()
        } else {
          alert('Ошибка при удалении')
        }
      } catch (error) {
        console.error('Error deleting sign:', error)
        alert('Ошибка соединения')
      }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Знаки зодиака</h1>
          <p className="text-white/50 mt-1">Управление знаками зодиака на сайте</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchZodiacSigns}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            title="Обновить"
          >
            <RefreshCw size={18} className="text-white/60" />
          </button>
          <Link
            href="/admin/zodiac/new"
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 rounded-xl text-white hover:bg-pink-600 transition"
          >
            <Plus size={18} />
            Добавить знак
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-center">
          {error}
          <button onClick={fetchZodiacSigns} className="ml-3 underline">Повторить</button>
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="Поиск по названию или стихии..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-pink-500"
        />
      </div>

      {signs.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <Star className="w-20 h-20 text-white/20 mx-auto mb-4" />
          <p className="text-xl text-white/40">Знаки зодиака не найдены</p>
          <Link href="/admin/zodiac/new" className="inline-block mt-4 px-4 py-2 bg-pink-500 rounded-xl text-white hover:bg-pink-600 transition">
            Добавить первый знак
          </Link>
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white">ID</th>
                  <th className="px-6 py-4 text-left text-white">Название</th>
                  <th className="px-6 py-4 text-left text-white">Стихия</th>
                  <th className="px-6 py-4 text-left text-white">Даты</th>
                  <th className="px-6 py-4 text-left text-white">Slug</th>
                  <th className="px-6 py-4 text-center text-white">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredSigns.map((sign) => {
                  const elementDisplay = getElementDisplay(sign.element)
                  return (
                    <tr key={sign.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-white/60">{sign.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {sign.name === 'Овен' && '♈'}
                            {sign.name === 'Телец' && '♉'}
                            {sign.name === 'Близнецы' && '♊'}
                            {sign.name === 'Рак' && '♋'}
                            {sign.name === 'Лев' && '♌'}
                            {sign.name === 'Дева' && '♍'}
                            {sign.name === 'Весы' && '♎'}
                            {sign.name === 'Скорпион' && '♏'}
                            {sign.name === 'Стрелец' && '♐'}
                            {sign.name === 'Козерог' && '♑'}
                            {sign.name === 'Водолей' && '♒'}
                            {sign.name === 'Рыбы' && '♓'}
                          </span>
                          <span className="text-white font-medium">{sign.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${elementDisplay.className}`}>
                          {elementDisplay.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60">{sign.start_date} - {sign.end_date}</td>
                      <td className="px-6 py-4 text-white/60">{sign.slug}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <Link href={`/zodiac/${sign.slug}`} target="_blank">
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition" title="Просмотр">
                              <Eye size={16} className="text-white/60" />
                            </button>
                          </Link>
                          <Link href={`/admin/zodiac/${sign.id}/edit`}>
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition" title="Редактировать">
                              <Edit size={16} className="text-yellow-400" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(sign.id, sign.name)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition"
                            title="Удалить"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}