'use client'

export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'
import { useImageUpload } from '@/src/lib/hooks/useImageUpload'

interface ZodiacSign {
  id: number
  name: string
  slug: string
}

export default function AddClothingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [zodiacSigns, setZodiacSigns] = useState<ZodiacSign[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    season: 'summer',
    gender: 'unisex',
    zodiac_sign_id: 0,
  })

  const {
    imageFile,
    imagePreview,
    isUploading,
    uploadError,
    handleImageChange,
    uploadImage,
    removeImage,
  } = useImageUpload({
    folder: 'clothing',
    maxSizeMB: 5,
    onError: (error) => alert(error),
    // ✅ НЕТ onSuccess
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    // Загружаем знаки зодиака
    fetch('/api/admin/zodiac')
      .then(res => res.json())
      .then(data => setZodiacSigns(data))
      .catch(console.error)
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Загружаем изображение
      const imageUrl = await uploadImage()

      const payload = {
        title: formData.title,
        description: formData.description,
        season: formData.season,
        gender: formData.gender,
        zodiac_sign_id: formData.zodiac_sign_id,
        image_url: imageUrl || '',
      }

      const res = await fetch('/api/admin/clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert('✅ Одежда добавлена!')
        router.push('/admin/clothing')
      } else {
        const error = await res.json()
        alert('❌ Ошибка: ' + (error.error || 'Не удалось добавить'))
      }
    } catch (error) {
      console.error('Ошибка:', error)
      alert('❌ Ошибка соединения с сервером')
    }

    setLoading(false)
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/clothing" className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Добавить одежду</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
          {/* Изображение */}
          <div>
            <label className="block text-white font-medium mb-2">Изображение</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-xl border-2 border-white/10" 
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-500 transition">
                  <Upload className="w-6 h-6 text-white/40" />
                  <span className="text-white/40 text-xs mt-1">Загрузить</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
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
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500"
              placeholder="Введите название..."
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-white font-medium mb-2">Описание</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500"
              placeholder="Введите описание..."
            />
          </div>

          {/* Сезон и Пол */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Сезон</label>
              <select
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500"
              >
                <option value="spring">Весна</option>
                <option value="summer">Лето</option>
                <option value="autumn">Осень</option>
                <option value="winter">Зима</option>
              </select>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Пол</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500"
              >
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
                <option value="unisex">Унисекс</option>
              </select>
            </div>
          </div>

          {/* Знак зодиака */}
          <div>
            <label className="block text-white font-medium mb-2">Знак зодиака *</label>
            <select
              required
              value={formData.zodiac_sign_id}
              onChange={(e) => setFormData({ ...formData, zodiac_sign_id: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500"
            >
              <option value="0">Выберите знак...</option>
              {zodiacSigns.map((sign) => (
                <option key={sign.id} value={sign.id}>
                  {sign.name}
                </option>
              ))}
            </select>
          </div>

          {/* Кнопки */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || isUploading}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading || isUploading ? 'Добавление...' : 'Добавить предмет'}
            </button>
            <Link
              href="/admin/clothing"
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