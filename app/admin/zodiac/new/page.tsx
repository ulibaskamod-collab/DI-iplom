'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, X } from 'lucide-react'

export default function NewZodiacPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    element: 'Огонь',
    start_date: '',
    end_date: '',
    description: '',
    style_desc: '',
    colors: ['', '', '', '', ''],
    image_url: ''
  })

  const elements = ['Огонь', 'Земля', 'Воздух', 'Вода']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/zodiac', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          colors: formData.colors.filter(c => c.trim() !== '')
        })
      })

      if (response.ok) {
        router.push('/admin/zodiac')
      } else {
        alert('Ошибка при создании знака')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Ошибка при создании знака')
    } finally {
      setLoading(false)
    }
  }

  const updateColor = (index: number, value: string) => {
    const newColors = [...formData.colors]
    newColors[index] = value
    setFormData({ ...formData, colors: newColors })
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/zodiac"
          className="p-2 rounded-xl hover:bg-white/10 transition text-white/40 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Добавить знак зодиака</h1>
          <p className="text-white/40 text-sm mt-1">Создание нового знака</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6">
          {/* Основная информация */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Название *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 transition"
                placeholder="Овен"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Slug (URL) *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 transition"
                placeholder="oven"
              />
              <p className="text-white/20 text-xs mt-1">Латиница, строчные буквы</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Стихия *</label>
              <select
                required
                value={formData.element}
                onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 transition"
              >
                {elements.map(el => (
                  <option key={el} value={el}>{el}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Дата начала</label>
              <input
                type="text"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 transition"
                placeholder="21.03"
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-1.5">Дата окончания</label>
              <input
                type="text"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 transition"
                placeholder="19.04"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5">Описание</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 transition resize-none"
              placeholder="Краткое описание знака..."
            />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-1.5">Описание стиля</label>
            <textarea
              rows={3}
              value={formData.style_desc}
              onChange={(e) => setFormData({ ...formData, style_desc: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 transition resize-none"
              placeholder="Описание фирменного стиля..."
            />
          </div>

          {/* Цвета */}
          <div>
            <label className="block text-white/60 text-sm mb-1.5">Цветовая палитра</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color || '#ffffff'}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border border-white/10"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500/50 transition"
                    placeholder="#000000"
                  />
                </div>
              ))}
            </div>
            <p className="text-white/20 text-xs mt-1">HEX коды цветов</p>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-white/60 text-sm mb-1.5">URL изображения</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500/50 transition"
              placeholder="/uploads/zodiac/oven.jpg"
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Link
              href="/admin/zodiac"
              className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition"
            >
              Отмена
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:opacity-90 transition shadow-lg shadow-pink-500/25 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}