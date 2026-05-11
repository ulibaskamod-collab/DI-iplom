'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Edit, Image as ImageIcon } from 'lucide-react'

interface DesignerWork {
  id: number
  work_title: string
  work_image: string
  description: string
  zodiac_sign_id: number | null
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    fetch(`/api/admin/designers/${designerId}`)
      .then(res => res.json())
      .then(data => {
        setDesigner({ id: data.id, designer_name: data.designer_name })
      })
      .catch(console.error)

    fetch(`/api/admin/designers/${designerId}/works`)
      .then(res => res.json())
      .then(data => setWorks(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [designerId, status, router])

  const deleteWork = async (workId: number) => {
    if (confirm('Удалить эту работу?')) {
      await fetch(`/api/admin/designers/${designerId}/works?id=${workId}`, { method: 'DELETE' })
      setWorks(works.filter(w => w.id !== workId))
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
            <Link href="/admin/designers" className="text-gray-400 hover:text-white">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Работы: {designer?.designer_name}</h1>
              <p className="text-gray-400 text-sm mt-1">{works.length} работ</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/admin/designers/${designerId}/edit`}
              className="px-4 py-2 bg-purple-500 rounded-xl text-white hover:bg-purple-600 transition flex items-center gap-2"
            >
              <Edit size={16} />
              Дизайнер
            </Link>
            <Link
              href={`/admin/designers/${designerId}/works/new`}
              className="px-4 py-2 bg-blue-500 rounded-xl text-white hover:bg-blue-600 transition flex items-center gap-2"
            >
              <Plus size={16} />
              Добавить работу
            </Link>
          </div>
        </div>

        {works.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400">Работ пока нет</p>
            <Link
              href={`/admin/designers/${designerId}/works/new`}
              className="inline-block mt-4 px-6 py-2 bg-blue-500 rounded-xl text-white hover:bg-blue-600 transition"
            >
              Добавить первую работу
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {works.map((work) => (
              <div key={work.id} className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition">
                <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center relative">
                  {work.work_image ? (
                    <img src={work.work_image} alt={work.work_title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-blue-400 opacity-50" />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <Link
                      href={`/admin/designers/${designerId}/works/${work.id}/edit`}
                      className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition"
                    >
                      <Edit size={16} className="text-white" />
                    </Link>
                    <button
                      onClick={() => deleteWork(work.id)}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
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
    </div>
  )
}