import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('images') as File[]
    const folder = formData.get('folder') as string || 'general'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Файлы не найдены' }, { status: 400 })
    }

    const uploadedUrls: string[] = []
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)

    // Создаем папку если её нет
    await mkdir(uploadDir, { recursive: true })

    for (const file of files) {
      // Проверка размера
      if (file.size > 5 * 1024 * 1024) {
        console.log(`⚠️ Файл ${file.name} слишком большой, пропускаем`)
        continue
      }

      // Проверка типа
      if (!file.type.startsWith('image/')) {
        console.log(`⚠️ Файл ${file.name} не изображение, пропускаем`)
        continue
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Создаем уникальное имя файла
      const timestamp = Date.now()
      const originalName = file.name.replace(/\s/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')
      const fileName = `${timestamp}_${originalName}`
      const filePath = path.join(uploadDir, fileName)

      // Сохраняем файл на диск
      await writeFile(filePath, buffer)

      // ✅ Возвращаем URL пути к файлу, а НЕ base64
      const url = `/uploads/${folder}/${fileName}`
      uploadedUrls.push(url)

      console.log(`✅ Файл сохранен: ${url}`)
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedUrls.length,
      urls: uploadedUrls,
    })

  } catch (error) {
    console.error('Bulk upload error:', error)
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 })
  }
}