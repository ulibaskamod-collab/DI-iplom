'use client'

export const dynamic = 'force-dynamic'

import { useRouter, useParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X, AlertCircle } from 'lucide-react'
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
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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
    onError: (error) => {
      console.error('Upload error:', error)
      setError(error)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    // Валидация
    if (!formData.work_title) {
      setError('Пожалуйста, заполните название работы')
      return
    }

    setLoading(true)

    // Загружаем изображение
    let imageUrl = ''
    if (imagePreview) {
      const uploadedUrl = await uploadImage()
      if (!uploadedUrl && uploadError) {
        setError('Не удалось загрузить изображение: ' + uploadError)
        setLoading(false)
        return
      }
      imageUrl = uploadedUrl || ''
    }

    const payload = {
      work_title: formData.work_title,
      description: formData.description,
      work_image: imageUrl,
    }

    console.log('📤 Отправляем работу:', payload)

    try {
      const res = await fetch(`/api/admin/designers/${designerId}/works`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      console.log('📥 Ответ:', data)

      if (res.ok) {
        setSuccess('✅ Работа успешно добавлена!')
        setTimeout(() => {
          router.push(`/admin/designers/${designerId}/works`)
        }, 1500)
      } else {
        setError('Ошибка: ' + (data.error || 'Не удалось добавить работу'))
      }
    } catch (error) {
      console.error('❌ Ошибка:', error)
      setError('Ошибка соединения с сервером')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/admin/designers/${designerId}/works`} className="text-gray-400 hover:text-white transition">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Добавить работу</h1>
            <p className="text-white/40 text-sm">Заполните данные и добавьте фото</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
          
          {/* Ошибка */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Успех */}
          {success && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Фото */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Фото работы
            </label>
            <div className="flex flex-wrap items-start gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-48 h-48 object-cover rounded-xl border-2 border-white/10" 
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition"
                    disabled={isUploading}
                  >
                    <X size={14} className="text-white" />
                  </button>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                    </div>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-white/5 transition group">
                  <Upload className="w-8 h-8 text-white/30 group-hover:text-blue-400 transition" />
                  <span className="text-white/40 text-sm mt-2 group-hover:text-blue-400 transition">Загрузить фото</span>
                  <span className="text-white/20 text-xs mt-1">JPG, PNG, WebP</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                    disabled={isUploading}
                  />
                </label>
              )}
              <div className="text-white/40 text-sm">
                {imagePreview && !isUploading && '✅ Изображение загружено'}
                {uploadError && <span className="text-red-400">❌ {uploadError}</span>}
              </div>
            </div>
          </div>

          {/* Название */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Название работы <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.work_title}
              onChange={(e) => setFormData({ ...formData, work_title: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-blue-500 transition placeholder-white/30"
              placeholder="Например: Маленькое чёрное платье"
              disabled={loading}
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Описание
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-blue-500 transition placeholder-white/30 resize-none"
              placeholder="Опишите работу дизайнера..."
              disabled={loading}
            />
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={loading || isUploading}
              className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl text-white font-semibold hover:from-blue-600 hover:to-cyan-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Загрузка фото...
                </>
              ) : loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Добавить работу
                </>
              )}
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