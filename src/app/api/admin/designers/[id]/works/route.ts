import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await pool.query('SELECT * FROM designer_works WHERE designer_id = $1 ORDER BY id DESC', [params.id])
  return NextResponse.json(result.rows)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { work_title, description, work_image } = body
  const result = await pool.query(
    'INSERT INTO designer_works (designer_id, work_title, work_image, description) VALUES ($1, $2, $3, $4) RETURNING *',
    [params.id, work_title, work_image, description]
  )
  return NextResponse.json({ success: true, work: result.rows[0] })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const workId = req.nextUrl.searchParams.get('id')
  await pool.query('DELETE FROM designer_works WHERE id = $1 AND designer_id = $2', [workId, params.id])
  return NextResponse.json({ success: true })
}