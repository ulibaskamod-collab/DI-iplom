'use client'
export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'

interface ZodiacSign {
  id: number
  name: string
  slug: string
  element: string
  start_date: string
  end_date: string
  description: string
  style_desc: string
  colors: string[]
  image_url: string | null
}

export default function EditZodiacPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    element: 'fire',
    start_date: '',
    end_date: '',
    description: '',
    style_desc: '',
    colors: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    fetch(`/api/admin/zodiac/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          element: data.element || 'fire',
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          description: data.description || '',
          style_desc: data.style_desc || '',
          colors: Array.isArray(data.colors) ? data.colors.join(', ') : '',
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

    let imageUrl = imagePreview

    // Если загружено новое изображение
    if (imageFile) {
      const formDataImg = new FormData()
      formDataImg.append('image', imageFile)
      formDataImg.append('folder', 'zodiac')

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

    const colorsArray = formData.colors
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0)

    const payload = {
      id: parseInt(id),
      name: formData.name,
      slug: formData.slug,
      element: formData.element,
      start_date: formData.start_date,
      end_date: formData.end_date,
      description: formData.description,
      style_desc: formData.style_desc,
      colors: colorsArray,
      image_url: imageUrl,
    }

    console.log('Обновляю знак:', payload)

    try {
      const res = await fetch('/api/admin/zodiac', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        alert('Знак зодиака успешно обновлён!')
        router.push('/admin/zodiac')
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
          <Link href="/admin/zodiac" className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Редактировать знак: {formData.name}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
          
          <div>
            <label className="block text-white font-medium mb-2">Изображение знака</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null) }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-yellow-500 transition">
                  <Upload className="w-6 h-6 text-white/40" />
                  <span className="text-white/40 text-xs mt-1">Загрузить</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Название *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Стихия</label>
              <select
                value={formData.element}
                onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-yellow-500"
              >
                <option value="fire">🔥 Огонь</option>
                <option value="earth">🌍 Земля</option>
                <option value="air">💨 Воздух</option>
                <option value="water">💧 Вода</option>
              </select>
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Дата начала</label>
              <input
                type="text"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-yellow-500"
                placeholder="DD.MM"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Дата конца</label>
              <input
                type="text"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-yellow-500"
                placeholder="DD.MM"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Описание</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Описание стиля</label>
            <textarea
              rows={3}
              value={formData.style_desc}
              onChange={(e) => setFormData({ ...formData, style_desc: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Цвета (через запятую)</label>
            <input
              type="text"
              value={formData.colors}
              onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-yellow-500"
              placeholder="#FF0000, #00FF00, #0000FF"
            />
            {formData.colors && (
              <div className="flex gap-2 mt-2">
                {formData.colors.split(',').filter(Boolean).map((color, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: color.trim() }}
                    title={color.trim()}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-yellow-500 rounded-xl text-white font-semibold hover:bg-yellow-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            <Link
              href="/admin/zodiac"
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