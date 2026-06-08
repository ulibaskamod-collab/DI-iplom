// src/lib/hooks/useImageUpload.ts
import { useState, useCallback, ChangeEvent } from 'react'

interface UseImageUploadOptions {
  maxSizeMB?: number
  allowedTypes?: string[]
  folder?: 'clothing' | 'designers' | 'works' | 'zodiac' | 'general'
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
}

interface UseImageUploadReturn {
  // Состояния
  imageFile: File | null
  imagePreview: string | null
  isUploading: boolean
  uploadError: string | null
  
  // Методы
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void
  uploadImage: () => Promise<string | null>
  removeImage: () => void
  setImagePreview: (url: string | null) => void
  setImageFile: (file: File | null) => void
  
  // Вспомогательные
  validateFile: (file: File) => boolean
  reset: () => void
}

export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    folder = 'general',
    onSuccess,
    onError,
  } = options

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Валидация файла
  const validateFile = useCallback((file: File): boolean => {
    // Проверка размера
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      const errorMsg = `Файл слишком большой! Максимальный размер: ${maxSizeMB}MB`
      setUploadError(errorMsg)
      onError?.(errorMsg)
      return false
    }

    // Проверка типа
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = `Неподдерживаемый формат. Разрешены: ${allowedTypes.join(', ')}`
      setUploadError(errorMsg)
      onError?.(errorMsg)
      return false
    }

    setUploadError(null)
    return true
  }, [maxSizeMB, allowedTypes, onError])

  // Обработчик выбора файла
  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (!file) {
      return
    }

    if (!validateFile(file)) {
      // Очищаем input
      e.target.value = ''
      return
    }

    // Создаем preview
    const previewUrl = URL.createObjectURL(file)
    
    // Очищаем старый preview при необходимости
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setImageFile(file)
    setImagePreview(previewUrl)
    setUploadError(null)
  }, [validateFile, imagePreview])

  // Загрузка изображения на сервер
  const uploadImage = useCallback(async (): Promise<string | null> => {
    if (!imageFile) {
      // Если нет нового файла, но есть старый URL - возвращаем его
      return imagePreview?.startsWith('http') ? imagePreview : null
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('folder', folder)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка загрузки изображения')
      }

      if (data.success && data.url) {
        onSuccess?.(data.url)
        return data.url
      } else {
        throw new Error('Не удалось получить URL загруженного изображения')
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Неизвестная ошибка при загрузке'
      setUploadError(errorMsg)
      onError?.(errorMsg)
      return null
    } finally {
      setIsUploading(false)
    }
  }, [imageFile, imagePreview, folder, onSuccess, onError])

  // Удаление изображения
  const removeImage = useCallback(() => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(null)
    setUploadError(null)
  }, [imagePreview])

  // Сброс всех состояний
  const reset = useCallback(() => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(null)
    setIsUploading(false)
    setUploadError(null)
  }, [imagePreview])

  return {
    // Состояния
    imageFile,
    imagePreview,
    isUploading,
    uploadError,
    
    // Методы
    handleImageChange,
    uploadImage,
    removeImage,
    setImagePreview,
    setImageFile,
    
    // Вспомогательные
    validateFile,
    reset,
  }
}