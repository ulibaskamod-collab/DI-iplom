'use client'

import { useState } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { useImageUpload } from '@/src/lib/hooks/useImageUpload'

interface ImageUploadFieldProps {
  folder: string
  value?: string
  onChange?: (url: string) => void
  onError?: (error: string) => void
  className?: string
  label?: string
  required?: boolean
}

export default function ImageUploadField({
  folder,
  value,
  onChange,
  onError,
  className = '',
  label = 'Изображение',
  required = false,
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(value || null)

  const {
    imageFile,
    imagePreview,
    isUploading,
    uploadError,
    handleImageChange,
    uploadImage,
    removeImage,
  } = useImageUpload({
    folder,
    onError: onError || ((error) => console.error(error)),
    // ✅ НЕТ onSuccess
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e)
    // Загружаем сразу после выбора файла
    const url = await uploadImage()
    if (url) {
      setPreview(url)
      onChange?.(url)
    }
  }

  const handleRemoveImage = () => {
    removeImage()
    setPreview(null)
    onChange?.('')
  }

  return (
    <div className={className}>
      <label className="block text-white font-medium mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      <div className="flex items-center gap-4">
        {/* Превью */}
        {(preview || imagePreview) ? (
          <div className="relative">
            <img
              src={imagePreview || preview || ''}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-xl border-2 border-white/10"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          // Поле загрузки
          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-500 transition">
            <Upload className="w-6 h-6 text-white/40" />
            <span className="text-white/40 text-xs mt-1">Загрузить</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}

        {/* Статус загрузки */}
        {isUploading && <span className="text-white/50 text-sm">Загрузка...</span>}
        {uploadError && <span className="text-red-400 text-sm">{uploadError}</span>}
      </div>

      {/* Текущий URL (скрытое поле) */}
      {value && (
        <p className="text-white/30 text-xs mt-2 truncate">
          Текущий файл: {value.split('/').pop()}
        </p>
      )}
    </div>
  )
}