import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { designer_name, bio, designer_image, social_links } = body

    if (!designer_name || !bio) {
      return NextResponse.json({ error: 'Имя и био обязательны' }, { status: 400 })
    }

    const result = await pool.query(
      `INSERT INTO designers (designer_name, bio, designer_image, social_links) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [designer_name, bio, designer_image || '', JSON.stringify(social_links || {})]
    )

    return NextResponse.json({ success: true, designer: result.rows[0] })
  } catch (error: any) {
    console.error('POST designer error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}