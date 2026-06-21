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
    console.log('📦 Получены данные:', body)

    const { templates, images } = body

    if (!templates || !Array.isArray(templates) || templates.length === 0) {
      return NextResponse.json({ error: 'Нет шаблонов' }, { status: 400 })
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'Нет изображений' }, { status: 400 })
    }

    const savedItems = []

    // Проходим по каждому шаблону
    for (let tIndex = 0; tIndex < templates.length; tIndex++) {
      const template = templates[tIndex]
      
      // Определяем, какие фото относятся к этому шаблону
      let templateImages: string[] = []
      
      // Если images - плоский массив (все фото для одного шаблона)
      // Или если это массив массивов (фото для каждого шаблона отдельно)
      if (Array.isArray(images[0])) {
        // images = [ [url1, url2], [url3, url4] ]
        templateImages = images[tIndex] || []
      } else {
        // images = [url1, url2, url3] — все фото для одного шаблона
        templateImages = images
      }

      console.log(`📝 Шаблон ${tIndex + 1}: ${template.work_title}, фото: ${templateImages.length}`)

      // Проверяем существование дизайнера
      const designerCheck = await pool.query(
        'SELECT id FROM designers WHERE id = $1',
        [template.designer_id]
      )

      if (designerCheck.rows.length === 0) {
        console.log(`⚠️ Дизайнер с ID ${template.designer_id} не найден`)
        continue
      }

      // ⚡ СОЗДАЕМ ОТДЕЛЬНУЮ ЗАПИСЬ ДЛЯ КАЖДОГО ФОТО
      for (let i = 0; i < templateImages.length; i++) {
        const imageUrl = templateImages[i] || ''

        const result = await pool.query(
          `INSERT INTO designer_works (designer_id, work_title, work_image, description)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [template.designer_id, template.work_title, imageUrl, template.description || null]
        )

        savedItems.push({
          ...result.rows[0],
          template: template,
          image_index: i + 1
        })
      }
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