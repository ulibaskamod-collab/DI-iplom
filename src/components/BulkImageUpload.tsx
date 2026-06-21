'use client'

import { useState, useEffect } from 'react'
import { Upload, X, Loader2, Copy, Trash2, User, Tag, FileText } from 'lucide-react'

interface BulkImageUploadProps {
  folder: 'clothing' | 'designers' | 'works' | 'zodiac'
  onUploadComplete?: (data: any[]) => void
  maxFiles?: number
  accept?: string
}

interface FileWithData {
  file: File
  preview: string
  name: string
  description: string
  // Для одежды
  gender?: string
  zodiac_sign_id?: number
  // Для дизайнеров
  designer_name?: string
  bio?: string
  // Для работ
  designer_id?: number
  work_title?: string
}

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
  const [zodiacSigns, setZodiacSigns] = useState<{id: number, name: string}[]>([])
  const [designers, setDesigners] = useState<{id: number, designer_name: string}[]>([])

  // Загружаем знаки зодиака для одежды
  useEffect(() => {
    if (folder === 'clothing') {
      fetch('/api/admin/zodiac')
        .then(res => res.json())
        .then(data => setZodiacSigns(data))
        .catch(console.error)
    }
  }, [folder])

  // Загружаем дизайнеров для работ
  useEffect(() => {
    if (folder === 'works') {
      fetch('/api/admin/designers')
        .then(res => res.json())
        .then(data => setDesigners(data))
        .catch(console.error)
    }
  }, [folder])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setError(null)
    
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
      gender: 'unisex',
      zodiac_sign_id: zodiacSigns.length > 0 ? zodiacSigns[0].id : undefined,
      // Для дизайнеров
      designer_name: '',
      bio: '',
      // Для работ
      designer_id: designers.length > 0 ? designers[0].id : undefined,
      work_title: '',
    }))

    setFiles([...files, ...newFiles])
    e.target.value = ''
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
  }

  const uploadAll = async () => {
    if (files.length === 0) {
      setError('Нет файлов для загрузки')
      return
    }

    // Проверка заполнения обязательных полей
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      
      if (folder === 'designers' && !f.designer_name) {
        setError(`Для файла ${i+1} не указано имя дизайнера`)
        return
      }
      
      if (folder === 'works' && !f.work_title) {
        setError(`Для файла ${i+1} не указано название работы`)
        return
      }
      
      if (folder === 'clothing' && !f.name) {
        setError(`Для файла ${i+1} не указано название одежды`)
        return
      }
    }
    
    setUploading(true)
    setUploadProgress(0)
    setError(null)
    const results: any[] = []

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i]
      const formData = new FormData()
      formData.append('image', fileData.file)
      formData.append('folder', folder)

      // Добавляем дополнительные данные
      if (folder === 'clothing') {
        formData.append('title', fileData.name || 'Без названия')
        formData.append('description', fileData.description || '')
        formData.append('gender', fileData.gender || 'unisex')
        formData.append('zodiac_sign_id', String(fileData.zodiac_sign_id || ''))
        formData.append('season', 'summer') // можно добавить выбор сезона
      } else if (folder === 'designers') {
        formData.append('designer_name', fileData.designer_name || '')
        formData.append('bio', fileData.bio || '')
      } else if (folder === 'works') {
        formData.append('designer_id', String(fileData.designer_id || ''))
        formData.append('work_title', fileData.work_title || '')
        formData.append('description', fileData.description || '')
      }

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

    setUploadedData(results)
    setUploading(false)
    
    if (onUploadComplete) {
      onUploadComplete(results)
    }
  }

  // Рендер полей для каждого типа
  const renderFileFields = (file: FileWithData, index: number) => {
    if (folder === 'clothing') {
      return (
        <div className="space-y-2 mt-2">
          <input
            type="text"
            value={file.name}
            onChange={(e) => updateFileData(index, 'name', e.target.value)}
            placeholder="Название одежды *"
            className="w-full px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500"
          />
          <textarea
            value={file.description}
            onChange={(e) => updateFileData(index, 'description', e.target.value)}
            placeholder="Описание (необязательно)"
            className="w-full px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 resize-none h-12"
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
            placeholder="Биография дизайнера *"
            className="w-full px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 resize-none h-12"
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
            placeholder="Описание работы (необязательно)"
            className="w-full px-3 py-1.5 bg-white/10 rounded-lg text-white text-sm border border-white/10 focus:outline-none focus:border-pink-500 resize-none h-12"
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
        <h3 className="text-white font-medium">
          {folder === 'clothing' && '👕 Массовая загрузка одежды'}
          {folder === 'designers' && '🎨 Массовая загрузка дизайнеров'}
          {folder === 'works' && '🖼️ Массовая загрузка работ'}
          {folder === 'zodiac' && '⭐ Массовая загрузка знаков'}
        </h3>
        <p className="text-white/40 text-sm">
          Загрузите до {maxFiles} файлов с данными
        </p>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
          ❌ {error}
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
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-3 border border-white/10">
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
              Загрузка...
            </>
          ) : (
            <>
              <Upload size={18} />
              Загрузить {files.length} фото
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
          <p className="text-green-400 text-sm mb-2">✅ Загружено: {uploadedData.length}</p>
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