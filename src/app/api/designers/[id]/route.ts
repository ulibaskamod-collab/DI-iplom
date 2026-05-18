import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
  database: process.env.DB_NAME || process.env.PGDATABASE || 'zadiac',
  user: process.env.DB_USER || process.env.PGUSER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '1234',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const designerRes = await pool.query(
      'SELECT * FROM designers WHERE id = $1',
      [params.id]
    )

    if (designerRes.rows.length === 0) {
      return NextResponse.json({ error: 'Designer not found' }, { status: 404 })
    }

    const worksRes = await pool.query(
      'SELECT * FROM designer_works WHERE designer_id = $1 ORDER BY id DESC',
      [params.id]
    )

    return NextResponse.json({
      designer: designerRes.rows[0],
      works: worksRes.rows,
    })
  } catch (error) {
    console.error('GET designer detail error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}