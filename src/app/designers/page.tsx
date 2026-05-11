'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Palette, Globe, ArrowRight } from 'lucide-react'

interface Designer {
  id: number
  designer_name: string
  bio: string
  designer_image: string
  social_links: any
}

export default function DesignersPage() {
  const [designers, setDesigners] = useState<Designer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/designers')
      .then(res => res.json())
      .then(data => {
        setDesigners(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        <div className="text-center mb-16">
          <Palette className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white mb-4">Дизайнеры</h1>
          <p className="text-purple-300 text-lg max-w-2xl mx-auto">
            Великие кутюрье, чьи творения вдохновляют стиль знаков зодиака
          </p>
        </div>

        {designers.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <Palette className="w-20 h-20 text-purple-500 mx-auto mb-4 opacity-50" />
            <p className="text-2xl text-purple-300">Дизайнеры скоро появятся</p>
            <p className="text-purple-400 mt-2">Мы работаем над наполнением этого раздела</p>
            <Link href="/" className="inline-block mt-6 px-6 py-2 bg-purple-500 rounded-full text-white hover:bg-purple-600 transition">
              На главную
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designers.map((designer) => (
              <div 
                key={designer.id} 
                className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center relative overflow-hidden">
                  {designer.designer_image ? (
                    <img src={designer.designer_image} alt={designer.designer_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Palette className="w-24 h-24 text-purple-400 opacity-50 mx-auto" />
                      <p className="text-purple-300 mt-2 text-sm">{designer.designer_name}</p>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3">{designer.designer_name}</h3>
                  <p className="text-purple-300/80 text-sm leading-relaxed line-clamp-3 mb-4">
                    {designer.bio}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      {designer.social_links?.instagram && (
                        <a href={designer.social_links.instagram} target="_blank" className="p-2 rounded-full bg-pink-500/20 text-pink-400 hover:bg-pink-500/40 transition">
                        </a>
                      )}
                      {designer.social_links?.website && (
                        <a href={designer.social_links.website} target="_blank" className="p-2 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/40 transition">
                          <Globe size={18} />
                        </a>
                      )}
                    </div>
                    <Link
                      href={`/designers/${designer.id}`}
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition text-sm"
                    >
                      Подробнее <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}