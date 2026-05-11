'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, X, Sparkles } from 'lucide-react'

export default function AddZodiacPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

    let imageUrl = null
    
    if (imageFile) {
      const formDataImg = new FormData()
      formDataImg.append('image', imageFile)
      formDataImg.append('folder', 'zodiac')
      
      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataImg,
      })
      const uploadData = await uploadRes.json()
      if (uploadData.success) {
        imageUrl = uploadData.url
      }
    }

    const colorsArray = formData.colors.split(',').map(c => c.trim())

    const res = await fetch('/api/admin/zodiac', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        colors: colorsArray,
        image_url: imageUrl,
      }),
    })

    if (res.ok) {
      router.push('/admin/zodiac')
    } else {
      alert('Ошибка при сохранении')
    }
    setLoading(false)
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/zodiac" className="text-white/60 hover:text-white transition">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Добавить знак зодиака</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <label className="block text-white font-medium mb-2">Изображение знака</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-pink-500 transition">
                  <Upload className="w-6 h-6 text-white/40" />
                  <span className="text-white/40 text-xs mt-1">Загрузить</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
              <p className="text-white/40 text-sm">Рекомендуемый размер: 500x500px</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Название *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-pink-500"
                  placeholder="Например: Лев"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-pink-500"
                  placeholder="Например: lev"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Стихия</label>
                <select
                  value={formData.element}
                  onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-pink-500"
                >
                  <option value="fire">🔥 Огонь</option>
                  <option value="earth">🌍 Земля</option>
                  <option value="air">💨 Воздух</option>
                  <option value="water">💧 Вода</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-white font-medium mb-2">Дата начала</label>
                  <input
                    type="text"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-pink-500"
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
                    className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-pink-500"
                    placeholder="DD.MM"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Описание</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-pink-500"
                placeholder="Подробное описание знака..."
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Описание стиля</label>
              <textarea
                rows={3}
                value={formData.style_desc}
                onChange={(e) => setFormData({ ...formData, style_desc: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-pink-500"
                placeholder="Описание стиля одежды для этого знака..."
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Цвета (через запятую)</label>
              <input
                type="text"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-pink-500"
                placeholder="Например: #FFD700, #8B008B, #FF4500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : 'Создать знак'}
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