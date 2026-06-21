'use client'

import { useState, useEffect } from 'react'
import { Upload, X, Loader2, Copy, Trash2, Plus, Image as ImageIcon, Sparkles } from 'lucide-react'

interface BulkImageUploadProps {
  folder: 'clothing' | 'designers' | 'works'
  onUploadComplete?: (data: any[]) => void
  maxItems?: number
  accept?: string
}

interface Template {
  id: string
  // Для одежды
  name: string
  description: string
  gender: string
  zodiac_sign_id: number
  season: string
  styleTemplate: string
  // Для дизайнеров
  designer_name: string
  bio: string
  // Для работ
  designer_id: number
  work_title: string
}

const STYLE_TEMPLATES = [
  { id: 'casual', label: '👕 Повседневная' },
  { id: 'home', label: '🏠 Домашняя' },
  { id: 'street', label: '🏙️ Уличная' },
  { id: 'date', label: '💑 Свидание' },
  { id: 'evening', label: '🌙 Вечерняя' },
  { id: 'sport', label: '⚡ Спортивная' },
  { id: 'office', label: '💼 Офисная' },
  { id: 'party', label: '🎉 Вечеринка' },
]

export function BulkImageUpload({ 
  folder, 
  onUploadComplete, 
  maxItems = 10,
  accept = 'image/*'
}: BulkImageUploadProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedData, setUploadedData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [zodiacSigns, setZodiacSigns] = useState<{id: number, name: string}[]>([])
  const [designers, setDesigners] = useState<{id: number, designer_name: string}[]>([])
  
  // Массовые настройки
  const [bulkSettings, setBulkSettings] = useState({
    gender: 'unisex',
    zodiac_sign_id: 0,
    season: 'summer',
    styleTemplate: '',
    designer_id: 0,
  })

  useEffect(() => {
    if (folder === 'clothing') {
      fetch('/api/admin/zodiac')
        .then(res => res.json())
        .then(data => {
          setZodiacSigns(data)
          if (data.length > 0) {
            setBulkSettings(prev => ({ ...prev, zodiac_sign_id: data[0].id }))
          }
        })
        .catch(console.error)
    }
  }, [folder])

  useEffect(() => {
    if (folder === 'works') {
      fetch('/api/admin/designers')
        .then(res => res.json())
        .then(data => {
          setDesigners(data)
          if (data.length > 0) {
            setBulkSettings(prev => ({ ...prev, designer_id: data[0].id }))
          }
        })
        .catch(console.error)
    }
  }, [folder])

  // Создать шаблон
  const createTemplate = (): Template => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4)
    
    if (folder === 'clothing') {
      return {
        id,
        name: bulkSettings.styleTemplate || '',
        description: '',
        gender: bulkSettings.gender,
        zodiac_sign_id: bulkSettings.zodiac_sign_id,
        season: bulkSettings.season,
        styleTemplate: bulkSettings.styleTemplate,
        designer_name: '',
        bio: '',
        designer_id: 0,
        work_title: '',
      }
    } else if (folder === 'designers') {
      return {
        id,
        name: '',
        description: '',
        gender: 'unisex',
        zodiac_sign_id: 0,
        season: 'summer',
        styleTemplate: '',
        designer_name: '',
        bio: '',
        designer_id: 0,
        work_title: '',
      }
    } else {
      return {
        id,
        name: '',
        description: '',
        gender: 'unisex',
        zodiac_sign_id: 0,
        season: 'summer',
        styleTemplate: '',
        designer_name: '',
        bio: '',
        designer_id: bulkSettings.designer_id,
        work_title: '',
      }
    }
  }

  const addTemplate = () => {
    if (templates.length >= maxItems) {
      setError(`Максимум ${maxItems} шаблонов`)
      return
    }
    setTemplates([...templates, createTemplate()])
    setError(null)
  }

  const removeTemplate = (index: number) => {
    const newTemplates = [...templates]
    newTemplates.splice(index, 1)
    setTemplates(newTemplates)
    
    // Удаляем соответствующее фото
    if (images[index]) {
      const newImages = [...images]
      const newPreviews = [...imagePreviews]
      URL.revokeObjectURL(newPreviews[index])
      newImages.splice(index, 1)
      newPreviews.splice(index, 1)
      setImages(newImages)
      setImagePreviews(newPreviews)
    }
  }

  const updateTemplate = (index: number, field: string, value: any) => {
    const newTemplates = [...templates]
    newTemplates[index] = { ...newTemplates[index], [field]: value }
    setTemplates(newTemplates)
  }

  // Применить настройки ко всем шаблонам
  const applyBulkSettings = () => {
    const newTemplates = templates.map(t => ({
      ...t,
      gender: bulkSettings.gender || t.gender,
      zodiac_sign_id: bulkSettings.zodiac_sign_id || t.zodiac_sign_id,
      season: bulkSettings.season || t.season,
      styleTemplate: bulkSettings.styleTemplate || t.styleTemplate,
      designer_id: bulkSettings.designer_id || t.designer_id,
    }))
    setTemplates(newTemplates)
    setSuccess('✅ Настройки применены ко всем шаблонам')
    setTimeout(() => setSuccess(null), 3000)
  }

  // Загрузить фото для всех шаблонов
  const handleImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setError(null)

    // Проверяем количество
    if (selectedFiles.length + images.length > maxItems) {
      setError(`Максимум ${maxItems} фото`)
      return
    }

    // Проверяем каждый файл
    for (const file of selectedFiles) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`Файл ${file.name} слишком большой (макс. 5MB)`)
        return
      }
      if (!file.type.startsWith('image/')) {
        setError(`Файл ${file.name} не является изображением`)
        return
      }
    }

    // Создаем превью
    const newPreviews = selectedFiles.map(f => URL.createObjectURL(f))
    
    setImages([...images, ...selectedFiles])
    setImagePreviews([...imagePreviews, ...newPreviews])
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    const newPreviews = [...imagePreviews]
    URL.revokeObjectURL(newPreviews[index])
    newImages.splice(index, 1)
    newPreviews.splice(index, 1)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const clearAll = () => {
    imagePreviews.forEach(p => URL.revokeObjectURL(p))
    setTemplates([])
    setImages([])
    setImagePreviews([])
    setUploadedData([])
    setUploadProgress(0)
    setError(null)
    setSuccess(null)
  }

  // Загрузить все
  const uploadAll = async () => {
    // Проверка: количество шаблонов и фото должно совпадать
    if (templates.length === 0) {
      setError('Сначала создайте шаблоны')
      return
    }

    if (images.length === 0) {
      setError('Загрузите фото для шаблонов')
      return
    }

    if (templates.length !== images.length) {
      setError(`Количество шаблонов (${templates.length}) и фото (${images.length}) не совпадает!`)
      return
    }

    // Проверка заполнения обязательных полей
    for (let i = 0; i < templates.length; i++) {
      const t = templates[i]
      
      if (folder === 'clothing' && !t.name) {
        setError(`Шаблон ${i+1}: не указано название одежды`)
        return
      }
      if (folder === 'designers' && !t.designer_name) {
        setError(`Шаблон ${i+1}: не указано имя дизайнера`)
        return
      }
      if (folder === 'works' && !t.work_title) {
        setError(`Шаблон ${i+1}: не указано название работы`)
        return
      }
    }
    
    setUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)
    
    const uploadedImages: string[] = []

    // Шаг 1: Загружаем все фото
    for (let i = 0; i < images.length; i++) {
      const formData = new FormData()
      formData.append('image', images[i])
      formData.append('folder', folder)

      try {
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()
        
        if (data.success) {
          uploadedImages.push(data.url)
        } else {
          setError(`Ошибка загрузки фото ${i+1}: ${data.error || 'неизвестная ошибка'}`)
        }
        
        setUploadProgress(((i + 1) / images.length) * 100)
      } catch (error) {
        setError(`Ошибка загрузки фото ${i + 1}`)
        console.error('Upload failed:', error)
      }
    }

    // Шаг 2: Сохраняем в БД с привязкой фото к шаблонам
    if (uploadedImages.length > 0) {
      try {
        let endpoint = ''
        let payload: any = {}

        if (folder === 'clothing') {
          endpoint = '/api/admin/bulk-clothing'
          payload = {
            templates: templates,
            images: uploadedImages
          }
        } else if (folder === 'designers') {
          endpoint = '/api/admin/bulk-designers'
          payload = {
            templates: templates,
            images: uploadedImages
          }
        } else if (folder === 'works') {
          endpoint = '/api/admin/bulk-works'
          payload = {
            templates: templates,
            images: uploadedImages
          }
        }

        const saveResponse = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const saveData = await saveResponse.json()

        if (saveResponse.ok) {
          setSuccess(`✅ Успешно загружено и сохранено ${saveData.saved} записей!`)
          setUploadedData(saveData.items || [])
          
          if (onUploadComplete) {
            onUploadComplete(saveData.items || [])
          }
        } else {
          setError(`Ошибка сохранения: ${saveData.error || 'неизвестная ошибка'}`)
        }

      } catch (error) {
        setError('Ошибка сохранения в базу данных')
        console.error('Save error:', error)
      }
    }

    setUploading(false)
  }

  // Рендер шаблона
  const renderTemplate = (template: Template, index: number) => {
    if (folder === 'clothing') {
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={template.name}
              onChange={(e) => updateTemplate(index, 'name', e.target.value)}
              placeholder="Название одежды *"
              className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            />
            <select
              value={template.styleTemplate || ''}
              onChange={(e) => {
                const value = e.target.value
                updateTemplate(index, 'styleTemplate', value)
                updateTemplate(index, 'name', value)
              }}
              className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 w-32"
            >
              <option value="">Шаблон</option>
              {STYLE_TEMPLATES.map(t => (
                <option key={t.id} value={t.label}>{t.icon}</option>
              ))}
            </select>
          </div>
          <textarea
            value={template.description}
            onChange={(e) => updateTemplate(index, 'description', e.target.value)}
            placeholder="Описание"
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 resize-none h-10"
          />
          <div className="flex gap-2">
            <select
              value={template.gender}
              onChange={(e) => updateTemplate(index, 'gender', e.target.value)}
              className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            >
              <option value="unisex">👥 Унисекс</option>
              <option value="female">👩 Женский</option>
              <option value="male">👨 Мужской</option>
            </select>
            <select
              value={template.season}
              onChange={(e) => updateTemplate(index, 'season', e.target.value)}
              className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            >
              <option value="summer">☀️ Лето</option>
              <option value="winter">❄️ Зима</option>
              <option value="spring">🌸 Весна</option>
              <option value="autumn">🍂 Осень</option>
            </select>
            <select
              value={template.zodiac_sign_id}
              onChange={(e) => updateTemplate(index, 'zodiac_sign_id', Number(e.target.value))}
              className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            >
              {zodiacSigns.map((sign) => (
                <option key={sign.id} value={sign.id}>{sign.name}</option>
              ))}
            </select>
          </div>
        </div>
      )
    }

    if (folder === 'designers') {
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={template.designer_name}
            onChange={(e) => updateTemplate(index, 'designer_name', e.target.value)}
            placeholder="Имя дизайнера *"
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
          />
          <textarea
            value={template.bio}
            onChange={(e) => updateTemplate(index, 'bio', e.target.value)}
            placeholder="Биография дизайнера"
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 resize-none h-10"
          />
        </div>
      )
    }

    if (folder === 'works') {
      return (
        <div className="space-y-2">
          <select
            value={template.designer_id}
            onChange={(e) => updateTemplate(index, 'designer_id', Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
          >
            {designers.map((d) => (
              <option key={d.id} value={d.id}>{d.designer_name}</option>
            ))}
          </select>
          <input
            type="text"
            value={template.work_title}
            onChange={(e) => updateTemplate(index, 'work_title', e.target.value)}
            placeholder="Название работы *"
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
          />
          <textarea
            value={template.description}
            onChange={(e) => updateTemplate(index, 'description', e.target.value)}
            placeholder="Описание работы"
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 resize-none h-10"
          />
        </div>
      )
    }

    return null
  }

  // Рендер фото с привязкой к шаблону
  const renderImageWithIndex = (preview: string, index: number) => {
    return (
      <div className="relative group">
        <img
          src={preview}
          alt={`Фото ${index + 1}`}
          className="w-full aspect-square object-cover rounded-lg border border-white/10 group-hover:border-pink-500/50 transition"
        />
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white/60">
          #{index + 1}
        </div>
        <button
          onClick={() => removeImage(index)}
          className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full hover:scale-110 transition opacity-0 group-hover:opacity-100"
          disabled={uploading}
        >
          <X size={12} className="text-white" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white font-medium text-lg">
          {folder === 'clothing' && '👕 Массовая загрузка одежды'}
          {folder === 'designers' && '🎨 Массовая загрузка дизайнеров'}
          {folder === 'works' && '🖼️ Массовая загрузка работ'}
        </h3>
        <p className="text-white/40 text-sm">
          1. Создайте шаблоны с данными • 2. Загрузите фото • 3. Сохраните
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Массовые настройки */}
      {(folder === 'clothing' || folder === 'works') && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/70 text-sm font-medium">⚡ Массовые настройки</h4>
            <button
              onClick={applyBulkSettings}
              disabled={templates.length === 0}
              className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-lg text-xs hover:bg-pink-500/30 transition disabled:opacity-50"
            >
              Применить ко всем ({templates.length})
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {folder === 'clothing' && (
              <>
                <select
                  value={bulkSettings.styleTemplate}
                  onChange={(e) => setBulkSettings(prev => ({ ...prev, styleTemplate: e.target.value }))}
                  className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
                >
                  <option value="">📝 Шаблон названия</option>
                  {STYLE_TEMPLATES.map(t => (
                    <option key={t.id} value={t.label}>{t.icon} {t.label}</option>
                  ))}
                </select>
                <select
                  value={bulkSettings.gender}
                  onChange={(e) => setBulkSettings(prev => ({ ...prev, gender: e.target.value }))}
                  className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
                >
                  <option value="unisex">👥 Унисекс</option>
                  <option value="female">👩 Женский</option>
                  <option value="male">👨 Мужской</option>
                </select>
                <select
                  value={bulkSettings.season}
                  onChange={(e) => setBulkSettings(prev => ({ ...prev, season: e.target.value }))}
                  className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
                >
                  <option value="summer">☀️ Лето</option>
                  <option value="winter">❄️ Зима</option>
                  <option value="spring">🌸 Весна</option>
                  <option value="autumn">🍂 Осень</option>
                </select>
                <select
                  value={bulkSettings.zodiac_sign_id}
                  onChange={(e) => setBulkSettings(prev => ({ ...prev, zodiac_sign_id: Number(e.target.value) }))}
                  className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
                >
                  {zodiacSigns.map((sign) => (
                    <option key={sign.id} value={sign.id}>{sign.name}</option>
                  ))}
                </select>
              </>
            )}
            {folder === 'works' && (
              <select
                value={bulkSettings.designer_id}
                onChange={(e) => setBulkSettings(prev => ({ ...prev, designer_id: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
              >
                {designers.map((d) => (
                  <option key={d.id} value={d.id}>{d.designer_name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {/* Шаблоны */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {templates.map((template, index) => (
          <div key={template.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/30 text-xs">Шаблон #{index + 1}</span>
              <button
                onClick={() => removeTemplate(index)}
                className="ml-auto text-white/30 hover:text-red-400 transition"
                disabled={uploading}
              >
                <X size={14} />
              </button>
            </div>
            {renderTemplate(template, index)}
          </div>
        ))}
      </div>

      {/* Кнопка добавить шаблон */}
      {templates.length < maxItems && !uploading && (
        <button
          onClick={addTemplate}
          className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/40 hover:border-pink-500 hover:text-pink-400 hover:bg-white/5 transition flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Добавить шаблон ({templates.length}/{maxItems})
        </button>
      )}

      {/* Загрузка фото */}
      {templates.length > 0 && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/70 text-sm font-medium">📸 Загрузите фото для шаблонов</h4>
            <span className="text-white/30 text-xs">
              {images.length} / {templates.length} фото
            </span>
          </div>
          
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-3">
              {imagePreviews.map((preview, index) => (
                <div key={index}>
                  {renderImageWithIndex(preview, index)}
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-pink-500 hover:bg-white/5 transition">
            <input
              type="file"
              multiple
              accept={accept}
              onChange={handleImagesSelect}
              className="hidden"
              disabled={uploading || images.length >= templates.length}
            />
            <Upload size={18} className="text-white/40" />
            <span className="text-white/40 text-sm">
              {images.length >= templates.length 
                ? '✅ Все фото загружены' 
                : `Выбрать фото (${images.length}/${templates.length})`}
            </span>
          </label>
        </div>
      )}

      {/* Прогресс */}
      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-white/40 text-sm text-center">
            Загрузка... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      {/* Кнопки действий */}
      {templates.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={uploadAll}
            disabled={uploading || templates.length === 0 || images.length !== templates.length}
            className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Upload size={18} />
                Загрузить и сохранить ({templates.length} записей)
              </>
            )}
          </button>
          
          <button
            onClick={clearAll}
            disabled={uploading}
            className="px-4 py-3 bg-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/20 transition"
          >
            Очистить всё
          </button>
        </div>
      )}

      {/* Результат */}
      {uploadedData.length > 0 && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 max-h-40 overflow-y-auto">
          <p className="text-green-400 text-sm mb-2">✅ Сохранено: {uploadedData.length}</p>
          {uploadedData.map((item, i) => (
            <div key={i} className="text-white/60 text-xs py-1 border-b border-white/5 last:border-0 flex items-center gap-2">
              <span className="text-white/30">{i+1}.</span>
              <span className="truncate">
                {folder === 'clothing' && item.template?.name}
                {folder === 'designers' && item.template?.designer_name}
                {folder === 'works' && item.template?.work_title}
              </span>
              <span className="text-white/30 text-[10px]">{item.image_url}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}