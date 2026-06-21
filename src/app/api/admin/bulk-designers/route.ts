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

    for (const item of items) {
      const { designer_name, bio, designer_image, social_links } = item

      const result = await pool.query(
        `INSERT INTO designers (designer_name, bio, designer_image, social_links)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [designer_name, bio, designer_image, JSON.stringify(social_links || {})]
      )

      savedItems.push(result.rows[0])
    }

    return NextResponse.json({
      success: true,
      saved: savedItems.length,
      items: savedItems
    })

  } catch (error: any) {
    console.error('Bulk designers error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}