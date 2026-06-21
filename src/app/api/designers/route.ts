import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // Добавляем пул соединений для ускорения
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// GET - получить всех дизайнеров (оптимизированный)
export async function GET() {
  try {
    // Оптимизированный запрос без лишних подзапросов
    const result = await pool.query(`
      SELECT 
        d.id,
        d.designer_name,
        d.bio,
        d.designer_image,
        d.social_links,
        d.created_at,
        COUNT(dw.id) as works_count
      FROM designers d
      LEFT JOIN designer_works dw ON d.id = dw.designer_id
      GROUP BY d.id
      ORDER BY d.id DESC
    `)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('GET designers error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - создать дизайнера (оптимизированный)
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
       RETURNING id, designer_name, bio, designer_image, social_links, created_at`,
      [designer_name, bio, designer_image || '', JSON.stringify(social_links || {})]
    )

    return NextResponse.json({ 
      success: true, 
      designer: result.rows[0] 
    })
  } catch (error: any) {
    console.error('POST designer error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - удалить дизайнера
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  try {
    // Сначала удаляем работы, потом дизайнера (каскадно)
    await pool.query('DELETE FROM designer_works WHERE designer_id = $1', [id])
    await pool.query('DELETE FROM designers WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE designer error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}