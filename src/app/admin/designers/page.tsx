'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Palette, Trash2, Plus, Edit, Eye, Image as ImageIcon } from 'lucide-react'

interface Designer {
  id: number
  designer_name: string
  bio: string
  designer_image: string
  social_links: any
  created_at: string
  works_count?: number
}

export default function AdminDesignersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [designers, setDesigners] = useState<Designer[]>([])
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

    fetchDesigners()
  }, [session, status, router])

  const fetchDesigners = async () => {
    try {
      const res = await fetch('/api/admin/designers')
      const data = await res.json()
      setDesigners(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteDesigner = async (id: number) => {
    if (confirm('Удалить дизайнера и все его работы? Это действие необратимо!')) {
      await fetch(`/api/admin/designers?id=${id}`, { method: 'DELETE' })
      setDesigners(designers.filter(d => d.id !== id))
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
            <h1 className="text-3xl font-bold text-white">Дизайнеры</h1>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
              {designers.length}
            </span>
          </div>
          <Link
            href="/admin/designers/new"
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 rounded-xl text-white hover:bg-purple-600 transition"
          >
            <Plus size={18} />
            Добавить дизайнера
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designers.map((designer) => (
            <div key={designer.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition group">
              
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center relative">
                {designer.designer_image ? (
                  <img src={designer.designer_image} alt={designer.designer_name} className="w-full h-full object-cover" />
                ) : (
                  <Palette className="w-20 h-20 text-purple-400 opacity-50" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <Link
                    href={`/admin/designers/${designer.id}/edit`}
                    className="p-2 bg-purple-500 rounded-full hover:bg-purple-600 transition"
                    title="Редактировать"
                  >
                    <Edit size={18} className="text-white" />
                  </Link>
                  <Link
                    href={`/admin/designers/${designer.id}/works`}
                    className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition"
                    title="Управление работами"
                  >
                    <ImageIcon size={18} className="text-white" />
                  </Link>
                  <Link
                    href={`/designers/${designer.id}`}
                    target="_blank"
                    className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition"
                    title="Посмотреть на сайте"
                  >
                    <Eye size={18} className="text-white" />
                  </Link>
                  <button
                    onClick={() => deleteDesigner(designer.id)}
                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
                    title="Удалить"
                  >
                    <Trash2 size={18} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{designer.designer_name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{designer.bio}</p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 text-xs">
                    Работ: {designer.works_count || 0}
                  </span>
                  <Link
                    href={`/admin/designers/${designer.id}/works`}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    <ImageIcon size={14} />
                    Работы
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {designers.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">Дизайнеров пока нет</p>
            <Link href="/admin/designers/new" className="inline-block mt-4 px-4 py-2 bg-purple-500 rounded-xl text-white">
              Добавить первого дизайнера
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}