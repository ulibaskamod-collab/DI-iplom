import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Функция определения знака зодиака по дате рождения
function getZodiacSign(birthDate: string): string {
  if (!birthDate) return 'Не определен'
  
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, birthDate, gender } = body

    console.log('📝 Регистрация:', { email, birthDate, gender })

    // Проверяем, существует ли пользователь
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 400 })
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Определяем знак зодиака
    const zodiacSign = getZodiacSign(birthDate)
    console.log('⭐ Определен знак зодиака:', zodiacSign, 'для даты:', birthDate)

    // Создаем пользователя
    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, birth_date, gender, zodiac_sign, user_role, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'user', NOW())
       RETURNING id, name, email, zodiac_sign, birth_date`,
      [name || null, email, hashedPassword, birthDate || null, gender || null, zodiacSign]
    )

    console.log('✅ Пользователь создан:', result.rows[0])

    return NextResponse.json({ 
      success: true, 
      userId: result.rows[0].id,
      zodiac_sign: zodiacSign
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Ошибка регистрации:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}