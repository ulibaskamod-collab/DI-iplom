import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файл слишком большой (макс. 5MB)' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Можно загружать только изображения' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`

    console.log('✅ Файл загружен в base64, размер:', Math.round(buffer.length / 1024), 'KB')

    return NextResponse.json({ 
      success: true, 
      url: base64Image 
    })
  } catch (error) {
    console.error('❌ Upload error:', error)
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 })
  }
}