import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

// DELETE - удалить предмет одежды
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // Проверяем существование
    const check = await pool.query(
      'SELECT id FROM clothing_items WHERE id = $1',
      [id]
    )

    if (check.rows.length === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    await pool.query('DELETE FROM clothing_items WHERE id = $1', [id])

    return NextResponse.json({ 
      success: true, 
      message: 'Item deleted successfully' 
    })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}