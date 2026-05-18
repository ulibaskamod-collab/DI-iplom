import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const zodiacSlug = searchParams.get('zodiacSlug')

    if (!zodiacSlug) {
      return NextResponse.json({ error: 'zodiacSlug required' }, { status: 400 })
    }

    console.log('API: Ищем знак по slug:', zodiacSlug)

    const zodiacResult = await pool.query(
      'SELECT id, name FROM zodiac_signs WHERE slug = $1',
      [zodiacSlug]
    )

    if (zodiacResult.rows.length === 0) {
      console.log('API: Знак не найден')
      return NextResponse.json([])
    }

    const zodiacId = zodiacResult.rows[0].id
    console.log('API: Найден знак:', zodiacResult.rows[0].name, 'ID:', zodiacId)

    const itemsResult = await pool.query(
      'SELECT * FROM clothing_items WHERE zodiac_sign_id = $1 ORDER BY id DESC',
      [zodiacId]
    )

    console.log('API: Найдено предметов:', itemsResult.rows.length)

    return NextResponse.json(itemsResult.rows)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json([])
  }
}