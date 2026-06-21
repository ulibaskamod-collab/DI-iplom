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
    const { templates, images } = body

    if (!templates || !Array.isArray(templates) || templates.length === 0) {
      return NextResponse.json({ error: 'Нет шаблонов для сохранения' }, { status: 400 })
    }

    const savedItems = []

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i]
      const imageUrl = images[i] || ''

      const result = await pool.query(
        `INSERT INTO designers (designer_name, bio, designer_image, social_links)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [template.designer_name, template.bio || '', imageUrl, JSON.stringify({})]
      )

      savedItems.push({
        ...result.rows[0],
        template: template
      })
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