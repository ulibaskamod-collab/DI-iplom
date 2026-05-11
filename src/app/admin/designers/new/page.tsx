'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'

export default function AddDesignerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    designer_name: '',
    bio: '',
    designer_image: '',
    instagram: '',
    website: '',
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

  let imageUrl = formData.designer_image

  if (imageFile) {
    const formDataImg = new FormData()
    formDataImg.append('image', imageFile)
    formDataImg.append('folder', 'designers')

    try {
      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataImg,
      })
      const uploadData = await uploadRes.json()
      console.log('Upload result:', uploadData)
      
      if (uploadData.success) {
        imageUrl = uploadData.url
      } else {
        console.warn('Upload failed, using default image')
      }
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  const social_links = {
    instagram: formData.instagram || null,
    website: formData.website || null,
  }

  const payload = {
    designer_name: formData.designer_name,
    bio: formData.bio,
    designer_image: imageUrl || '/images/designers/default.jpg',
    social_links: social_links,
  }

  console.log('Отправляю дизайнера:', payload)

  try {
    const res = await fetch('/api/admin/designers/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    console.log('Ответ сервера:', data)

    if (res.ok) {
      alert('Дизайнер успешно добавлен!')
      router.push('/admin/designers')
    } else {
      alert('Ошибка: ' + (data.error || 'Неизвестная ошибка'))
    }
  } catch (error: any) {
    console.error('Fetch error:', error)
    alert('Ошибка соединения с сервером: ' + error.message)
  }

  setLoading(false)
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/designers" className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Добавить дизайнера</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
          
          {/* Фото */}
          <div>
            <label className="block text-white font-medium mb-2">Фото дизайнера</label>
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
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-500 transition">
                  <Upload className="w-6 h-6 text-white/40" />
                  <span className="text-white/40 text-xs mt-1">Загрузить</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Имя дизайнера *</label>
            <input
              type="text"
              required
              value={formData.designer_name}
              onChange={(e) => setFormData({ ...formData, designer_name: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500"
              placeholder="Например: Коко Шанель"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Биография *</label>
            <textarea
              rows={5}
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500"
              placeholder="История дизайнера, его вклад в моду..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div>
              <label className="block text-white font-medium mb-2">Веб-сайт</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500"
                placeholder="https://..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-500 rounded-xl text-white font-semibold hover:bg-purple-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Сохранение...' : 'Добавить дизайнера'}
          </button>

        </form>
      </div>
    </div>
  )
}