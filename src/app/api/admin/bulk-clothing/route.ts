import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Массовое добавление одежды
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Нет данных для сохранения' }, { status: 400 })
    }

    const savedItems = []

    for (const item of items) {
      const { title, description, image_url, season, gender, zodiac_sign_id } = item

      const result = await pool.query(
        `INSERT INTO clothing_items (title, description, image_url, season, gender, zodiac_sign_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [title, description, image_url, season || 'summer', gender || 'unisex', zodiac_sign_id]
      )

      savedItems.push(result.rows[0])
    }

    return NextResponse.json({
      success: true,
      saved: savedItems.length,
      items: savedItems
    })

  } catch (error: any) {
    console.error('Bulk clothing error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}