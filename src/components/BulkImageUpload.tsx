'use client'

import { useState } from 'react'
import { Upload, X, Check, Loader2, Copy, Trash2 } from 'lucide-react'

interface BulkImageUploadProps {
  folder: 'clothing' | 'designers' | 'works' | 'zodiac'
  onUploadComplete?: (urls: string[]) => void
  maxFiles?: number
  accept?: string
  title?: string
  description?: string
}

export function BulkImageUpload({ 
  folder, 
  onUploadComplete, 
  maxFiles = 10,
  accept = 'image/*',
  title = 'Массовая загрузка изображений',
  description = 'Выберите несколько файлов для загрузки'
}: BulkImageUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setError(null)
    
    // Проверка на количество
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`Можно загрузить максимум ${maxFiles} файлов`)
      return
    }

    // Проверка на размер
    const oversized = selectedFiles.find(f => f.size > 5 * 1024 * 1024)
    if (oversized) {
      setError(`Файл ${oversized.name} слишком большой (макс. 5MB)`)
      return
    }

    // Проверка на тип
    const invalidType = selectedFiles.find(f => !f.type.startsWith('image/'))
    if (invalidType) {
      setError(`Файл ${invalidType.name} не является изображением`)
      return
    }

    // Создаем превью
    const newPreviews = selectedFiles.map(f => URL.createObjectURL(f))
    
    setFiles([...files, ...selectedFiles])
    setPreviews([...previews, ...newPreviews])
    
    // Сбрасываем input
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    const newPreviews = [...previews]
    
    URL.revokeObjectURL(newPreviews[index])
    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)
    
    setFiles(newFiles)
    setPreviews(newPreviews)
    setError(null)
  }

  const clearAll = () => {
    previews.forEach(p => URL.revokeObjectURL(p))
    setFiles([])
    setPreviews([])
    setUploadedUrls([])
    setUploadProgress(0)
    setError(null)
  }

  const uploadAll = async () => {
    if (files.length === 0) {
      setError('Нет файлов для загрузки')
      return
    }
    
    setUploading(true)
    setUploadProgress(0)
    setError(null)
    const urls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('image', files[i])
      formData.append('folder', folder)

      try {
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await response.json()
        
        if (data.success) {
          urls.push(data.url)
        } else {
          setError(`Ошибка загрузки: ${data.error || 'неизвестная ошибка'}`)
        }
        
        setUploadProgress(((i + 1) / files.length) * 100)
      } catch (error) {
        setError(`Ошибка загрузки файла ${i + 1}`)
        console.error('Upload failed:', error)
      }
    }

    setUploadedUrls(urls)
    setUploading(false)
    
    if (onUploadComplete) {
      onUploadComplete(urls)
    }
  }

  const copyUrls = () => {
    const urlsText = uploadedUrls.map((url, i) => `${i+1}. ${url}`).join('\n')
    navigator.clipboard.writeText(urlsText)
    alert(`Скопировано ${uploadedUrls.length} URL в буфер обмена`)
  }

  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div>
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-white/40 text-sm">{description}</p>
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
          <Upload className="w-12 h-12 text-white/40 mx-auto mb-3 group-hover:scale-110 transition" />
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
      {previews.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-white/40 text-sm">Выбрано: {previews.length} файлов</p>
            <button
              onClick={clearAll}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
              disabled={uploading}
            >
              <Trash2 size={14} />
              Очистить все
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-60 overflow-y-auto p-1">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full aspect-square object-cover rounded-lg border border-white/10 group-hover:border-pink-500/50 transition"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition hover:scale-110"
                  disabled={uploading}
                >
                  <X size={12} className="text-white" />
                </button>
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white/60">
                  {index + 1}
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
        
        {uploadedUrls.length > 0 && (
          <>
            <button
              onClick={copyUrls}
              className="px-4 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition flex items-center gap-2"
            >
              <Copy size={16} />
              Копировать URL
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-3 bg-green-500/20 rounded-xl text-green-400 hover:bg-green-500/30 transition"
            >
              ✅ Загружено {uploadedUrls.length}
            </button>
          </>
        )}
      </div>

      {/* Список загруженных URL */}
      {uploadedUrls.length > 0 && (
        <div className="bg-white/5 rounded-xl p-4 max-h-40 overflow-y-auto">
          <p className="text-white/40 text-xs mb-2">Загруженные URL:</p>
          {uploadedUrls.map((url, i) => (
            <div key={i} className="text-white/60 text-xs py-1 border-b border-white/5 last:border-0 flex items-center gap-2">
              <span className="text-white/30">{i+1}.</span>
              <span className="truncate">{url}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}