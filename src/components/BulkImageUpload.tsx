'use client'

import { useState, useEffect } from 'react'
import { Upload, X, Loader2, Copy, Trash2, Plus, Image as ImageIcon, Sparkles, Zap, Home, Shirt, Heart, Moon, Sun } from 'lucide-react'

interface BulkImageUploadProps {
  folder: 'clothing' | 'designers' | 'works'
  onUploadComplete?: (data: any[]) => void
  maxItems?: number
  accept?: string
}

interface DataItem {
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
  // Фото
  imageFile: File | null
  imagePreview: string | null
  isUploaded: boolean
  imageUrl: string | null
}

// Шаблоны названий для одежды
const STYLE_TEMPLATES = [
  { id: 'casual', label: '👕 Повседневная', icon: '👕' },
  { id: 'home', label: '🏠 Домашняя', icon: '🏠' },
  { id: 'street', label: '🏙️ Уличная', icon: '🏙️' },
  { id: 'date', label: '💑 Свидание', icon: '💑' },
  { id: 'evening', label: '🌙 Вечерняя', icon: '🌙' },
  { id: 'sport', label: '⚡ Спортивная', icon: '⚡' },
  { id: 'office', label: '💼 Офисная', icon: '💼' },
  { id: 'party', label: '🎉 Вечеринка', icon: '🎉' },
]

