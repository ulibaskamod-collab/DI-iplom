'use client'

import { useState } from 'react'
import { Upload, X, Check } from 'lucide-react'

export default function BulkUploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [folder, setFolder] = useState('clothing')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Выберите файлы для загрузки')
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    files.forEach(file => {
      formData.append('images', file)
    })
    formData.append('folder', folder)

    try {
      const response = await fetch('/api/admin/bulk-upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUploadedUrls(data.urls)
        alert(`✅ Загружено ${data.uploaded} файлов`)
        setFiles([])
      } else {
        setError(data.error || 'Ошибка загрузки')
      }
    } catch (err) {
      setError('Ошибка соединения с сервером')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Массовая загрузка</h1>

      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <div className="mb-4">
          <label className="block text-white/60 text-sm mb-2">Папка для загрузки</label>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="w-full md:w-48 px-4 py-2 bg-white/10 rounded-lg text-white border border-white/10"
          >
            <option value="clothing">Одежда</option>
            <option value="designers">Дизайнеры</option>
            <option value="zodiac">Знаки зодиака</option>
            <option value="works">Работы</option>
          </select>
        </div>

        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500 transition">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">Нажмите для выбора файлов</p>
            <p className="text-white/30 text-sm">или перетащите их сюда</p>
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-white/60 text-sm mb-2">Выбрано файлов: {files.length}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="bg-white/5 rounded-lg p-2">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded"
                    />
                    <p className="text-white/50 text-xs truncate mt-1">{file.name}</p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {uploading ? 'Загрузка...' : `Загрузить ${files.length} файлов`}
        </button>

        {uploadedUrls.length > 0 && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm">✅ Загружено: {uploadedUrls.length} файлов</p>
            <div className="mt-2 max-h-32 overflow-y-auto">
              {uploadedUrls.map((url, i) => (
                <p key={i} className="text-white/40 text-xs truncate">{url}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}