import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ host: 'localhost', port: 5432, database: 'zadiac', user: 'postgres', password: '1234' })

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