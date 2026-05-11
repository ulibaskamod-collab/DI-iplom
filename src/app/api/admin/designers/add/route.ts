import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'zadiac',
  user: 'postgres',
  password: '1234',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { designer_name, bio, designer_image, social_links } = body

    console.log('POST designer - body:', body)

    if (!designer_name || !bio) {
      return NextResponse.json({ error: 'Имя и био обязательны' }, { status: 400 })
    }

    const result = await pool.query(
      `INSERT INTO designers (designer_name, bio, designer_image, social_links) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [
        designer_name, 
        bio, 
        designer_image || '/images/designers/default.jpg', 
        JSON.stringify(social_links || {})
      ]
    )

    console.log('POST designer - success:', result.rows[0])

    return NextResponse.json({ 
      success: true, 
      designer: result.rows[0],
      message: 'Дизайнер успешно добавлен!' 
    })
  } catch (error: any) {
    console.error('POST designer error:', error)
    return NextResponse.json({ 
      error: error.message || 'Ошибка сервера' 
    }, { status: 500 })
  }
}