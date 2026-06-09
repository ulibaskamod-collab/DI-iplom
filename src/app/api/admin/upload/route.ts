import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const REPO = 'ulibaskamod-collab/DI-iplom'
    const PATH = `public/uploads/${folder}/${fileName}`
    
    const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
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
    
    const data = await response.json()
    
    if (!response.ok) {
      console.error('GitHub API error:', data)
      throw new Error(data.message || 'Ошибка загрузки на GitHub')
    }
    
    const imageUrl = `https://raw.githubusercontent.com/${REPO}/main/${PATH}`
    
    return NextResponse.json({ success: true, url: imageUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 })
  }
}