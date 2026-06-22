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

    // ЗАГРУЗКА НА imgBB С ВАШИМ КЛЮЧОМ
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        key: '7cdabd1c1afcb0e51e4e8094e8b90000', // ✅ ВАШ НОВЫЙ КЛЮЧ
        image: base64Image,
        name: `${folder}_${Date.now()}_${file.name}`,
      }),
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ Фото загружено на imgBB:', data.data.url)
      return NextResponse.json({
        success: true,
        url: data.data.url,
      })
    } else {
      console.error('❌ Ошибка imgBB:', data.error)
      
      // Если imgBB не работает - возвращаем заглушку
      return NextResponse.json({
        success: true,
        url: '/images/clothing/placeholder.svg',
        isFallback: true,
      })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки' },
      { status: 500 }
    )
  }
}