export function BulkImageUpload({ 
  folder, 
  onUploadComplete, 
  maxItems = 10,
  accept = 'image/*'
}: BulkImageUploadProps) {
  const [items, setItems] = useState<DataItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedData, setUploadedData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [zodiacSigns, setZodiacSigns] = useState<{id: number, name: string}[]>([])
  const [designers, setDesigners] = useState<{id: number, designer_name: string}[]>([])
  
  // Массовые настройки
  const [bulkSettings, setBulkSettings] = useState({
    // Для одежды
    gender: 'unisex',
    zodiac_sign_id: 0,
    season: 'summer',
    styleTemplate: '',
    // Для дизайнеров
    designerTemplate: '',
    // Для работ
    designer_id: 0,
  })

  const [applyToAll, setApplyToAll] = useState(false)

  // Загружаем знаки зодиака
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

  // Загружаем дизайнеров
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

  // Создать новый пустой элемент
  const createEmptyItem = (): DataItem => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4)
    
    if (folder === 'clothing') {
      return {
        id,
        name: '',
        description: '',
        gender: bulkSettings.gender,
        zodiac_sign_id: bulkSettings.zodiac_sign_id,
        season: bulkSettings.season,
        styleTemplate: bulkSettings.styleTemplate,
        designer_name: '',
        bio: '',
        designer_id: 0,
        work_title: '',
        imageFile: null,
        imagePreview: null,
        isUploaded: false,
        imageUrl: null,
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
        imageFile: null,
        imagePreview: null,
        isUploaded: false,
        imageUrl: null,
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
        imageFile: null,
        imagePreview: null,
        isUploaded: false,
        imageUrl: null,
      }
    }
  }

  // Добавить новый элемент
  const addItem = () => {
    if (items.length >= maxItems) {
      setError(`Максимум ${maxItems} записей`)
      return
    }
    setItems([...items, createEmptyItem()])
    setError(null)
  }

  // Удалить элемент
  const removeItem = (index: number) => {
    const newItems = [...items]
    if (newItems[index].imagePreview) {
      URL.revokeObjectURL(newItems[index].imagePreview!)
    }
    newItems.splice(index, 1)
    setItems(newItems)
  }

  // Применить настройки ко всем элементам
  const applyBulkSettingsToAll = () => {
    const newItems = items.map(item => ({
      ...item,
      gender: bulkSettings.gender || item.gender,
      zodiac_sign_id: bulkSettings.zodiac_sign_id || item.zodiac_sign_id,
      season: bulkSettings.season || item.season,
      styleTemplate: bulkSettings.styleTemplate || item.styleTemplate,
      designer_id: bulkSettings.designer_id || item.designer_id,
    }))
    setItems(newItems)
    setSuccess(`✅ Настройки применены ко всем ${items.length} записям`)
    setTimeout(() => setSuccess(null), 3000)
  }

  // Обновить элемент
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  // Загрузить фото для элемента
  const handleImageSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError(`Файл ${file.name} слишком большой (макс. 5MB)`)
      return
    }

    if (!file.type.startsWith('image/')) {
      setError(`Файл ${file.name} не является изображением`)
      return
    }

    const preview = URL.createObjectURL(file)
    const newItems = [...items]
    newItems[index] = { 
      ...newItems[index], 
      imageFile: file, 
      imagePreview: preview,
      isUploaded: false,
      imageUrl: null
    }
    setItems(newItems)
    setError(null)
  }

  // Загрузить все
  const uploadAll = async () => {
    // Проверка заполнения
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      if (!item.imageFile) {
        setError(`Для записи ${i+1} не выбрано фото`)
        return
      }
      
      if (folder === 'clothing' && !item.name) {
        setError(`Для записи ${i+1} не указано название одежды`)
        return
      }
      if (folder === 'designers' && !item.designer_name) {
        setError(`Для записи ${i+1} не указано имя дизайнера`)
        return
      }
      if (folder === 'works' && !item.work_title) {
        setError(`Для записи ${i+1} не указано название работы`)
        return
      }
    }
    
    setUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)
    
    const results: any[] = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const formData = new FormData()
      formData.append('image', item.imageFile!)
      formData.append('folder', folder)

      try {
        // Шаг 1: Загружаем фото
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()
        
        if (data.success) {
          const result = {
            url: data.url,
            ...item
          }
          results.push(result)
          
          // Обновляем статус элемента
          const newItems = [...items]
          newItems[i] = { 
            ...newItems[i], 
            isUploaded: true, 
            imageUrl: data.url 
          }
          setItems(newItems)
        } else {
          setError(`Ошибка загрузки: ${data.error || 'неизвестная ошибка'}`)
        }
        
        setUploadProgress(((i + 1) / items.length) * 100)
      } catch (error) {
        setError(`Ошибка загрузки файла ${i + 1}`)
        console.error('Upload failed:', error)
      }
    }

    // Шаг 2: Сохраняем в БД
    if (results.length > 0) {
      try {
        let endpoint = ''
        let payload: any = {}

        if (folder === 'clothing') {
          endpoint = '/api/admin/bulk-clothing'
          payload = {
            items: results.map(r => ({
              title: r.name,
              description: r.description || '',
              image_url: r.url,
              season: r.season || 'summer',
              gender: r.gender || 'unisex',
              zodiac_sign_id: r.zodiac_sign_id,
            }))
          }
        } else if (folder === 'designers') {
          endpoint = '/api/admin/bulk-designers'
          payload = {
            items: results.map(r => ({
              designer_name: r.designer_name,
              bio: r.bio || '',
              designer_image: r.url,
              social_links: {},
            }))
          }
        } else if (folder === 'works') {
          endpoint = '/api/admin/bulk-works'
          payload = {
            items: results.map(r => ({
              designer_id: r.designer_id,
              work_title: r.work_title,
              description: r.description || '',
              work_image: r.url,
            }))
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
        } else {
          setError(`Ошибка сохранения: ${saveData.error || 'неизвестная ошибка'}`)
        }

        setUploadedData(results)
        
        if (onUploadComplete) {
          onUploadComplete(results)
        }

      } catch (error) {
        setError('Ошибка сохранения в базу данных')
        console.error('Save error:', error)
      }
    }

    setUploading(false)
  }

  // Очистить все
  const clearAll = () => {
    items.forEach(item => {
      if (item.imagePreview) URL.revokeObjectURL(item.imagePreview)
    })
    setItems([])
    setUploadedData([])
    setUploadProgress(0)
    setError(null)
    setSuccess(null)
  }

  // Рендер формы элемента
  const renderItemForm = (item: DataItem, index: number) => {
    if (folder === 'clothing') {
      return (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
              placeholder="Название одежды *"
              className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            />
            <select
              value={item.styleTemplate || ''}
              onChange={(e) => {
                const template = e.target.value
                const newName = template ? `${template} ${item.name}`.trim() : item.name
                updateItem(index, 'styleTemplate', template)
                updateItem(index, 'name', newName)
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
            value={item.description}
            onChange={(e) => updateItem(index, 'description', e.target.value)}
            placeholder="Описание"
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 resize-none h-10"
          />
          <div className="flex gap-2">
            <select
              value={item.gender}
              onChange={(e) => updateItem(index, 'gender', e.target.value)}
              className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            >
              <option value="unisex">👥 Унисекс</option>
              <option value="female">👩 Женский</option>
              <option value="male">👨 Мужской</option>
            </select>
            <select
              value={item.season}
              onChange={(e) => updateItem(index, 'season', e.target.value)}
              className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            >
              <option value="summer">☀️ Лето</option>
              <option value="winter">❄️ Зима</option>
              <option value="spring">🌸 Весна</option>
              <option value="autumn">🍂 Осень</option>
            </select>
            <select
              value={item.zodiac_sign_id}
              onChange={(e) => updateItem(index, 'zodiac_sign_id', Number(e.target.value))}
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
        <div className="space-y-3">
          <input
            type="text"
            value={item.designer_name}
            onChange={(e) => updateItem(index, 'designer_name', e.target.value)}
            placeholder="Имя дизайнера *"
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
          />
          <textarea
            value={item.bio}
            onChange={(e) => updateItem(index, 'bio', e.target.value)}
            placeholder="Биография дизайнера"
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 resize-none h-12"
          />
        </div>
      )
    }

    if (folder === 'works') {
      return (
        <div className="space-y-3">
          <select
            value={item.designer_id}
            onChange={(e) => updateItem(index, 'designer_id', Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
          >
            {designers.map((d) => (
              <option key={d.id} value={d.id}>{d.designer_name}</option>
            ))}
          </select>
          <input
            type="text"
            value={item.work_title}
            onChange={(e) => updateItem(index, 'work_title', e.target.value)}
            placeholder="Название работы *"
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
          />
          <textarea
            value={item.description}
            onChange={(e) => updateItem(index, 'description', e.target.value)}
            placeholder="Описание работы"
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 resize-none h-12"
          />
        </div>
      )
    }

    return null
  }

  // Рендер секции загрузки фото для элемента
  const renderImageUpload = (item: DataItem, index: number) => {
    return (
      <div className="flex-shrink-0">
        {item.imagePreview ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10">
            <img
              src={item.imagePreview}
              alt={`Preview ${index}`}
              className="w-full h-full object-cover"
            />
            {item.isUploaded && (
              <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✅</span>
              </div>
            )}
            <button
              onClick={() => {
                const newItems = [...items]
                if (newItems[index].imagePreview) {
                  URL.revokeObjectURL(newItems[index].imagePreview!)
                }
                newItems[index] = { ...newItems[index], imageFile: null, imagePreview: null, isUploaded: false, imageUrl: null }
                setItems(newItems)
              }}
              className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full hover:scale-110 transition"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        ) : (
          <label className="w-24 h-24 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-white/5 transition">
            <input
              type="file"
              accept={accept}
              onChange={(e) => handleImageSelect(index, e)}
              className="hidden"
            />
            <ImageIcon size={20} className="text-white/30" />
            <span className="text-white/20 text-[10px] mt-1">Фото</span>
          </label>
        )}
      </div>
    )
  }

  // Рендер массовых настроек
  const renderBulkSettings = () => {
    if (folder === 'clothing') {
      return (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/70 text-sm font-medium">⚡ Массовые настройки</h4>
            <button
              onClick={applyBulkSettingsToAll}
              disabled={items.length === 0}
              className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-lg text-xs hover:bg-pink-500/30 transition disabled:opacity-50"
            >
              Применить ко всем ({items.length})
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <select
              value={bulkSettings.styleTemplate}
              onChange={(e) => {
                const template = e.target.value
                setBulkSettings(prev => ({ ...prev, styleTemplate: template }))
              }}
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
          </div>
        </div>
      )
    }

    if (folder === 'works') {
      return (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/70 text-sm font-medium">⚡ Массовые настройки</h4>
            <button
              onClick={applyBulkSettingsToAll}
              disabled={items.length === 0}
              className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-lg text-xs hover:bg-pink-500/30 transition disabled:opacity-50"
            >
              Применить ко всем ({items.length})
            </button>
          </div>
          
          <select
            value={bulkSettings.designer_id}
            onChange={(e) => setBulkSettings(prev => ({ ...prev, designer_id: Number(e.target.value) }))}
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
          >
            {designers.map((d) => (
              <option key={d.id} value={d.id}>{d.designer_name}</option>
            ))}
          </select>
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div>
        <h3 className="text-white font-medium text-lg">
          {folder === 'clothing' && '👕 Массовая загрузка одежды'}
          {folder === 'designers' && '🎨 Массовая загрузка дизайнеров'}
          {folder === 'works' && '🖼️ Массовая загрузка работ'}
        </h3>
        <p className="text-white/40 text-sm">
          Сначала заполните данные, затем добавьте фото
        </p>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Успех */}
      {success && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Массовые настройки */}
      {renderBulkSettings()}

      {/* Список записей */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {items.map((item, index) => (
          <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition">
            <div className="flex gap-4">
              {/* Форма с данными */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white/30 text-xs">#{index + 1}</span>
                  {item.isUploaded && (
                    <span className="text-green-400 text-xs flex items-center gap-1">
                      <span>✅</span> Загружено
                    </span>
                  )}
                  <button
                    onClick={() => removeItem(index)}
                    className="ml-auto text-white/30 hover:text-red-400 transition"
                    disabled={uploading}
                  >
                    <X size={14} />
                  </button>
                </div>
                {renderItemForm(item, index)}
              </div>
              
              {/* Загрузка фото */}
              {renderImageUpload(item, index)}
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка добавить запись */}
      {items.length < maxItems && !uploading && (
        <button
          onClick={addItem}
          className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/40 hover:border-pink-500 hover:text-pink-400 hover:bg-white/5 transition flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Добавить запись ({items.length}/{maxItems})
        </button>
      )}

      {/* Прогресс загрузки */}
      {uploading && (
        <div className="space-y-2">
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-white/40 text-sm text-center">
            Загрузка... {Math.round(uploadProgress)}% ({Math.round(uploadProgress / 100 * items.length)} из {items.length})
          </p>
        </div>
      )}

      {/* Кнопки действий */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={uploadAll}
            disabled={uploading}
            className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Upload size={18} />
                Загрузить и сохранить ({items.length})
              </>
            )}
          </button>
          
          <button
            onClick={clearAll}
            disabled={uploading}
            className="px-4 py-3 bg-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/20 transition"
          >
            Очистить все
          </button>
        </div>
      )}

      {/* Результат */}
      {uploadedData.length > 0 && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 max-h-40 overflow-y-auto">
          <p className="text-green-400 text-sm mb-2">✅ Загружено и сохранено: {uploadedData.length}</p>
          {uploadedData.map((item, i) => (
            <div key={i} className="text-white/60 text-xs py-1 border-b border-white/5 last:border-0">
              {i+1}. {item.url}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}