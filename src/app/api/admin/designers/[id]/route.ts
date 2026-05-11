import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ host: 'localhost', port: 5432, database: 'zadiac', user: 'postgres', password: '1234' })

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await pool.query('SELECT * FROM designers WHERE id = $1', [params.id])
  if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(result.rows[0])
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { designer_name, bio, designer_image, social_links } = body
  const result = await pool.query(
    'UPDATE designers SET designer_name=$1, bio=$2, designer_image=$3, social_links=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 RETURNING *',
    [designer_name, bio, designer_image, JSON.stringify(social_links || {}), params.id]
  )
  return NextResponse.json({ success: true, designer: result.rows[0] })
}