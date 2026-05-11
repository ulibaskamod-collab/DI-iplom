'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'

interface ZodiacSign {
  id: number
  name: string
}

interface ClothingItem {
  id: number
  title: string
  description: string
  image_url: string
  season: string
  gender: string
  zodiac_sign_id: number
}

export default function EditClothingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [zodiacSigns, setZodiacSigns] = useState<ZodiacSign[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    season: 'summer',
    gender: 'unisex',
    zodiac_sign_id: '',
  })

  useEffect(() => {
    fetch('/api/admin/zodiac')
      .then(res => res.json())
      .then(data => setZodiacSigns(data))
      .catch(console.error)
  }, [])

  // Загружаем данные предмета одежды
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
          image_url: data.image_url || '',
          season: data.season || 'summer',
          gender: data.gender || 'unisex',
          zodiac_sign_id: String(data.zodiac_sign_id || ''),
        })
        if (data.image_url) {
          setImagePreview(data.image_url)
        }
      })
      .catch(console.error)
      .finally(() => setPageLoading(false))
  }, [id, status, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = formData.image_url

    // Если загружено новое изображение
    if (imageFile) {
      const formDataImg = new FormData()
      formDataImg.append('image', imageFile)
      formDataImg.append('folder', 'clothing')

      try {
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formDataImg,
        })
        const uploadData = await uploadRes.json()
        if (uploadData.success) {
          imageUrl = uploadData.url
        }
      } catch (error) {
        console.error('Upload error:', error)
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

    console.log('Обновляю одежду:', payload)

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

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/clothing" className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Редактировать: {formData.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
          
          <div>
            <label className="block text-white font-medium mb-2">Фото предмета</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-40 h-40 object-cover rounded-xl border-2 border-white/10" 
                  />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); setFormData({...formData, image_url: ''}) }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-green-500 transition">
                  <Upload className="w-8 h-8 text-white/40" />
                  <span className="text-white/40 text-xs mt-1">Загрузить фото</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
              <div className="text-white/40 text-sm">
                {imagePreview ? 'Нажмите X чтобы удалить' : 'Нажмите чтобы загрузить'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Название *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-green-500"
              placeholder="Например: Кожаная куртка"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Описание</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-green-500"
              placeholder="Опишите предмет одежды..."
            />
          </div>

         

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Сезон</label>
              <select
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-green-500"
              >
                <option value="summer">☀️ Лето</option>
                <option value="winter">❄️ Зима</option>
                <option value="spring">🌸 Весна</option>
                <option value="autumn">🍂 Осень</option>
              </select>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Пол</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-green-500"
              >
                <option value="unisex">👥 Унисекс</option>
                <option value="female">👩 Женский</option>
                <option value="male">👨 Мужской</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Знак зодиака *</label>
            <select
              required
              value={formData.zodiac_sign_id}
              onChange={(e) => setFormData({ ...formData, zodiac_sign_id: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-green-500"
            >
              <option value="">Выберите знак...</option>
              {zodiacSigns.map((sign) => (
                <option key={sign.id} value={sign.id}>
                  {sign.name} (ID: {sign.id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-green-500 rounded-xl text-white font-semibold hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
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