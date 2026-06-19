'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Palette, Globe, ArrowRight, Loader2 } from 'lucide-react'

interface Designer {
  id: number
  designer_name: string
  bio: string
  designer_image: string
  social_links: {
    instagram?: string
    website?: string
  }
}

export default function DesignersPage() {
  const [designers, setDesigners] = useState<Designer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDesigners()
  }, [])

  const fetchDesigners = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/designers')
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      console.log('Получены дизайнеры:', data)
      setDesigners(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching designers:', error)
      setError('Не удалось загрузить дизайнеров')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/50">Загрузка дизайнеров...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
          <button 
            onClick={fetchDesigners}
            className="px-4 py-2 bg-purple-500 rounded-lg text-white hover:bg-purple-600 transition"
          >
            Попробовать снова
          </button>
        </div>
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
            <p className="text-purple-400 mt-2">Добавьте дизайнеров через админ-панель</p>
            <Link href="/admin/designers" className="inline-block mt-6 px-6 py-2 bg-purple-500 rounded-full text-white hover:bg-purple-600 transition">
              Добавить дизайнера
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
                    <img 
                      src={designer.designer_image} 
                      alt={designer.designer_name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', designer.designer_image)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
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
                        <a 
                          href={designer.social_links.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-pink-500/20 text-pink-400 hover:bg-pink-500/40 transition"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                          </svg>
                        </a>
                      )}
                      {designer.social_links?.website && (
                        <a 
                          href={designer.social_links.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/40 transition"
                        >
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