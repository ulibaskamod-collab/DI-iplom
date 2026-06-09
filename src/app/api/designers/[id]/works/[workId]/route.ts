import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// GET - получить работу
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; workId: string } }
) {
  try {
    const result = await pool.query(
      'SELECT * FROM designer_works WHERE id = $1 AND designer_id = $2',
      [params.workId, params.id]
    )
    return NextResponse.json(result.rows[0] || {})
  } catch (error) {
    console.error('GET work error:', error)
    return NextResponse.json({})
  }
}

// PUT - обновить работу
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; workId: string } }
) {
  try {
    const body = await req.json()
    const { work_title, description, work_image } = body

    const result = await pool.query(
      `UPDATE designer_works 
       SET work_title = $1, description = $2, work_image = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND designer_id = $5
       RETURNING *`,
      [work_title, description, work_image, params.workId, params.id]
    )

    return NextResponse.json({ success: true, work: result.rows[0] })
  } catch (error: any) {
    console.error('PUT work error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - удалить работу
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; workId: string } }
) {
  try {
    await pool.query('DELETE FROM designer_works WHERE id = $1 AND designer_id = $2', [params.workId, params.id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE work error:', error)
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 })
  }
}