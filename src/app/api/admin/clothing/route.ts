import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// GET - получить все предметы одежды
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.image_url,
        c.season,
        c.gender,
        c.zodiac_sign_id,
        z.name as zodiac_sign_name
      FROM clothing_items c
      LEFT JOIN zodiac_signs z ON c.zodiac_sign_id = z.id
      ORDER BY c.id DESC
    `)
    
    // ✅ Убеждаемся, что возвращаем массив
    return NextResponse.json(result.rows || [])
  } catch (error) {
    console.error('GET clothing error:', error)
    // ✅ В случае ошибки возвращаем пустой массив, а не ошибку
    return NextResponse.json([])
  }
}

// POST - создать предмет одежды
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('📦 Создание одежды:', body)

    const { title, description, image_url, season, gender, zodiac_sign_id } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Название обязательно' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO clothing_items (title, description, image_url, season, gender, zodiac_sign_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description || '', image_url || '', season || 'summer', gender || 'unisex', zodiac_sign_id || null]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    console.error('POST clothing error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}