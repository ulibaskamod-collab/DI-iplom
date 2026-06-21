'use client'

import { useState, useEffect } from 'react'
import { Upload, X, Loader2, Copy, Trash2, Sparkles, Zap, Home, Shirt, Heart, Moon, Sun } from 'lucide-react'

interface BulkImageUploadProps {
  folder: 'clothing' | 'designers' | 'works'
  onUploadComplete?: (data: any[]) => void
  maxFiles?: number
  accept?: string
}

interface FileWithData {
  file: File
  preview: string
  // Общие
  name: string
  description: string
  // Для одежды
  gender?: string
  zodiac_sign_id?: number
  season?: string
  styleTemplate?: string
  // Для дизайнеров
  designer_name?: string
  bio?: string
  // Для работ
  designer_id?: number
  work_title?: string
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

// Шаблоны названий для дизайнеров
const DESIGNER_TEMPLATES = [
  { id: 'classic', label: 'Классический' },
  { id: 'modern', label: 'Современный' },
  { id: 'streetwear', label: 'Уличный' },
  { id: 'luxury', label: 'Люксовый' },
  { id: 'minimal', label: 'Минималистичный' },
  { id: 'avant-garde', label: 'Авангардный' },
]

export function BulkImageUpload({ 
  folder, 
  onUploadComplete, 
  maxFiles = 10,
  accept = 'image/*'
}: BulkImageUploadProps) {
  const [files, setFiles] = useState<FileWithData[]>([])
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setError(null)
    setSuccess(null)
    
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`Можно загрузить максимум ${maxFiles} файлов`)
      return
    }

    const oversized = selectedFiles.find(f => f.size > 5 * 1024 * 1024)
    if (oversized) {
      setError(`Файл ${oversized.name} слишком большой (макс. 5MB)`)
      return
    }

    const invalidType = selectedFiles.find(f => !f.type.startsWith('image/'))
    if (invalidType) {
      setError(`Файл ${invalidType.name} не является изображением`)
      return
    }

    const newFiles: FileWithData[] = selectedFiles.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      name: '',
      description: '',
      // Для одежды
      gender: bulkSettings.gender,
      zodiac_sign_id: bulkSettings.zodiac_sign_id,
      season: bulkSettings.season,
      styleTemplate: bulkSettings.styleTemplate,
      // Для дизайнеров
      designer_name: '',
      bio: '',
      // Для работ
      designer_id: bulkSettings.designer_id,
      work_title: '',
    }))

    setFiles([...files, ...newFiles])
    e.target.value = ''
  }

  // Применить настройки ко всем файлам
  const applyBulkSettingsToAll = () => {
    const newFiles = files.map(f => ({
      ...f,
      gender: bulkSettings.gender || f.gender,
      zodiac_sign_id: bulkSettings.zodiac_sign_id || f.zodiac_sign_id,
      season: bulkSettings.season || f.season,
      styleTemplate: bulkSettings.styleTemplate || f.styleTemplate,
      designer_id: bulkSettings.designer_id || f.designer_id,
    }))
    setFiles(newFiles)
    setSuccess(`✅ Настройки применены ко всем ${files.length} файлам`)
    setTimeout(() => setSuccess(null), 3000)
  }

  const updateFileData = (index: number, field: string, value: any) => {
    const newFiles = [...files]
    newFiles[index] = { ...newFiles[index], [field]: value }
    setFiles(newFiles)
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    URL.revokeObjectURL(newFiles[index].preview)
    newFiles.splice(index, 1)
    setFiles(newFiles)
    setError(null)
  }

  const clearAll = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview))
    setFiles([])
    setUploadedData([])
    setUploadProgress(0)
    setError(null)
    setSuccess(null)
  }

  const uploadAll = async () => {
    if (files.length === 0) {
      setError('Нет файлов для загрузки')
      return
    }

    // Проверка заполнения
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      
      if (folder === 'clothing' && !f.name) {
        setError(`Для файла ${i+1} не указано название одежды`)
        return
      }
      if (folder === 'designers' && !f.designer_name) {
        setError(`Для файла ${i+1} не указано имя дизайнера`)
        return
      }
      if (folder === 'works' && !f.work_title) {
        setError(`Для файла ${i+1} не указано название работы`)
        return
      }
    }
    
    setUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)
    
    const results: any[] = []
    const uploadedItems: any[] = []

    // Шаг 1: Загружаем фото
    for (let i = 0; i < files.length; i++) {
      const fileData = files[i]
      const formData = new FormData()
      formData.append('image', fileData.file)
      formData.append('folder', folder)

      try {
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()
        
        if (data.success) {
          results.push({
            url: data.url,
            ...fileData
          })
        } else {
          setError(`Ошибка загрузки: ${data.error || 'неизвестная ошибка'}`)
        }
        
        setUploadProgress(((i + 1) / files.length) * 100)
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

  const renderBulkSettings = () => {
    if (folder === 'clothing') {
      return (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/70 text-sm font-medium">⚡ Массовые настройки</h4>
            <button
              onClick={applyBulkSettingsToAll}
              disabled={files.length === 0}
              className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-lg text-xs hover:bg-pink-500/30 transition disabled:opacity-50"
            >
              Применить ко всем ({files.length})
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {/* Шаблон названия */}
            <select
              value={bulkSettings.styleTemplate}
              onChange={(e) => {
                const template = e.target.value
                setBulkSettings(prev => ({ ...prev, styleTemplate: template }))
                if (applyToAll) {
                  const newFiles = files.map(f => ({
                    ...f,
                    name: template ? `${template} ${f.name || ''}`.trim() : f.name
                  }))
                  setFiles(newFiles)
                }
              }}
              className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            >
              <option value="">📝 Шаблон названия</option>
              {STYLE_TEMPLATES.map(t => (
                <option key={t.id} value={t.label}>{t.icon} {t.label}</option>
              ))}
            </select>

            {/* Пол */}
            <select
              value={bulkSettings.gender}
              onChange={(e) => {
                const value = e.target.value
                setBulkSettings(prev => ({ ...prev, gender: value }))
                if (applyToAll) {
                  const newFiles = files.map(f => ({ ...f, gender: value }))
                  setFiles(newFiles)
                }
              }}
              className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            >
              <option value="unisex">👥 Унисекс</option>
              <option value="female">👩 Женский</option>
              <option value="male">👨 Мужской</option>
            </select>

            {/* Сезон */}
            <select
              value={bulkSettings.season}
              onChange={(e) => {
                const value = e.target.value
                setBulkSettings(prev => ({ ...prev, season: value }))
                if (applyToAll) {
                  const newFiles = files.map(f => ({ ...f, season: value }))
                  setFiles(newFiles)
                }
              }}
              className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            >
              <option value="summer">☀️ Лето</option>
              <option value="winter">❄️ Зима</option>
              <option value="spring">🌸 Весна</option>
              <option value="autumn">🍂 Осень</option>
            </select>

            {/* Знак зодиака */}
            <select
              value={bulkSettings.zodiac_sign_id}
              onChange={(e) => {
                const value = Number(e.target.value)
                setBulkSettings(prev => ({ ...prev, zodiac_sign_id: value }))
                if (applyToAll) {
                  const newFiles = files.map(f => ({ ...f, zodiac_sign_id: value }))
                  setFiles(newFiles)
                }
              }}
              className="px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            >
              {zodiacSigns.map((sign) => (
                <option key={sign.id} value={sign.id}>{sign.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              id="applyToAll"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              className="accent-pink-500 w-4 h-4"
            />
            <label htmlFor="applyToAll" className="text-white/50 text-sm">
              Автоматически применять настройки ко всем новым файлам
            </label>
          </div>
        </div>
      )
    }

    if (folder === 'works') {
      return (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white/70 text-sm font-medium">⚡ Массовые настройки</h4>
            <button
              onClick={applyBulkSettingsToAll}
              disabled={files.length === 0}
              className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-lg text-xs hover:bg-pink-500/30 transition disabled:opacity-50"
            >
              Применить ко всем ({files.length})
            </button>
          </div>
          
          <select
            value={bulkSettings.designer_id}
            onChange={(e) => {
              const value = Number(e.target.value)
              setBulkSettings(prev => ({ ...prev, designer_id: value }))
              if (applyToAll) {
                const newFiles = files.map(f => ({ ...f, designer_id: value }))
                setFiles(newFiles)
              }
            }}
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
          >
            {designers.map((d) => (
              <option key={d.id} value={d.id}>{d.designer_name}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              id="applyToAllWorks"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              className="accent-pink-500 w-4 h-4"
            />
            <label htmlFor="applyToAllWorks" className="text-white/50 text-sm">
              Автоматически применять дизайнера ко всем новым файлам
            </label>
          </div>
        </div>
      )
    }

    return null
  }

  const renderFileFields = (file: FileWithData, index: number) => {
    if (folder === 'clothing') {
      return (
        <div className="space-y-2 mt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={file.name}
              onChange={(e) => updateFileData(index, 'name', e.target.value)}
              placeholder="Название одежды *"
              className="flex-1 px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            />
            <select
              value={file.styleTemplate || ''}
              onChange={(e) => {
                const template = e.target.value
                const newName = template ? `${template} ${file.name}`.trim() : file.name
                updateFileData(index, 'styleTemplate', template)
                updateFileData(index, 'name', newName)
              }}
              className="px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 w-32"
            >
              <option value="">Шаблон</option>
              {STYLE_TEMPLATES.map(t => (
                <option key={t.id} value={t.label}>{t.icon}</option>
              ))}
            </select>
          </div>
          <textarea
            value={file.description}
            onChange={(e) => updateFileData(index, 'description', e.target.value)}
            placeholder="Описание"
            className="w-full px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 resize-none h-10"
          />
          <div className="flex gap-2">
            <select
              value={file.gender}
              onChange={(e) => updateFileData(index, 'gender', e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            >
              <option value="unisex">👥 Унисекс</option>
              <option value="female">👩 Женский</option>
              <option value="male">👨 Мужской</option>
            </select>
            <select
              value={file.season}
              onChange={(e) => updateFileData(index, 'season', e.target.value)}
              className="flex-1 px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
            >
              <option value="summer">☀️ Лето</option>
              <option value="winter">❄️ Зима</option>
              <option value="spring">🌸 Весна</option>
              <option value="autumn">🍂 Осень</option>
            </select>
            <select
              value={file.zodiac_sign_id}
              onChange={(e) => updateFileData(index, 'zodiac_sign_id', Number(e.target.value))}
              className="flex-1 px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
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
        <div className="space-y-2 mt-2">
          <input
            type="text"
            value={file.designer_name}
            onChange={(e) => updateFileData(index, 'designer_name', e.target.value)}
            placeholder="Имя дизайнера *"
            className="w-full px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
          />
          <textarea
            value={file.bio}
            onChange={(e) => updateFileData(index, 'bio', e.target.value)}
            placeholder="Биография дизайнера"
            className="w-full px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 resize-none h-10"
          />
        </div>
      )
    }

    if (folder === 'works') {
      return (
        <div className="space-y-2 mt-2">
          <select
            value={file.designer_id}
            onChange={(e) => updateFileData(index, 'designer_id', Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
          >
            {designers.map((d) => (
              <option key={d.id} value={d.id}>{d.designer_name}</option>
            ))}
          </select>
          <input
            type="text"
            value={file.work_title}
            onChange={(e) => updateFileData(index, 'work_title', e.target.value)}
            placeholder="Название работы *"
            className="w-full px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
          />
          <textarea
            value={file.description}
            onChange={(e) => updateFileData(index, 'description', e.target.value)}
            placeholder="Описание работы"
            className="w-full px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 resize-none h-10"
          />
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
          Загрузите до {maxFiles} файлов — все данные сохранятся в базу
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

      {/* Область для загрузки */}
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-pink-500 hover:bg-white/5 transition-all duration-300">
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id="bulk-upload"
          disabled={uploading}
        />
        <label htmlFor="bulk-upload" className="cursor-pointer block">
          <Upload className="w-12 h-12 text-white/40 mx-auto mb-3" />
          <p className="text-white/60">Нажмите или перетащите файлы</p>
          <p className="text-white/30 text-sm mt-1">
            {files.length} / {maxFiles} файлов
          </p>
          <p className="text-white/20 text-xs mt-2">
            JPG, PNG, WebP • макс. 5MB каждый
          </p>
        </label>
      </div>

      {/* Массовые настройки */}
      {files.length > 0 && renderBulkSettings()}

      {/* Превью загруженных файлов */}
      {files.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-white/40 text-sm">Выбрано: {files.length} файлов</p>
            <button
              onClick={clearAll}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
              disabled={uploading}
            >
              <Trash2 size={14} />
              Очистить все
            </button>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-white/20 transition">
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <img
                      src={file.preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full hover:scale-110 transition"
                      disabled={uploading}
                    >
                      <X size={12} className="text-white" />
                    </button>
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white/60">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/50 text-xs truncate">{file.file.name}</p>
                    {renderFileFields(file, index)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            Загрузка... {Math.round(uploadProgress)}% ({Math.round(uploadProgress / 100 * files.length)} из {files.length})
          </p>
        </div>
      )}

      {/* Кнопки действий */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={uploadAll}
          disabled={files.length === 0 || uploading}
          className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Загрузка и сохранение...
            </>
          ) : (
            <>
              <Upload size={18} />
              Загрузить и сохранить {files.length} записей
            </>
          )}
        </button>
        
        {uploadedData.length > 0 && (
          <button
            onClick={() => {
              const text = uploadedData.map((d, i) => `${i+1}. ${d.url}`).join('\n')
              navigator.clipboard.writeText(text)
              alert(`Скопировано ${uploadedData.length} URL`)
            }}
            className="px-4 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition flex items-center gap-2"
          >
            <Copy size={16} />
            Копировать URL
          </button>
        )}
      </div>

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