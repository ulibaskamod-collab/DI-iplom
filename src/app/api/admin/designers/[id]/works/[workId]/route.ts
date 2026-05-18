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
export async function GET(req: NextRequest, { params }: { params: { id: string; workId: string } }) {
  const result = await pool.query('SELECT * FROM designer_works WHERE id = $1', [params.workId])
  return NextResponse.json(result.rows[0] || {})
}

export async function PUT(req: NextRequest, { params }: { params: { id: string; workId: string } }) {
  const body = await req.json()
  const { work_title, description, work_image } = body
  await pool.query(
    'UPDATE designer_works SET work_title=$1, description=$2, work_image=$3 WHERE id=$4',
    [work_title, description, work_image, params.workId]
  )
  return NextResponse.json({ success: true })
}