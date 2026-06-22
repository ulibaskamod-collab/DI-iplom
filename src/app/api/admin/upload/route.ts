import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File || formData.get('file') as File
    const folder = formData.get('folder') as string || 'general'

    if (!file) {
      return NextResponse.json({ error: 'Файл не выбран' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Выберите изображение' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Максимум 5MB' }, { status: 400 })
    }

    // Конвертируем в base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name.replace(/\s/g, '_')}`

    // Проверяем, есть ли GitHub токен
    const githubToken = process.env.GITHUB_TOKEN

    if (githubToken) {
      // Загружаем на GitHub
      const response = await fetch(
        `https://api.github.com/repos/ulibaskamod-collab/DI-iplom/contents/public/images/${folder}/${fileName}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Add image: ${fileName}`,
            content: base64,
            branch: 'main',
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        const imageUrl = `https://raw.githubusercontent.com/ulibaskamod-collab/DI-iplom/main/public/images/${folder}/${fileName}`
        console.log('✅ Загружено на GitHub:', imageUrl)
        return NextResponse.json({ success: true, url: imageUrl })
      } else {
        console.log('❌ GitHub upload failed, trying local save')
      }
    }

    // Если GitHub не работает - сохраняем локально
    const { writeFile, mkdir } = await import('fs/promises')
    const path = await import('path')
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
    const filePath = path.join(uploadDir, fileName)
    
    await mkdir(uploadDir, { recursive: true })
    await writeFile(filePath, buffer)
    
    const localUrl = `/uploads/${folder}/${fileName}`
    console.log('✅ Сохранено локально:', localUrl)
    
    return NextResponse.json({ success: true, url: localUrl })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки' },
      { status: 500 }
    )
  }
}