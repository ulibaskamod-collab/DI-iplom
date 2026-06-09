'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import { useImageUpload } from '@/src/lib/hooks/useImageUpload'

export default function AddWorkPage() {
  const router = useRouter()
  const params = useParams()
  const designerId = params.id as string
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    work_title: '',
    description: '',
  })

  const {
    imagePreview,
    isUploading,
    uploadError,
    handleImageChange,
    uploadImage,
    removeImage,
  } = useImageUpload({
    folder: 'works',
    maxSizeMB: 5,
    onError: (error) => alert(error),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const imageUrl = await uploadImage()

    const payload = {
      work_title: formData.work_title,
      description: formData.description,
      work_image: imageUrl || '',
    }

    try {
      const res = await fetch(`/api/admin/designers/${designerId}/works`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert('Работа успешно добавлена!')
        router.push(`/admin/designers/${designerId}/works`)
      } else {
        const data = await res.json()
        alert('Ошибка: ' + (data.error || 'Не удалось добавить'))
      }
    } catch (error) {
      alert('Ошибка соединения с сервером')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/admin/designers/${designerId}/works`} className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Добавить работу</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
          {/* Фото работы */}
          <div>
            <label className="block text-white font-medium mb-2">Фото работы</label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-500 transition">
                  <Upload className="w-8 h-8 text-white/40" />
                  <span className="text-white/40 text-sm mt-1">Загрузить фото</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
              {isUploading && <span className="text-white/50 text-sm">Загрузка...</span>}
              {uploadError && <span className="text-red-400 text-sm">{uploadError}</span>}
            </div>
          </div>

          {/* Название */}
          <div>
            <label className="block text-white font-medium mb-2">Название *</label>
            <input
              type="text"
              required
              value={formData.work_title}
              onChange={(e) => setFormData({ ...formData, work_title: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-blue-500"
              placeholder="Например: Маленькое чёрное платье"
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-white font-medium mb-2">Описание</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-blue-500"
              placeholder="Опишите работу дизайнера..."
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || isUploading}
              className="flex-1 py-3 bg-blue-500 rounded-xl text-white font-semibold hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading || isUploading ? 'Сохранение...' : 'Добавить работу'}
            </button>
            <Link
              href={`/admin/designers/${designerId}/works`}
              className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition text-center"
            >
              Отмена
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}