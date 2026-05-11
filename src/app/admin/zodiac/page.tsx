'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Edit, Trash2, Plus, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react'

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
  image_url: string | null
}

export default function AdminZodiacPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [signs, setSigns] = useState<ZodiacSign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingSign, setEditingSign] = useState<ZodiacSign | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
    fetchZodiacSigns()
  }, [status, router])

  const fetchZodiacSigns = async () => {
    try {
      const res = await fetch('/api/zodiac')
      const data = await res.json()
      setSigns(data)
    } catch (error) {
      console.error('Error fetching zodiac signs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот знак? Это действие необратимо.')) {
      try {
        const res = await fetch(`/api/admin/zodiac/${id}`, { method: 'DELETE' })
        if (res.ok) {
          setSigns(signs.filter(s => s.id !== id))
        }
      } catch (error) {
        console.error('Error deleting sign:', error)
      }
    }
  }

  const filteredSigns = signs.filter(sign => 
    sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sign.element.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  const isAdmin = session?.user?.email === 'admin@stellarfit.ru'
  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Знаки зодиака</h1>
            <p className="text-white/50 mt-1">Управление знаками зодиака на сайте</p>
          </div>
          <Link 
            href="/admin/zodiac/new"
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 rounded-xl text-white hover:bg-pink-600 transition"
          >
            <Plus size={18} />
            Добавить знак
          </Link>
        </div>

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

        {/* Table */}
        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Название</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Стихия</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Даты</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Slug</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredSigns.map((sign) => (
                  <tr key={sign.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-white/80">{sign.id}</td>
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
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        sign.element === 'fire' ? 'bg-red-500/20 text-red-300' :
                        sign.element === 'earth' ? 'bg-green-500/20 text-green-300' :
                        sign.element === 'air' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {sign.element === 'fire' && '🔥 Огонь'}
                        {sign.element === 'earth' && '🌍 Земля'}
                        {sign.element === 'air' && '💨 Воздух'}
                        {sign.element === 'water' && '💧 Вода'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/60">{sign.start_date} - {sign.end_date}</td>
                    <td className="px-6 py-4 text-white/60">{sign.slug}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link href={`/zodiac/${sign.slug}`} target="_blank">
                          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
                            <Eye size={16} className="text-white/60" />
                          </button>
                        </Link>
                        <Link href={`/admin/zodiac/${sign.id}/edit`}>
                          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
                            <Edit size={16} className="text-yellow-400" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(sign.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition"
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
    </div>
  )
}