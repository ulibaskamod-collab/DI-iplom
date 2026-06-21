'use client'

import { useState, useEffect } from 'react'
import { Upload, X, Loader2, Copy, Trash2, Plus, Image as ImageIcon, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'

interface BulkImageUploadProps {
  folder: 'clothing' | 'designers' | 'works'
  onUploadComplete?: (data: any[]) => void
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
  images: File[]
  imagePreviews: string[]
  uploadedImages: string[]
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
  accept = 'image/*'
}: BulkImageUploadProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedData, setUploadedData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [zodiacSigns, setZodiacSigns] = useState<{id: number, name: string}[]>([])
  const [designers, setDesigners] = useState<{id: number, designer_name: string}[]>([])
  const [expandedTemplates, setExpandedTemplates] = useState<Set<string>>(new Set())
  
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
        images: [],
        imagePreviews: [],
        uploadedImages: [],
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
        images: [],
        imagePreviews: [],
        uploadedImages: [],
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
        images: [],
        imagePreviews: [],
        uploadedImages: [],
        designer_name: '',
        bio: '',
        designer_id: bulkSettings.designer_id,
        work_title: '',
      }
    }
  }

  const addTemplate = () => {
    setTemplates([...templates, createTemplate()])
    setError(null)
  }

  const removeTemplate = (index: number) => {
    const newTemplates = [...templates]
    // Освобождаем память от превью
    newTemplates[index].imagePreviews.forEach(p => URL.revokeObjectURL(p))
    newTemplates.splice(index, 1)
    setTemplates(newTemplates)
  }

  const toggleTemplate = (id: string) => {
    const newExpanded = new Set(expandedTemplates)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedTemplates(newExpanded)
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

  // Загрузить фото для шаблона
  const handleImagesSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setError(null)

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
    
    const newTemplates = [...templates]
    newTemplates[index] = { 
      ...newTemplates[index], 
      images: [...newTemplates[index].images, ...selectedFiles],
      imagePreviews: [...newTemplates[index].imagePreviews, ...newPreviews]
    }
    setTemplates(newTemplates)
    e.target.value = ''
  }

  const removeImage = (templateIndex: number, imageIndex: number) => {
    const newTemplates = [...templates]
    URL.revokeObjectURL(newTemplates[templateIndex].imagePreviews[imageIndex])
    newTemplates[templateIndex].images.splice(imageIndex, 1)
    newTemplates[templateIndex].imagePreviews.splice(imageIndex, 1)
    setTemplates(newTemplates)
  }

  const clearAll = () => {
    templates.forEach(t => t.imagePreviews.forEach(p => URL.revokeObjectURL(p)))
    setTemplates([])
    setUploadedData([])
    setUploadProgress(0)
    setError(null)
    setSuccess(null)
  }

  // Загрузить все
  const uploadAll = async () => {
    if (templates.length === 0) {
      setError('Сначала создайте шаблоны')
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
      
      // Для одежды и работ проверяем, что есть хотя бы одно фото
      if ((folder === 'clothing' || folder === 'works') && t.images.length === 0) {
        setError(`Шаблон ${i+1}: не загружено ни одного фото`)
        return
      }
      // Для дизайнеров проверяем, что есть фото
      if (folder === 'designers' && t.images.length === 0) {
        setError(`Шаблон ${i+1}: не загружено фото дизайнера`)
        return
      }
    }
    
    setUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)
    
    const allUploadedData: any[] = []
    const totalImages = templates.reduce((acc, t) => acc + t.images.length, 0)
    let uploadedSoFar = 0

    // Проходим по каждому шаблону
    for (let tIndex = 0; tIndex < templates.length; tIndex++) {
      const template = templates[tIndex]
      const uploadedImages: string[] = []

      console.log(`📤 Загрузка шаблона ${tIndex + 1}:`, template)

      // Загружаем все фото для этого шаблона
      for (let i = 0; i < template.images.length; i++) {
        const formData = new FormData()
        formData.append('image', template.images[i])
        formData.append('folder', folder)

        try {
          console.log(`📤 Загрузка фото ${i+1} из ${template.images.length} для шаблона ${tIndex+1}`)
          
          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          })
          const data = await response.json()
          console.log(`📥 Ответ загрузки фото:`, data)
          
          if (data.success) {
            uploadedImages.push(data.url)
          } else {
            setError(`Ошибка загрузки фото ${i+1} в шаблоне ${tIndex+1}: ${data.error || 'неизвестная ошибка'}`)
          }
          
          uploadedSoFar++
          setUploadProgress((uploadedSoFar / totalImages) * 100)
        } catch (error) {
          setError(`Ошибка загрузки фото ${i + 1}`)
          console.error('Upload failed:', error)
        }
      }

      // Сохраняем шаблон с загруженными фото
      if (uploadedImages.length > 0) {
        let endpoint = ''
        let payload: any = {}

        if (folder === 'clothing') {
          endpoint = '/api/admin/bulk-clothing'
          payload = {
            templates: [template],
            images: uploadedImages
          }
        } else if (folder === 'designers') {
          endpoint = '/api/admin/bulk-designers'
          payload = {
            templates: [template],
            images: uploadedImages
          }
        } else if (folder === 'works') {
          endpoint = '/api/admin/bulk-works'
          payload = {
            templates: [template],
            images: uploadedImages
          }
        }

        console.log(`📤 Отправка в API ${endpoint}:`, payload)

        try {
          const saveResponse = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

          const saveData = await saveResponse.json()
          console.log(`📥 Ответ API ${endpoint}:`, saveData)

          if (saveResponse.ok) {
            allUploadedData.push({
              template: template,
              images: uploadedImages,
              saved: saveData.items || []
            })
          } else {
            setError(`Ошибка сохранения шаблона ${tIndex+1}: ${saveData.error || 'неизвестная ошибка'}`)
          }
        } catch (error) {
          setError('Ошибка сохранения в базу данных')
          console.error('Save error:', error)
        }
      }
    }

    setUploadedData(allUploadedData)
    setUploading(false)
    
    if (onUploadComplete) {
      onUploadComplete(allUploadedData)
    }

    const totalSaved = allUploadedData.reduce((acc, d) => acc + (d.saved ? d.saved.length : 0), 0)
    if (totalSaved > 0) {
      setSuccess(`✅ Успешно загружено и сохранено ${totalSaved} записей в ${allUploadedData.length} шаблонах!`)
    } else if (allUploadedData.length > 0) {
      setSuccess(`⚠️ Фото загружены, но не сохранены в БД. Проверьте консоль для ошибок.`)
    }
  }

  // Рендер шаблона
  const renderTemplate = (template: Template, index: number) => {
    const isExpanded = expandedTemplates.has(template.id)
    const hasImages = template.imagePreviews.length > 0
    const isDesignerMode = folder === 'designers'

    return (
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        {/* Заголовок шаблона */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition"
          onClick={() => toggleTemplate(template.id)}
        >
          <div className="flex items-center gap-3">
            <span className="text-white/30 text-sm font-medium">#{index + 1}</span>
            <span className="text-white/70 text-sm">
              {folder === 'clothing' && (template.name || 'Новая одежда')}
              {folder === 'designers' && (template.designer_name || 'Новый дизайнер')}
              {folder === 'works' && (template.work_title || 'Новая работа')}
            </span>
            {hasImages && (
              <span className="text-white/30 text-xs bg-white/5 px-2 py-0.5 rounded-full">
                {template.imagePreviews.length} фото
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeTemplate(index)
              }}
              className="text-white/30 hover:text-red-400 transition p-1"
              disabled={uploading}
            >
              <Trash2 size={16} />
            </button>
            {isExpanded ? <ChevronUp size={18} className="text-white/30" /> : <ChevronDown size={18} className="text-white/30" />}
          </div>
        </div>

        {/* Содержимое шаблона (развернуто) */}
        {isExpanded && (
          <div className="p-4 pt-0 border-t border-white/5">
            <div className="space-y-3 mt-3">
              {/* Поля для одежды */}
              {folder === 'clothing' && (
                <>
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
                        if (value) {
                          updateTemplate(index, 'name', value)
                        }
                      }}
                      className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 w-32"
                    >
                      <option value="">Шаблон</option>
                      {STYLE_TEMPLATES.map(t => (
                        <option key={t.id} value={t.label}>{t.label}</option>
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
                </>
              )}

              {/* Поля для дизайнеров */}
              {folder === 'designers' && (
                <>
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
                </>
              )}

              {/* Поля для работ */}
              {folder === 'works' && (
                <>
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
                </>
              )}

              {/* Загрузка фото (для одежды и работ - много фото, для дизайнеров - одно) */}
              {!isDesignerMode && (
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/40 text-xs">📸 Фото для этой записи</span>
                    <span className="text-white/30 text-xs">{template.imagePreviews.length} фото</span>
                  </div>
                  
                  {template.imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2">
                      {template.imagePreviews.map((preview, imgIndex) => (
                        <div key={imgIndex} className="relative group">
                          <img
                            src={preview}
                            alt={`Фото ${imgIndex + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border border-white/10 group-hover:border-pink-500/50 transition"
                          />
                          <button
                            onClick={() => removeImage(index, imgIndex)}
                            className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full hover:scale-110 transition opacity-0 group-hover:opacity-100"
                            disabled={uploading}
                          >
                            <X size={12} className="text-white" />
                          </button>
                          <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white/60">
                            #{imgIndex + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-pink-500 hover:bg-white/5 transition">
                    <input
                      type="file"
                      multiple
                      accept={accept}
                      onChange={(e) => handleImagesSelect(index, e)}
                      className="hidden"
                      disabled={uploading}
                    />
                    <Upload size={16} className="text-white/40" />
                    <span className="text-white/40 text-sm">
                      {template.imagePreviews.length > 0 ? '➕ Добавить еще фото' : 'Выбрать фото (можно несколько)'}
                    </span>
                  </label>
                </div>
              )}

              {/* Для дизайнеров - одно фото */}
              {isDesignerMode && (
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/40 text-xs">📸 Фото дизайнера</span>
                  </div>
                  
                  {template.imagePreviews.length > 0 ? (
                    <div className="relative w-32 h-32">
                      <img
                        src={template.imagePreviews[0]}
                        alt="Фото дизайнера"
                        className="w-full h-full object-cover rounded-lg border border-white/10"
                      />
                      <button
                        onClick={() => removeImage(index, 0)}
                        className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full hover:scale-110 transition"
                        disabled={uploading}
                      >
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-pink-500 hover:bg-white/5 transition">
                      <input
                        type="file"
                        accept={accept}
                        onChange={(e) => handleImagesSelect(index, e)}
                        className="hidden"
                        disabled={uploading}
                      />
                      <Upload size={24} className="text-white/40" />
                      <span className="text-white/40 text-sm">Выбрать фото</span>
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
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
          {folder === 'designers' 
            ? 'Создайте шаблоны и добавьте по одному фото' 
            : 'Создайте шаблон и добавьте несколько фото к нему'}
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

      {/* Массовые настройки (только для одежды и работ) */}
      {(folder === 'clothing' || folder === 'works') && templates.length > 0 && (
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
                    <option key={t.id} value={t.label}>{t.label}</option>
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
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {templates.map((template, index) => (
          <div key={template.id}>
            {renderTemplate(template, index)}
          </div>
        ))}
      </div>

      {/* Кнопка добавить шаблон */}
      {!uploading && (
        <button
          onClick={addTemplate}
          className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/40 hover:border-pink-500 hover:text-pink-400 hover:bg-white/5 transition flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Добавить шаблон ({templates.length})
        </button>
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
            disabled={uploading}
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
                Загрузить и сохранить ({templates.length} шаблонов)
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
          <p className="text-green-400 text-sm mb-2">✅ Сохранено: {uploadedData.reduce((acc, d) => acc + (d.saved ? d.saved.length : 0), 0)} записей</p>
          {uploadedData.map((group, gIndex) => (
            <div key={gIndex} className="mb-2">
              <div className="text-white/50 text-xs font-medium">
                {folder === 'clothing' && group.template?.name}
                {folder === 'designers' && group.template?.designer_name}
                {folder === 'works' && group.template?.work_title}
                {' '}({group.images?.length || 0} фото)
              </div>
              {group.images?.map((url: string, i: number) => (
                <div key={i} className="text-white/40 text-[10px] pl-4 border-l border-white/10 ml-2 py-0.5">
                  {i+1}. {url}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}