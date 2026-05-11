'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Palette,  Globe, Star, Shirt } from 'lucide-react'

interface Designer {
  id: number
  designer_name: string
  bio: string
  designer_image: string
  social_links: any
}

interface DesignerWork {
  id: number
  work_title: string
  work_image: string
  description: string
  zodiac_sign_id: number
}

export default function DesignerDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [designer, setDesigner] = useState<Designer | null>(null)
  const [works, setWorks] = useState<DesignerWork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/designers/${id}`)
      .then(res => res.json())
      .then(data => {
        setDesigner(data.designer)
        setWorks(data.works || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!designer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Дизайнер не найден</h1>
          <Link href="/designers" className="text-pink-400 hover:text-pink-300">
            ← К списку дизайнеров
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="relative h-[400px] bg-gradient-to-b from-purple-900/40 to-black/80">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-12">
          <div className="flex items-end gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-white/20">
              {designer.designer_image ? (
                <img src={designer.designer_image} alt={designer.designer_name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <Palette className="w-16 h-16 text-white" />
              )}
            </div>
            <div>
              <Link href="/designers" className="text-purple-400 hover:text-purple-300 text-sm mb-2 inline-block">
                ← Назад к дизайнерам
              </Link>
              <h1 className="text-5xl font-bold text-white">{designer.designer_name}</h1>
              <div className="flex gap-3 mt-3">
                {designer.social_links?.instagram && (
                  <a href={designer.social_links.instagram} target="_blank" className="p-2 rounded-full bg-pink-500/20 text-pink-400 hover:bg-pink-500/40 transition">
                  </a>
                )}
                {designer.social_links?.website && (
                  <a href={designer.social_links.website} target="_blank" className="p-2 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/40 transition">
                    <Globe size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white/5 rounded-2xl p-8 mb-12 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="text-yellow-400" size={24} />
            Биография
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">{designer.bio}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shirt className="text-purple-400" size={24} />
            Работы и коллекции
          </h2>
          
          {works.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {works.map((work) => (
                <div key={work.id} className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition">
                  <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    {work.work_image ? (
                      <img src={work.work_image} alt={work.work_title} className="w-full h-full object-cover" />
                    ) : (
                      <Palette className="w-12 h-12 text-purple-400 opacity-50" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold">{work.work_title}</h3>
                    {work.description && (
                      <p className="text-purple-300 text-sm mt-1">{work.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <Palette className="w-16 h-16 text-purple-500 mx-auto mb-4 opacity-50" />
              <p className="text-purple-300 text-lg">Работы скоро будут добавлены</p>
              <p className="text-purple-400 text-sm mt-2">Мы собираем коллекцию работ этого дизайнера</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}