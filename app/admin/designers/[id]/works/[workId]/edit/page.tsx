'use client'
export const dynamic = 'force-dynamic'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'

export default function EditWorkPage() {
  const router = useRouter()
  const params = useParams()
  const designerId = params.id as string
  const workId = params.workId as string

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({ work_title: '', description: '', work_image: '' })

  useEffect(() => {
    fetch(`/api/admin/designers/${designerId}/works/${workId}`)
      .then(res => res.json())
      .then(data => {
        setFormData({ work_title: data.work_title || '', description: data.description || '', work_image: data.work_image || '' })
        if (data.work_image) setImagePreview(data.work_image)
      })
      .finally(() => setPageLoading(false))
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    let imageUrl = formData.work_image

    if (imageFile) {
      const fd = new FormData(); fd.append('image', imageFile); fd.append('folder', 'works')
      const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (uploadData.success) imageUrl = uploadData.url
    }

    const res = await fetch(`/api/admin/designers/${designerId}/works/${workId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ work_title: formData.work_title, description: formData.description, work_image: imageUrl }),
    })

    if (res.ok) { router.push(`/admin/designers/${designerId}/works`) } else { alert('Ошибка') }
    setLoading(false)
  }

  if (pageLoading) return <div className="flex justify-center items-center h-screen bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div></div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/admin/designers/${designerId}/works`} className="text-gray-400 hover:text-white"><ArrowLeft size={24} /></Link>
          <h1 className="text-3xl font-bold text-white">Редактировать работу</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 rounded-2xl p-6 border border-white/10">
          <div>
            <label className="block text-white font-medium mb-2">Фото</label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded-xl" />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }} className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full"><X size={14} /></button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-500 transition">
                <Upload className="w-8 h-8 text-white/40" /><span className="text-white/40 text-sm mt-1">Загрузить</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
          <div><label className="block text-white font-medium mb-2">Название *</label><input type="text" required value={formData.work_title} onChange={(e) => setFormData({ ...formData, work_title: e.target.value })} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-blue-500" /></div>
          <div><label className="block text-white font-medium mb-2">Описание</label><textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-blue-500" /></div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-500 rounded-xl text-white font-semibold hover:bg-blue-600 transition disabled:opacity-50"><Save size={18} /> Сохранить</button>
        </form>
      </div>
    </div>
  )
}