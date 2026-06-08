// src/components/ImageUploadField.tsx
'use client'

import { useImageUpload } from '@/src/lib/hooks/useImageUpload'
import { Upload, X } from 'lucide-react'
import React from 'react'

interface ImageUploadFieldProps {
  label: string
  currentImage?: string | null
  folder?: 'clothing' | 'designers' | 'works' | 'zodiac' | 'general'
  onImageUploaded: (url: string | null) => void
  onError?: (error: string) => void
  className?: string
}

export function ImageUploadField({
  label,
  currentImage,
  folder = 'general',
  onImageUploaded,
  onError,
  className = '',
}: ImageUploadFieldProps) {
  const {
    imagePreview,
    isUploading,
    handleImageChange,
    uploadImage,
    removeImage,
    setImagePreview,
  } = useImageUpload({
    folder,
    onSuccess: (url) => onImageUploaded(url),
    onError,
  })

  // Синхронизируем с currentImage из пропсов
  React.useEffect(() => {
    if (currentImage && !imagePreview) {
      setImagePreview(currentImage)
    }
  }, [currentImage, imagePreview, setImagePreview])

  const handleRemove = async () => {
    removeImage()
    onImageUploaded(null)
  }

  return (
    <div className={className}>
      <label className="block text-white font-medium mb-2">{label}</label>
      
      <div className="flex items-start gap-4">
        {imagePreview ? (
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border-2 border-white/10"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition"
              disabled={isUploading}
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-green-500 transition">
            <Upload className="w-6 h-6 text-white/40" />
            <span className="text-white/40 text-xs mt-1">Загрузить</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        )}

        <div className="flex-1 text-sm text-white/50">
          {isUploading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Загрузка...</span>
            </div>
          ) : (
            <p>Рекомендуемый размер: 800x800px. Максимум: 5MB</p>
          )}
        </div>
      </div>
    </div>
  )
}