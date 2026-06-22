import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// GET - получить один предмет одежды
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    const result = await pool.query(
      `SELECT 
        id, 
        title, 
        description, 
        image_url, 
        season, 
        gender, 
        zodiac_sign_id
      FROM clothing_items 
      WHERE id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('GET clothing item error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    )
  }
}

// PUT - обновить предмет одежды
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await req.json()
    const { title, description, image_url, season, gender, zodiac_sign_id } = body

    const result = await pool.query(
      `UPDATE clothing_items 
       SET 
         title = $1,
         description = $2,
         image_url = $3,
         season = $4,
         gender = $5,
         zodiac_sign_id = $6
       WHERE id = $7
       RETURNING *`,
      [title, description, image_url, season, gender, zodiac_sign_id, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('PUT clothing item error:', error)
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

// DELETE - удалить предмет одежды
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // Проверяем существование
    const checkResult = await pool.query(
      'SELECT id FROM clothing_items WHERE id = $1',
      [id]
    )

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    // Удаляем
    await pool.query('DELETE FROM clothing_items WHERE id = $1', [id])

    return NextResponse.json({ 
      success: true, 
      message: 'Item deleted successfully' 
    })
  } catch (error) {
    console.error('DELETE clothing item error:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}