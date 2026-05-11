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
  console.log('=== API /api/register ===')
  
  try {
    const body = await req.json()
    const { name, email, password, birthDate, gender } = body

    console.log('Данные:', { name, email, birthDate, gender })

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Пароль должен быть минимум 8 символов' },
        { status: 400 }
      )
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }

    function getZodiacSign(birthDateStr: string) {
      if (!birthDateStr) return null
      const date = new Date(birthDateStr)
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

    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, birth_date, gender, zodiac_sign, user_role) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'user') 
       RETURNING id, name, email`,
      [name || null, email, password, birthDate || null, gender || null, getZodiacSign(birthDate)]
    )

    const user = result.rows[0]
    console.log('Пользователь создан:', user.id)

    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Ошибка:', error)
    return NextResponse.json(
      { error: error.message || 'Ошибка сервера' },
      { status: 500 }
    )
  }
}