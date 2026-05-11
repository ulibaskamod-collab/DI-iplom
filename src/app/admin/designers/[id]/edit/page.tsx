'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'

interface Designer {
  id: number
  designer_name: string
  bio: string
  designer_image: string
  social_links: {
    instagram?: string
    website?: string
  }
}

export default function EditDesignerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    designer_name: '',
    bio: '',
    designer_image: '',
    instagram: '',
    website: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    fetch(`/api/admin/designers/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          designer_name: data.designer_name || '',
          bio: data.bio || '',
          designer_image: data.designer_image || '',
          instagram: data.social_links?.instagram || '',
          website: data.social_links?.website || '',
        })
        if (data.designer_image) {
          setImagePreview(data.designer_image)
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
        if (uploadData.success) {
          imageUrl = uploadData.url
        }
      } catch (error) {
        console.error('Upload error:', error)
      }
    }

    const social_links = {
      instagram: formData.instagram || null,
      website: formData.website || null,
    }

    try {
      const res = await fetch(`/api/admin/designers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designer_name: formData.designer_name,
          bio: formData.bio,
          designer_image: imageUrl,
          social_links: social_links,
        }),
      })

      if (res.ok) {
        alert('Дизайнер обновлён!')
        router.push('/admin/designers')
      } else {
        const error = await res.json()
        alert('Ошибка: ' + error.error)
      }
    } catch (error) {
      alert('Ошибка соединения')
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
      <div className="max-w-2xl mx-auto px-4 py-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/designers" className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Редактировать: {formData.designer_name}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
          
          <div>
            <label className="block text-white font-medium mb-2">Фото дизайнера</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border-2 border-white/10" />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); setFormData({...formData, designer_image: ''}) }}
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
            <label className="block text-white font-medium mb-2">Имя *</label>
            <input
              type="text"
              required
              value={formData.designer_name}
              onChange={(e) => setFormData({ ...formData, designer_name: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Биография *</label>
            <textarea
              rows={6}
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500"
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

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-purple-500 rounded-xl text-white font-semibold hover:bg-purple-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
              <Save size={18} />
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            <Link href="/admin/designers" className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition text-center">
              Отмена
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}