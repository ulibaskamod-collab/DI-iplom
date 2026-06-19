'use client'

export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Palette, Trash2, Plus, Edit, Eye, Image as ImageIcon, RefreshCw } from 'lucide-react'
import { AdminButton } from '@/src/components/AdminButton'

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
    setLoading(true)
    try {
      const res = await fetch('/api/admin/designers')
      const data = await res.json()
      setDesigners(Array.isArray(data) ? data : [])
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
              <Palette className="w-7 h-7 text-purple-400" />
              Дизайнеры
            </h1>
            <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                {designers.length}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            variant="ghost"
            size="sm"
            icon={<RefreshCw size={16} />}
            onClick={fetchDesigners}
            title="Обновить" children={undefined}          />
          <Link href="/admin/designers/new">
            <AdminButton
              variant="primary"
              size="md"
              icon={<Plus size={18} />}
            >
              Добавить дизайнера
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* Список дизайнеров */}
      {designers.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <Palette className="w-20 h-20 text-purple-500 mx-auto mb-4 opacity-50" />
          <p className="text-xl text-purple-300">Дизайнеров пока нет</p>
          <Link href="/admin/designers/new" className="inline-block mt-4">
            <AdminButton variant="primary" icon={<Plus size={18} />}>
              Добавить первого дизайнера
            </AdminButton>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {designers.map((designer) => (
            <div key={designer.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition group">
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center relative">
                {designer.designer_image ? (
                  <img src={designer.designer_image} alt={designer.designer_name} className="w-full h-full object-cover" />
                ) : (
                  <Palette className="w-20 h-20 text-purple-400 opacity-50" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <Link href={`/admin/designers/${designer.id}/edit`}>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      icon={<Edit size={18} className="text-white" />}
                      title="Редактировать" children={undefined}                    />
                  </Link>
                  <Link href={`/admin/designers/${designer.id}/works`}>
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      icon={<ImageIcon size={18} className="text-white" />}
                      title="Управление работами" children={undefined}                    />
                  </Link>
                  <Link href={`/designers/${designer.id}`} target="_blank">
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      icon={<Eye size={18} className="text-white" />}
                      title="Посмотреть на сайте" children={undefined}                    />
                  </Link>
                  <AdminButton
                    variant="danger"
                    size="sm"
                    icon={<Trash2 size={18} className="text-white" />}
                    onClick={() => deleteDesigner(designer.id)}
                    title="Удалить" children={undefined}                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{designer.designer_name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{designer.bio}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  <span className="text-purple-300 text-xs">
                    Работ: {designer.works_count || 0}
                  </span>
                  <Link href={`/admin/designers/${designer.id}/works`} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                    <ImageIcon size={14} />
                    Работы
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}