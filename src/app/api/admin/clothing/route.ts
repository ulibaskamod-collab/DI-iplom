import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET - получить всё
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM clothing_items ORDER BY id DESC')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('GET clothing error:', error)
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, image_url, season, gender, zodiac_sign_id } = body

    if (!title) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 })
    }

    const result = await pool.query(
      `INSERT INTO clothing_items (title, description, image_url, season, gender, zodiac_sign_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [title, description, image_url, season, gender, zodiac_sign_id]
    )

    return NextResponse.json({ success: true, item: result.rows[0] })
  } catch (error: any) {
    console.error('POST clothing error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, title, description, image_url, season, gender, zodiac_sign_id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const result = await pool.query(
      `UPDATE clothing_items 
       SET title = $1, description = $2, image_url = $3, season = $4, 
           gender = $5, zodiac_sign_id = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, description, image_url, season, gender, zodiac_sign_id, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, item: result.rows[0] })
  } catch (error: any) {
    console.error('PUT clothing error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  try {
    await pool.query('DELETE FROM clothing_items WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE clothing error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}