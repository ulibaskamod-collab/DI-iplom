import { useState, useCallback, ChangeEvent } from 'react'

interface UseImageUploadOptions {
  maxSizeMB?: number
  allowedTypes?: string[]
  folder?: 'clothing' | 'designers' | 'works' | 'zodiac' | 'general'
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
}

interface UseImageUploadReturn {
  imageFile: File | null
  imagePreview: string | null
  isUploading: boolean
  uploadError: string | null
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void
  uploadImage: () => Promise<string | null>
  removeImage: () => void
  setImagePreview: (url: string | null) => void
  setImageFile: (file: File | null) => void
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

  const validateFile = useCallback((file: File): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      const errorMsg = `Файл слишком большой! Максимальный размер: ${maxSizeMB}MB`
      setUploadError(errorMsg)
      onError?.(errorMsg)
      return false
    }

    if (!allowedTypes.includes(file.type)) {
      const errorMsg = `Неподдерживаемый формат. Разрешены: ${allowedTypes.join(', ')}`
      setUploadError(errorMsg)
      onError?.(errorMsg)
      return false
    }

    setUploadError(null)
    return true
  }, [maxSizeMB, allowedTypes, onError])

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (!file) {
      return
    }

    if (!validateFile(file)) {
      e.target.value = ''
      return
    }

    const previewUrl = URL.createObjectURL(file)
    
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setImageFile(file)
    setImagePreview(previewUrl)
    setUploadError(null)
  }, [validateFile, imagePreview])

  const uploadImage = useCallback(async (): Promise<string | null> => {
    // Если нет файла - возвращаем null (не ошибка)
    if (!imageFile) {
      return null
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
  }, [imageFile, folder, onSuccess, onError])

  const removeImage = useCallback(() => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(null)
    setUploadError(null)
  }, [imagePreview])

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
    imageFile,
    imagePreview,
    isUploading,
    uploadError,
    handleImageChange,
    uploadImage,
    removeImage,
    setImagePreview,
    setImageFile,
    validateFile,
    reset,
  }
}