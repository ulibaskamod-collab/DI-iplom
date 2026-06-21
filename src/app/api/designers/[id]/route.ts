import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const designerId = parseInt(params.id)

    if (isNaN(designerId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    // Получаем дизайнера
    const designerRes = await pool.query(
      'SELECT * FROM designers WHERE id = $1',
      [designerId]
    )

    if (designerRes.rows.length === 0) {
      return NextResponse.json({ error: 'Designer not found' }, { status: 404 })
    }

    // Получаем работы дизайнера
    const worksRes = await pool.query(
      'SELECT * FROM designer_works WHERE designer_id = $1 ORDER BY id DESC',
      [designerId]
    )

    return NextResponse.json({
      designer: designerRes.rows[0],
      works: worksRes.rows || [],
    })

  } catch (error) {
    console.error('GET designer detail error:', error)
    return NextResponse.json(
      { error: 'Server error', designer: null, works: [] },
      { status: 500 }
    )
  }
}