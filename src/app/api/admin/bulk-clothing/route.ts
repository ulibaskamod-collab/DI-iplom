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

    // ⚡ НОВАЯ ЛОГИКА: для каждого шаблона может быть несколько фото
    const savedItems = []

    for (let tIndex = 0; tIndex < templates.length; tIndex++) {
      const template = templates[tIndex]
      
      // Получаем все фото для этого шаблона
      // Если images - плоский массив, то берем все фото
      // Если images - массив массивов, то берем соответствующий
      let templateImages: string[] = []
      
      if (Array.isArray(images[0])) {
        // images - массив массивов
        templateImages = images[tIndex] || []
      } else {
        // images - плоский массив (все фото для одного шаблона)
        templateImages = images
      }

      console.log(`📝 Шаблон ${tIndex + 1}: ${template.name}, фото: ${templateImages.length}`)

      // Сохраняем каждое фото как отдельную запись
      for (let i = 0; i < templateImages.length; i++) {
        const imageUrl = templateImages[i] || ''

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
          template: template,
          image_index: i + 1
        })
      }
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