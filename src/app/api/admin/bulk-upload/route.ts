import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('images') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Файлы не найдены' }, { status: 400 })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) continue
      if (!file.type.startsWith('image/')) continue

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`

      uploadedUrls.push(base64Image)
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