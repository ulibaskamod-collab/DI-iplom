'use client'

export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react'
import { BulkImageUpload } from '@/src/components/BulkImageUpload'

export default function BulkUploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedFolder, setSelectedFolder] = useState<'clothing' | 'designers' | 'works'>('clothing')
  const [allData, setAllData] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
  }, [status, router])

  const handleUploadComplete = (data: any[]) => {
    setAllData(prev => [...prev, ...data])
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    )
  }

  const folderInfo = {
    clothing: {
      label: '👕 Одежда',
      description: 'Сначала заполните данные, затем добавьте фото',
      maxItems: 10
    },
    designers: {
      label: '🎨 Дизайнеры',
      description: 'Сначала заполните данные, затем добавьте фото',
      maxItems: 10
    },
    works: {
      label: '🖼️ Работы',
      description: 'Сначала заполните данные, затем добавьте фото',
      maxItems: 10
    }
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
              Заполните данные → Добавьте фото → Сохраните в базу
            </p>
          </div>
        </div>
      </div>

      {/* Выбор типа */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
        <label className="block text-white/70 text-sm font-medium mb-3">
          Выберите тип загрузки
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(folderInfo).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setSelectedFolder(key as any)}
              className={`p-4 rounded-xl text-left transition ${
                selectedFolder === key
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="text-2xl mb-1">{info.label.split(' ')[0]}</div>
              <div className="text-white font-medium">{info.label.split(' ').slice(1).join(' ')}</div>
              <div className="text-white/40 text-xs mt-1">{info.description}</div>
              <div className="text-white/20 text-xs mt-1">Макс. {info.maxItems} записей</div>
            </button>
          ))}
        </div>
      </div>

      {/* Компонент загрузки */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <BulkImageUpload
          folder={selectedFolder}
          maxItems={folderInfo[selectedFolder].maxItems}
          onUploadComplete={handleUploadComplete}
        />
      </div>

      {/* История загрузок */}
      {allData.length > 0 && (
        <div className="mt-6 bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <ImageIcon size={18} className="text-green-400" />
              Всего загружено: {allData.length} записей
            </h3>
            <button
              onClick={() => {
                const text = allData.map((d, i) => `${i+1}. ${d.url}`).join('\n')
                navigator.clipboard.writeText(text)
                alert('Все URL скопированы!')
              }}
              className="text-sm text-pink-400 hover:text-pink-300 transition"
            >
              📋 Копировать все
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {allData.map((item, i) => (
              <div key={i} className="text-white/50 text-xs py-1 border-b border-white/5 last:border-0 flex items-center gap-2">
                <span className="text-white/30">{i+1}.</span>
                <span className="truncate">{item.url}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}