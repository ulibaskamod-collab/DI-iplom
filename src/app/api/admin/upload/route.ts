import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Конвертируем в Base64
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`
    
    return NextResponse.json({ 
      success: true, 
      url: base64Image  // Возвращаем Base64 строку
    })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 })
  }
}