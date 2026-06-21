import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем, что ID передан
    if (!params?.id) {
      console.error('❌ ID не передан')
      return NextResponse.json(
        { error: 'ID не указан', designer: null, works: [] },
        { status: 400 }
      )
    }

    const designerId = parseInt(params.id)

    // Проверяем, что ID - число
    if (isNaN(designerId)) {
      console.error('❌ Неверный ID:', params.id)
      return NextResponse.json(
        { error: 'Неверный ID', designer: null, works: [] },
        { status: 400 }
      )
    }

    console.log('🔍 Поиск дизайнера с ID:', designerId)

    // Получаем дизайнера
    const designerRes = await pool.query(
      'SELECT * FROM designers WHERE id = $1',
      [designerId]
    )

    if (designerRes.rows.length === 0) {
      console.log('❌ Дизайнер не найден:', designerId)
      return NextResponse.json(
        { error: 'Дизайнер не найден', designer: null, works: [] },
        { status: 404 }
      )
    }

    console.log('✅ Дизайнер найден:', designerRes.rows[0].designer_name)

    // Получаем работы дизайнера
    const worksRes = await pool.query(
      'SELECT * FROM designer_works WHERE designer_id = $1 ORDER BY id DESC',
      [designerId]
    )

    console.log(`✅ Найдено работ: ${worksRes.rows.length}`)

    return NextResponse.json({
      designer: designerRes.rows[0],
      works: worksRes.rows || [],
    })

  } catch (error) {
    console.error('❌ Ошибка GET designer detail:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера', designer: null, works: [] },
      { status: 500 }
    )
  }
}