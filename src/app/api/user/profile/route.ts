export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Pool } from 'pg'
import { authOptions } from '@/src/lib/auth'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

function getZodiacSign(birthDate: string): string | null {
  if (!birthDate) return null
  
  const date = new Date(birthDate)
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Овен'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Телец'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Близнецы'
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Рак'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Лев'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Дева'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Весы'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Скорпион'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Стрелец'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Козерог'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Водолей'
  return 'Рыбы'
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await pool.query(
      'SELECT id, name, email, birth_date, gender, zodiac_sign FROM users WHERE email = $1',
      [session.user.email]
    )

    const user = result.rows[0]
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      birth_date: user.birth_date,
      gender: user.gender,
      zodiac_sign: user.zodiac_sign,
    })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, birthDate, gender } = body

    console.log('📝 Обновление профиля:', { name, birthDate, gender })

    // Проверяем, существует ли пользователь
    const checkUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [session.user.email]
    )

    if (checkUser.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Вычисляем знак зодиака, если есть дата рождения
    let zodiacSign = null
    if (birthDate) {
      zodiacSign = getZodiacSign(birthDate)
      console.log('⭐ Вычислен знак зодиака:', zodiacSign, 'для даты:', birthDate)
    }

    // Обновляем данные
    const updateQuery = `
      UPDATE users 
      SET name = $1, 
          gender = $2, 
          birth_date = $3,
          zodiac_sign = $4,
          updated_at = NOW()
      WHERE email = $5
      RETURNING id, name, email, birth_date, gender, zodiac_sign
    `
    
    const values = [name || null, gender || null, birthDate || null, zodiacSign, session.user.email]
    
    const result = await pool.query(updateQuery, values)

    console.log('✅ Профиль обновлен:', result.rows[0])

    return NextResponse.json({
      success: true,
      user: result.rows[0]
    })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}