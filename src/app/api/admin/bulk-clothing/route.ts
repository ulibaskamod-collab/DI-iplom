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
    console.log('📦 Получены данные для одежды:', body)

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

      console.log(`📝 Сохраняем запись ${i+1}:`, {
        name: template.name,
        description: template.description,
        gender: template.gender,
        zodiac_sign_id: template.zodiac_sign_id,
        season: template.season,
        imageUrl
      })

      const result = await pool.query(
        `INSERT INTO clothing_items (title, description, image_url, season, gender, zodiac_sign_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          template.name,
          template.description || '',
          imageUrl,
          template.season || 'summer',
          template.gender || 'unisex',
          template.zodiac_sign_id
        ]
      )

      savedItems.push({
        ...result.rows[0],
        template: template
      })
    }

    console.log(`✅ Сохранено ${savedItems.length} записей`)

    return NextResponse.json({
      success: true,
      saved: savedItems.length,
      items: savedItems
    })

  } catch (error: any) {
    console.error('❌ Ошибка bulk clothing:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}