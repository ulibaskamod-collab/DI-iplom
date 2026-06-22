import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File
    const folder = formData.get('folder') as string || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Max 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    const timestamp = Date.now()
    const fileName = `${timestamp}_${file.name}`

    // GitHub API для загрузки
    const response = await fetch(
      `https://api.github.com/repos/ulibaskamod-collab/DI-iplom/contents/public/images/${folder}/${fileName}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
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

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed')
    }

    // URL для доступа к изображению
    const imageUrl = `https://raw.githubusercontent.com/ulibaskamod-collab/DI-iplom/main/public/images/${folder}/${fileName}`

    return NextResponse.json({
      success: true,
      url: imageUrl,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}