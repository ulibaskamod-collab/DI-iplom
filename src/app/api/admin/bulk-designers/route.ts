import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('📦 Получены данные для дизайнеров:', body)

    const { templates, images } = body

    if (!templates || !Array.isArray(templates) || templates.length === 0) {
      return NextResponse.json({ error: 'Нет шаблонов для сохранения' }, { status: 400 })
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'Нет изображений' }, { status: 400 })
    }

    if (templates.length !== images.length) {
      return NextResponse.json({ 
        error: `Количество шаблонов (${templates.length}) и фото (${images.length}) не совпадает` 
      }, { status: 400 })
    }

    const savedItems = []

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i]
      const imageUrl = images[i] || ''

      // ✅ Убедимся, что URL начинается с /uploads/
      const finalImageUrl = imageUrl.startsWith('/uploads/') ? imageUrl : `/uploads/designers/${imageUrl}`

      console.log(`📝 Сохраняем дизайнера ${i+1}:`, {
        designer_name: template.designer_name,
        bio: template.bio,
        imageUrl: finalImageUrl
      })

      const result = await pool.query(
        `INSERT INTO designers (designer_name, bio, designer_image, social_links)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [template.designer_name, template.bio || '', finalImageUrl, JSON.stringify({})]
      )

      savedItems.push({
        ...result.rows[0],
        template: template
      })
    }

    console.log(`✅ Сохранено ${savedItems.length} дизайнеров`)

    return NextResponse.json({
      success: true,
      saved: savedItems.length,
      items: savedItems
    })

  } catch (error: any) {
    console.error('❌ Ошибка bulk designers:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}