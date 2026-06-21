'use client'

export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react'
import { BulkImageUpload } from '@/src/components/BulkImageUpload'
import { useRouter } from 'next/router'

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
      description: 'Создайте шаблон и добавьте несколько фото',
    },
    designers: {
      label: '🎨 Дизайнеры',
      description: 'Создайте шаблон и добавьте фото',
    },
    works: {
      label: '🖼️ Работы',
      description: 'Создайте шаблон и добавьте несколько фото',
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
              Создайте шаблон → Добавьте фото → Сохраните
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
            </button>
          ))}
        </div>
      </div>

      {/* Компонент загрузки */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <BulkImageUpload
          folder={selectedFolder}
          onUploadComplete={handleUploadComplete}
        />
      </div>

      {/* История загрузок */}
      {allData.length > 0 && (
        <div className="mt-6 bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium flex items-center gap-2">
              <ImageIcon size={18} className="text-green-400" />
              Всего загружено: {allData.reduce((acc, d) => acc + (d.saved?.length || 0), 0)} записей
            </h3>
            <button
              onClick={() => {
                const text = allData.map((group, gi) => 
                  `${gi+1}. ${group.template?.name || group.template?.work_title || group.template?.designer_name || 'Шаблон'}\n${group.images?.map((url: string, i: number) => `   ${i+1}. ${url}`).join('\n')}`
                ).join('\n\n')
                navigator.clipboard.writeText(text)
                alert('Все данные скопированы!')
              }}
              className="text-sm text-pink-400 hover:text-pink-300 transition"
            >
              📋 Копировать все
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {allData.map((group, gi) => (
              <div key={gi} className="text-white/50 text-xs border-b border-white/5 pb-1">
                <div className="font-medium text-white/70">
                  {gi+1}. {group.template?.name || group.template?.work_title || group.template?.designer_name || 'Шаблон'}
                  {' '}({group.images?.length || 0} фото)
                </div>
                {group.images?.map((url: string, i: number) => (
                  <div key={i} className="pl-4 text-white/30">
                    {i+1}. {url}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}