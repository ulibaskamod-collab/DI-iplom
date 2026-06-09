import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// GET - получить все знаки зодиака
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, name, slug, element FROM zodiac_signs ORDER BY id'
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('GET zodiac error:', error)
    return NextResponse.json([])
  }
}

// POST - создать новый знак
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, slug, element, start_date, end_date, description, style_desc, colors, image_url } = body

    const result = await pool.query(
      `INSERT INTO zodiac_signs (name, slug, element, start_date, end_date, description, style_desc, colors, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [name, slug, element, start_date, end_date, description, style_desc, colors, image_url]
    )

    return NextResponse.json({ success: true, sign: result.rows[0] })
  } catch (error: any) {
    console.error('POST zodiac error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - обновить знак
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, slug, element, start_date, end_date, description, style_desc, colors, image_url } = body

    const result = await pool.query(
      `UPDATE zodiac_signs
       SET name = $1, slug = $2, element = $3, start_date = $4, end_date = $5,
           description = $6, style_desc = $7, colors = $8, image_url = $9,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [name, slug, element, start_date, end_date, description, style_desc, colors, image_url, id]
    )

    return NextResponse.json({ success: true, sign: result.rows[0] })
  } catch (error: any) {
    console.error('PUT zodiac error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - удалить знак
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  try {
    await pool.query('DELETE FROM zodiac_signs WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE zodiac error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}