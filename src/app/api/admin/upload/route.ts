import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File || formData.get('file') as File
    const folder = formData.get('folder') as string || 'general'

    // Проверка наличия файла
    if (!file) {
      return NextResponse.json(
        { error: 'Файл не выбран' },
        { status: 400 }
      )
    }

    // Проверка типа
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Пожалуйста, выберите изображение' },
        { status: 400 }
      )
    }

    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Файл слишком большой (макс 5MB)' },
        { status: 400 }
      )
    }

    // Конвертируем файл
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Создаем уникальное имя
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')
    const fileName = `${timestamp}_${originalName}`

    // Путь для сохранения
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
    const filePath = path.join(uploadDir, fileName)

    // Создаем папку если её нет
    await mkdir(uploadDir, { recursive: true })

    // Сохраняем файл
    await writeFile(filePath, buffer)

    // URL для доступа
    const url = `/uploads/${folder}/${fileName}`

    console.log('✅ Файл загружен:', url)

    return NextResponse.json({
      success: true,
      url: url,
      fileName: fileName
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: 'Ошибка загрузки файла',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Upload API is working' })
}