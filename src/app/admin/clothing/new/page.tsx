'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react'

interface ZodiacSign {
  id: number
  name: string
}

export default function AddClothingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [zodiacSigns, setZodiacSigns] = useState<ZodiacSign[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    season: 'summer',
    gender: 'unisex',
    zodiac_sign_id: '',
  })

  useEffect(() => {
    fetch('/api/admin/zodiac')
      .then(res => res.json())
      .then(data => {
        setZodiacSigns(data)
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, zodiac_sign_id: String(data[0].id) }))
        }
      })
      .catch(console.error)
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Файл слишком большой! Максимальный размер: 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение!')
        return
      }

      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = '/images/clothing/default.jpg' // Дефолтное фото

    if (imageFile) {
      setUploading(true)
      const imageFormData = new FormData()
      imageFormData.append('image', imageFile)
      imageFormData.append('folder', 'clothing')

      try {
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: imageFormData,
        })
        const uploadData = await uploadRes.json()
        
        if (uploadData.success) {
          imageUrl = uploadData.url
          console.log('Фото загружено:', imageUrl)
        } else {
          alert('Ошибка загрузки фото: ' + uploadData.error)
          setLoading(false)
          setUploading(false)
          return
        }
      } catch (error) {
        console.error('Ошибка загрузки:', error)
        alert('Не удалось загрузить фото. Проверьте соединение.')
        setLoading(false)
        setUploading(false)
        return
      }
      setUploading(false)
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      image_url: imageUrl,
      season: formData.season,
      gender: formData.gender,
      zodiac_sign_id: Number(formData.zodiac_sign_id),
    }

    console.log('Отправляю предмет:', payload)

    try {
      const res = await fetch('/api/admin/clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        alert('Предмет одежды успешно добавлен!')
        router.push('/admin/clothing')
      } else {
        alert('Ошибка: ' + (data.error || 'Не удалось добавить'))
      }
    } catch (error) {
      console.error('Ошибка:', error)
      alert('Ошибка соединения с сервером')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/clothing" className="text-gray-400 hover:text-white transition">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Добавить одежду</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <label className="block text-white font-medium mb-3 flex items-center gap-2">
              <ImageIcon size={20} className="text-green-400" />
              Фото предмета *
            </label>
            
            <div className="flex items-start gap-6">
              {imagePreview ? (
                <div className="relative group">
                  <img 
                    src={imagePreview} 
                    alt="Предпросмотр" 
                    className="w-48 h-48 object-cover rounded-2xl border-2 border-green-500/30 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition shadow-lg"
                  >
                    <X size={16} className="text-white" />
                  </button>
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <p className="text-white text-sm">Нажмите ✕ чтобы удалить</p>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-green-500 hover:bg-green-500/5 transition-all group">
                  <Upload className="w-10 h-10 text-white/30 group-hover:text-green-400 group-hover:scale-110 transition" />
                  <span className="text-white/40 text-sm mt-2 group-hover:text-green-400 transition">Загрузить фото</span>
                  <span className="text-white/20 text-xs mt-1">JPG, PNG, WebP</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </label>
              )}

              <div className="flex-1 text-sm text-white/50 space-y-2">
                <p>📸 <span className="text-white/70">Загрузите фото предмета одежды</span></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Рекомендуемый размер: 800x800 пикселей</li>
                  <li>Максимальный размер файла: 5MB</li>
                  <li>Поддерживаемые форматы: JPG, PNG, WebP</li>
                  <li>Фото автоматически обрежется до квадрата</li>
                </ul>
                {imageFile && (
                  <p className="text-green-400 mt-2">
                    ✅ Файл выбран: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-5">
            
            <div>
              <label className="block text-white font-medium mb-2">Название *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-green-500 transition placeholder-white/30"
                placeholder="Например: Кожаная куртка-косуха"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Описание</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-green-500 transition placeholder-white/30 resize-none"
                placeholder="Опишите предмет: материал, цвет, особенности кроя..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Сезон</label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-green-500 transition cursor-pointer"
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
                  className="w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-green-500 transition cursor-pointer"
                >
                  <option value="unisex"> Унисекс</option>
                  <option value="female"> Женский</option>
                  <option value="male"> Мужской</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Знак зодиака *</label>
              <select
                required
                value={formData.zodiac_sign_id}
                onChange={(e) => setFormData({ ...formData, zodiac_sign_id: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-green-500 transition cursor-pointer"
              >
                <option value="">Выберите знак...</option>
                {zodiacSigns.map((sign) => (
                  <option key={sign.id} value={sign.id}>
                    {sign.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Загрузка фото...
                </>
              ) : loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Сохранение...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Добавить предмет
                </>
              )}
            </button>
            <Link
              href="/admin/clothing"
              className="px-8 py-4 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition text-center flex items-center"
            >
              Отмена
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}