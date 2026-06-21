'use client'

export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Image as ImageIcon, Sparkles } from 'lucide-react'
import { BulkImageUpload } from '@/src/components/BulkImageUpload'
import { AdminButton } from '@/src/components/AdminButton'

export default function BulkUploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedFolder, setSelectedFolder] = useState<'clothing' | 'designers' | 'works' | 'zodiac'>('clothing')
  const [allUrls, setAllUrls] = useState<string[]>([])
  const [zodiacSigns, setZodiacSigns] = useState<{id: number, name: string}[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    // Загружаем знаки зодиака для выбора
    fetch('/api/admin/zodiac')
      .then(res => res.json())
      .then(data => setZodiacSigns(data))
      .catch(console.error)
  }, [status, router])

  const handleUploadComplete = (urls: string[]) => {
    setAllUrls(prev => [...prev, ...urls])
    
    // Показываем уведомление
    alert(`✅ Успешно загружено ${urls.length} фото!\n\nURL сохранены в списке ниже.`)
  }

  if (status === 'loading') {
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
              <Upload className="w-7 h-7 text-pink-400" />
              Массовая загрузка
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              Загрузите до 10 изображений одновременно
            </p>
          </div>
        </div>
      </div>

      {/* Выбор папки */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
        <label className="block text-white/70 text-sm font-medium mb-3">
          Куда загружаем?
        </label>
        <div className="flex flex-wrap gap-3">
          {[
            { value: 'clothing', label: '👕 Одежда', color: 'green' },
            { value: 'designers', label: '🎨 Дизайнеры', color: 'purple' },
            { value: 'works', label: '🖼️ Работы', color: 'blue' },
            { value: 'zodiac', label: '⭐ Знаки зодиака', color: 'yellow' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setSelectedFolder(item.value as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                selectedFolder === item.value
                  ? `bg-${item.color}-500/30 text-${item.color}-300 border border-${item.color}-500/30`
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Выбор знака зодиака (если выбрана одежда) */}
      {selectedFolder === 'clothing' && zodiacSigns.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
          <label className="block text-white/70 text-sm font-medium mb-3">
            Для какого знака зодиака?
          </label>
          <div className="flex flex-wrap gap-2">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.id}
                className="px-3 py-1.5 bg-white/5 rounded-full text-sm text-white/60 hover:bg-white/10 hover:text-white transition border border-white/5"
              >
                {sign.name}
              </button>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-2">
            ⚡ Выберите знак, чтобы связать загруженные фото с ним
          </p>
        </div>
      )}

      {/* Компонент загрузки */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <BulkImageUpload
          folder={selectedFolder}
          maxFiles={10}
          onUploadComplete={handleUploadComplete}
          title={`Загрузка в папку: ${selectedFolder}`}
          description="Выберите до 10 изображений для массовой загрузки"
        />
      </div>

      {/* История загрузок */}
      {allUrls.length > 0 && (
        <div className="mt-6 bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <ImageIcon size={18} className="text-green-400" />
              Загружено: {allUrls.length} файлов
            </h3>
            <button
              onClick={() => {
                const urls = allUrls.map((url, i) => `${i+1}. ${url}`).join('\n')
                navigator.clipboard.writeText(urls)
                alert('Все URL скопированы в буфер обмена!')
              }}
              className="text-sm text-pink-400 hover:text-pink-300 transition"
            >
              📋 Копировать все
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {allUrls.map((url, i) => (
              <div key={i} className="text-white/50 text-xs py-1 border-b border-white/5 last:border-0 flex items-center gap-2">
                <span className="text-white/30">{i+1}.</span>
                <span className="truncate">{url}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}