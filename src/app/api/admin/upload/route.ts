import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    console.log('=== UPLOAD API START ===')
    
    const formData = await req.formData()
    const file = formData.get('image') as File
    const folder = (formData.get('folder') as string) || 'general'

    console.log('File:', file?.name, 'Size:', file?.size, 'Type:', file?.type, 'Folder:', folder)

    if (!file) {
      console.log('No file provided')
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log('File too large:', file.size)
      return NextResponse.json({ error: 'Файл слишком большой (макс. 5MB)' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type)
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
    
    console.log('GITHUB_TOKEN exists:', !!GITHUB_TOKEN)
    console.log('Path:', path)
    
    if (!GITHUB_TOKEN) {
      console.log('GITHUB_TOKEN is missing!')
      return NextResponse.json({ error: 'GitHub токен не настроен' }, { status: 500 })
    }
    
    // Проверяем, существует ли папка, создаем если нет
    const folderPath = `uploads/${folder}/`
    const checkResponse = await fetch(`https://api.github.com/repos/${REPO}/contents/${folderPath}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
      },
    })
    
    if (checkResponse.status === 404) {
      console.log('Folder does not exist, will create via file upload')
    }
    
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
    
    const imageUrl = `https://raw.githubusercontent.com/${REPO}/main/${path}`
    console.log('Upload success! URL:', imageUrl)
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Ошибка загрузки изображения' 
    }, { status: 500 })
  }
}