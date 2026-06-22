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
    const base64Image = buffer.toString('base64')

    // ПРОБУЕМ imgBB (бесплатно, без регистрации)
    try {
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          key: 'bd3e67a9e3f5c7d8e9f0a1b2c3d4e5f6',
          image: base64Image,
          name: `${folder}_${Date.now()}_${file.name}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        console.log('✅ Загружено на imgBB:', data.data.url)
        return NextResponse.json({
          success: true,
          url: data.data.url,
        })
      }
    } catch (imgbbError) {
      console.log('⚠️ imgBB не работает, пробуем fallback')
    }

    // Если imgBB не работает - сохраняем как base64 в ответе
    // (клиент сам решит, что делать)
    const dataUrl = `data:${file.type};base64,${base64Image}`
    
    return NextResponse.json({
      success: true,
      url: dataUrl,
      isBase64: true,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки' },
      { status: 500 }
    )
  }
}