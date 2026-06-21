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
    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Нет данных для сохранения' }, { status: 400 })
    }

    const savedItems = []
    const errors = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const { designer_id, work_title, description, work_image } = item

      // Проверяем, существует ли дизайнер
      const designerCheck = await pool.query(
        'SELECT id FROM designers WHERE id = $1',
        [designer_id]
      )

      if (designerCheck.rows.length === 0) {
        errors.push(`Дизайнер с ID ${designer_id} не найден для записи ${i+1}`)
        continue
      }

      try {
        const result = await pool.query(
          `INSERT INTO designer_works (designer_id, work_title, work_image, description)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [designer_id, work_title, work_image, description || null]
        )

        savedItems.push(result.rows[0])
      } catch (err) {
        console.error('Error saving work:', err)
        errors.push(`Ошибка сохранения записи ${i+1}`)
      }
    }

    return NextResponse.json({
      success: true,
      saved: savedItems.length,
      errors: errors.length > 0 ? errors : undefined,
      items: savedItems
    })

  } catch (error: any) {
    console.error('Bulk works error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}