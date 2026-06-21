'use client'

export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit, Image as ImageIcon, RefreshCw } from 'lucide-react'
import { AdminButton } from '@/src/components/AdminButton'

interface DesignerWork {
  id: number
  work_title: string
  work_image: string
  description: string
  zodiac_sign_id: number | null
  created_at: string
}

interface Designer {
  id: number
  designer_name: string
}

export default function DesignerWorksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const designerId = params.id as string

  const [designer, setDesigner] = useState<Designer | null>(null)
  const [works, setWorks] = useState<DesignerWork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    fetchDesignerAndWorks()
  }, [designerId, status, router])

  const fetchDesignerAndWorks = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Загружаем дизайнера
      const designerRes = await fetch(`/api/admin/designers/${designerId}`)
      if (designerRes.ok) {
        const designerData = await designerRes.json()
        setDesigner(designerData)
      } else {
        setError('Дизайнер не найден')
      }

      // Загружаем работы
      const worksRes = await fetch(`/api/admin/designers/${designerId}/works`)
      if (worksRes.ok) {
        const worksData = await worksRes.json()
        setWorks(Array.isArray(worksData) ? worksData : [])
      } else {
        setWorks([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const deleteWork = async (workId: number) => {
    if (!confirm('Удалить эту работу?')) return

    try {
      const res = await fetch(`/api/admin/designers/${designerId}/works?id=${workId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setWorks(works.filter(w => w.id !== workId))
      } else {
        alert('Ошибка при удалении')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Ошибка при удалении')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    )
  }

  if (error && !designer) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400 text-lg">{error}</p>
        <button
          onClick={fetchDesignerAndWorks}
          className="mt-4 px-4 py-2 bg-pink-500 rounded-xl text-white hover:bg-pink-600 transition"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/designers" className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-white/5">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <ImageIcon className="w-7 h-7 text-blue-400" />
              Работы: {designer?.designer_name || 'Загрузка...'}
            </h1>
            <p className="text-white/40 text-sm mt-0.5 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                {works.length} работ
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDesignerAndWorks}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-white/60 hover:text-white"
            title="Обновить"
          >
            <RefreshCw size={18} />
          </button>
          <Link href={`/admin/designers/${designerId}/edit`}>
            <AdminButton
              variant="primary"
              size="sm"
              icon={<Edit size={16} />}
            >
              Дизайнер
            </AdminButton>
          </Link>
          <Link href={`/admin/designers/${designerId}/works/new`}>
            <AdminButton
              variant="success"
              size="md"
              icon={<Plus size={18} />}
            >
              Добавить работу
            </AdminButton>
          </Link>
        </div>
      </div>

      {/* Список работ */}
      {works.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <ImageIcon className="w-20 h-20 text-blue-500 mx-auto mb-4 opacity-50" />
          <p className="text-xl text-blue-300">Работ пока нет</p>
          <p className="text-blue-400/50 text-sm mt-2">Добавьте первую работу для этого дизайнера</p>
          <Link href={`/admin/designers/${designerId}/works/new`} className="inline-block mt-4">
            <AdminButton variant="success" icon={<Plus size={18} />}>
              Добавить первую работу
            </AdminButton>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {works.map((work) => (
            <div key={work.id} className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center relative">
                {work.work_image ? (
                  <img 
                    src={work.work_image} 
                    alt={work.work_title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-blue-400 opacity-50" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <Link href={`/admin/designers/${designerId}/works/${work.id}/edit`}>
                    <button className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition" title="Редактировать">
                      <Edit size={16} className="text-white" />
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteWork(work.id)}
                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition" title="Удалить"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-white font-semibold truncate">{work.work_title}</h3>
                {work.description && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{work.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}