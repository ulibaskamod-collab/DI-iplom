import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    const result = await pool.query(
      'DELETE FROM zodiac_signs WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Zodiac sign not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Zodiac sign deleted successfully' })
  } catch (error) {
    console.error('Error deleting zodiac sign:', error)
    return NextResponse.json(
      { error: 'Failed to delete zodiac sign' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { name, slug, element, start_date, end_date, description, style_desc, colors, image_url } = body

    const result = await pool.query(
      `UPDATE zodiac_signs 
       SET name = $1, slug = $2, element = $3, start_date = $4, end_date = $5, 
           description = $6, style_desc = $7, colors = $8, image_url = $9
       WHERE id = $10 
       RETURNING *`,
      [name, slug, element, start_date, end_date, description, style_desc, colors, image_url, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Zodiac sign not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating zodiac sign:', error)
    return NextResponse.json(
      { error: 'Failed to update zodiac sign' },
      { status: 500 }
    )
  }
}