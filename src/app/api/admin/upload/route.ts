import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файл слишком большой (макс. 5MB)' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Можно загружать только изображения' }, { status: 400 })
    }

    // Конвертируем в base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    
    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name.replace(/\s/g, '_')}`
    const path = `uploads/${folder}/${fileName}`
    
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const REPO = 'ulibaskamod-collab/DI-iplom'
    
    // Загружаем на GitHub
    const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload ${fileName}`,
        content: base64,
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('GitHub API error:', errorData)
      throw new Error(errorData.message || 'Ошибка загрузки на GitHub')
    }
    
    // Получаем raw URL изображения
    const imageUrl = `https://raw.githubusercontent.com/${REPO}/main/${path}`
    
    console.log('Image uploaded to GitHub:', imageUrl)
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Ошибка загрузки изображения' }, { status: 500 })
  }
}