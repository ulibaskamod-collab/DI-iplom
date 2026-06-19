'use client'

export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Image as ImageIcon, X, Upload } from 'lucide-react'
import { useImageUpload } from '@/src/lib/hooks/useImageUpload'
import { AdminButton } from '@/src/components/AdminButton'

interface ZodiacSign {
  id: number
  name: string
}

export default function EditClothingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [zodiacSigns, setZodiacSigns] = useState<ZodiacSign[]>([])
  const [existingImageUrl, setExistingImageUrl] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    season: 'summer',
    gender: 'unisex',
    zodiac_sign_id: '',
  })

  const {
    imagePreview,
    isUploading,
    uploadError,
    handleImageChange,
    uploadImage,
    removeImage,
    setImagePreview,
  } = useImageUpload({
    folder: 'clothing',
    maxSizeMB: 5,
    onSuccess: (url) => {
      console.log('Новое фото загружено:', url)
    },
    onError: (error) => {
      alert(error)
    },
  })

  // Загружаем знаки зодиака
  useEffect(() => {
    fetch('/api/admin/zodiac')
      .then(res => res.json())
      .then(data => setZodiacSigns(data))
      .catch(console.error)
  }, [])

  // Загружаем данные предмета
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    fetch(`/api/admin/clothing/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          season: data.season || 'summer',
          gender: data.gender || 'unisex',
          zodiac_sign_id: String(data.zodiac_sign_id || ''),
        })

        if (data.image_url) {
          setExistingImageUrl(data.image_url)
          setImagePreview(data.image_url)
        }
      })
      .catch(console.error)
      .finally(() => setPageLoading(false))
  }, [id, status, router, setImagePreview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = existingImageUrl

    if (imagePreview && imagePreview !== existingImageUrl) {
      const uploadedUrl = await uploadImage()
      if (uploadedUrl) {
        imageUrl = uploadedUrl
      } else if (uploadError) {
        alert('Не удалось загрузить новое изображение')
        setLoading(false)
        return
      }
    }

    const payload = {
      id: parseInt(id),
      title: formData.title,
      description: formData.description,
      image_url: imageUrl,
      season: formData.season,
      gender: formData.gender,
      zodiac_sign_id: Number(formData.zodiac_sign_id),
    }

    try {
      const res = await fetch('/api/admin/clothing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (res.ok) {
        alert('Предмет одежды успешно обновлён!')
        router.push('/admin/clothing')
      } else {
        alert('Ошибка: ' + (data.error || 'Не удалось обновить'))
      }
    } catch (error) {
      alert('Ошибка соединения с сервером')
    }
    setLoading(false)
  }

  const handleRemoveImage = () => {
    removeImage()
    setExistingImageUrl('')
  }

  if (pageLoading) {
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
          <Link 
            href="/admin/clothing" 
            className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <ImageIcon className="w-7 h-7 text-green-400" />
              Редактировать
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              {formData.title || 'Без названия'}
            </p>
          </div>
        </div>
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
        
        {/* Поле: Фото */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">
            Фото предмета
          </label>
          <div className="flex flex-wrap items-start gap-6">
            {imagePreview ? (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Предпросмотр"
                  className="w-48 h-48 object-cover rounded-2xl border-2 border-green-500/30 shadow-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition shadow-lg"
                  disabled={isUploading}
                >
                  <X size={16} className="text-white" />
                </button>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  </div>
                )}
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-green-500 hover:bg-green-500/5 transition-all group">
                <Upload size={32} className="text-white/30 group-hover:text-green-400 group-hover:scale-110 transition" />
                <span className="text-white/40 text-sm mt-2 group-hover:text-green-400 transition">Загрузить фото</span>
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
            <div className="flex-1 text-sm text-white/50">
              {imagePreview ? (
                isUploading ? 'Загрузка...' : 'Нажмите ✕ чтобы удалить'
              ) : (
                'Нажмите чтобы загрузить'
              )}
              {uploadError && (
                <p className="text-red-400 mt-2">❌ {uploadError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Поле: Название */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">
            Название <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-green-500 transition placeholder-white/30"
            placeholder="Например: Кожаная куртка"
          />
        </div>

        {/* Поле: Описание */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">
            Описание
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-green-500 transition placeholder-white/30 resize-none"
            placeholder="Опишите предмет..."
          />
        </div>

        {/* Поля: Сезон и Пол */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Сезон
            </label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-green-500 transition cursor-pointer appearance-none"
            >
              <option value="summer" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>☀️ Лето</option>
              <option value="winter" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>❄️ Зима</option>
              <option value="spring" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>🌸 Весна</option>
              <option value="autumn" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>🍂 Осень</option>
            </select>
          </div>
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Пол
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-green-500 transition cursor-pointer appearance-none"
            >
              <option value="unisex" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>👥 Унисекс</option>
              <option value="female" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>👩 Женский</option>
              <option value="male" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>👨 Мужской</option>
            </select>
          </div>
        </div>

        {/* Поле: Знак зодиака */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">
            Знак зодиака <span className="text-red-400">*</span>
          </label>
          <select
            required
            value={formData.zodiac_sign_id}
            onChange={(e) => setFormData({ ...formData, zodiac_sign_id: e.target.value })}
            className="w-full px-4 py-2.5 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-green-500 transition cursor-pointer appearance-none"
          >
            <option value="" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>
              Выберите знак...
            </option>
            {zodiacSigns.map((sign) => (
              <option key={sign.id} value={sign.id} style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>
                {sign.name} (ID: {sign.id})
              </option>
            ))}
          </select>
        </div>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <AdminButton
            type="submit"
            variant="primary"
            size="lg"
            icon={loading || isUploading ? undefined : <Save size={18} />}
            fullWidth
            disabled={loading || isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Загрузка фото...
              </>
            ) : loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Сохранение...
              </>
            ) : (
              'Сохранить изменения'
            )}
          </AdminButton>
          
          <Link href="/admin/clothing" className="sm:w-auto w-full">
            <AdminButton variant="ghost" size="lg" fullWidth>
              Отмена
            </AdminButton>
          </Link>
        </div>
      </form>
    </div>
  )
}