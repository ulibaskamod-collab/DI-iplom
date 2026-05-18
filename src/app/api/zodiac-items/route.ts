import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "zadiac",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "1234",
});
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const zodiacSlug = searchParams.get('zodiacSlug')

    if (!zodiacSlug) {
      return NextResponse.json({ error: 'zodiacSlug required' }, { status: 400 })
    }

    const zodiacResult = await pool.query(
      'SELECT id, name FROM zodiac_signs WHERE slug = $1',
      [zodiacSlug]
    )

    if (zodiacResult.rows.length === 0) {
      return NextResponse.json([])
    }

    const zodiacId = zodiacResult.rows[0].id

    const itemsResult = await pool.query(
      'SELECT * FROM clothing_items WHERE zodiac_sign_id = $1 ORDER BY id DESC',
      [zodiacId]
    )

    return NextResponse.json(itemsResult.rows)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json([])
  }
}