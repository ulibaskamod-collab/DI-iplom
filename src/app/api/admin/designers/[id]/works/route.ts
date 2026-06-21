import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// GET - получить все работы дизайнера
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const designerId = parseInt(params.id)

    if (isNaN(designerId)) {
      return NextResponse.json({ error: 'Invalid designer ID' }, { status: 400 })
    }

    const result = await pool.query(
      'SELECT * FROM designer_works WHERE designer_id = $1 ORDER BY id DESC',
      [designerId]
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('GET works error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// POST - добавить работу
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    console.log('📦 Получены данные для работы:', body)

    const { work_title, description, work_image } = body

    if (!work_title) {
      return NextResponse.json({ error: 'Название работы обязательно' }, { status: 400 })
    }

    const designerId = parseInt(params.id)

    if (isNaN(designerId)) {
      return NextResponse.json({ error: 'Invalid designer ID' }, { status: 400 })
    }

    // Проверяем, существует ли дизайнер
    const designerCheck = await pool.query(
      'SELECT id FROM designers WHERE id = $1',
      [designerId]
    )

    if (designerCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Дизайнер не найден' }, { status: 404 })
    }

    const result = await pool.query(
      `INSERT INTO designer_works (designer_id, work_title, work_image, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [designerId, work_title, work_image || '', description || null]
    )

    console.log('✅ Работа сохранена:', result.rows[0])

    return NextResponse.json({ 
      success: true, 
      work: result.rows[0] 
    })
  } catch (error: any) {
    console.error('❌ POST work error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - удалить работу
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const workId = req.nextUrl.searchParams.get('id')

  if (!workId) {
    return NextResponse.json({ error: 'ID работы обязателен' }, { status: 400 })
  }

  try {
    await pool.query('DELETE FROM designer_works WHERE id = $1 AND designer_id = $2', [workId, params.id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE work error:', error)
    return NextResponse.json({ error: 'Ошибка удаления' }, { status: 500 })
  }
}