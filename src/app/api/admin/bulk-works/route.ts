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
    console.log('📦 Получены данные для работ:', body)

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

      // Проверяем существование дизайнера
      const designerCheck = await pool.query(
        'SELECT id FROM designers WHERE id = $1',
        [template.designer_id]
      )

      if (designerCheck.rows.length === 0) {
        console.log(`⚠️ Дизайнер с ID ${template.designer_id} не найден`)
        continue
      }

      console.log(`📝 Сохраняем работу ${i+1}:`, {
        designer_id: template.designer_id,
        work_title: template.work_title,
        imageUrl
      })

      const result = await pool.query(
        `INSERT INTO designer_works (designer_id, work_title, work_image, description)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [template.designer_id, template.work_title, imageUrl, template.description || null]
      )

      savedItems.push({
        ...result.rows[0],
        template: template
      })
    }

    console.log(`✅ Сохранено ${savedItems.length} работ`)

    return NextResponse.json({
      success: true,
      saved: savedItems.length,
      items: savedItems
    })

  } catch (error: any) {
    console.error('❌ Ошибка bulk works:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}