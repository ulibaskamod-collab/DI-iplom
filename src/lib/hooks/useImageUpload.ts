import { useState, useCallback, ChangeEvent } from 'react'

interface UseImageUploadProps {
  folder: string
  maxSizeMB?: number
  onError?: (error: string) => void
}

export function useImageUpload({ folder, maxSizeMB = 5, onError }: UseImageUploadProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверка размера
    if (file.size > maxSizeMB * 1024 * 1024) {
      const error = `Файл слишком большой (макс ${maxSizeMB}MB)`
      setUploadError(error)
      onError?.(error)
      e.target.value = ''
      return
    }

    // Проверка типа
    if (!file.type.startsWith('image/')) {
      const error = 'Пожалуйста, выберите изображение'
      setUploadError(error)
      onError?.(error)
      e.target.value = ''
      return
    }

    // Создаем превью
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    const previewUrl = URL.createObjectURL(file)
    setImageFile(file)
    setImagePreview(previewUrl)
    setUploadError(null)
    setUploadedUrl(null)
  }, [maxSizeMB, onError, imagePreview])

  const uploadImage = useCallback(async (): Promise<string | null> => {
    if (!imageFile) {
      return uploadedUrl
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
        throw new Error(data.error || 'Ошибка загрузки')
      }

      if (data.success && data.url) {
        setUploadedUrl(data.url)
        setImageFile(null)
        return data.url
      } else {
        throw new Error('Неверный ответ сервера')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка загрузки изображения'
      setUploadError(message)
      onError?.(message)
      return null
    } finally {
      setIsUploading(false)
    }
  }, [imageFile, folder, onError, uploadedUrl])

  const removeImage = useCallback(() => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(null)
    setUploadError(null)
    setUploadedUrl(null)
  }, [imagePreview])

  return {
    imageFile,
    imagePreview,
    isUploading,
    uploadError,
    uploadedUrl,
    handleImageChange,
    uploadImage,
    removeImage,
    setImagePreview, // ✅ ДОБАВЛЯЕМ ЭТУ ФУНКЦИЮ
  }
}