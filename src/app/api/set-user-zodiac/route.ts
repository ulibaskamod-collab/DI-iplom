export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Pool } from 'pg'
import { authOptions } from '@/src/lib/auth'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

function getZodiacSign(birthDate: string): string {
  if (!birthDate) return ''  // ← возвращаем пустую строку вместо null
  
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

    // Получаем дату рождения пользователя
    const userResult = await pool.query(
      'SELECT birth_date FROM users WHERE email = $1',
      [session.user.email]
    )
    
    let birthDate = userResult.rows[0]?.birth_date
    
    // Если нет даты рождения, устанавливаем дату по умолчанию
    if (!birthDate) {
      birthDate = '2000-08-09'  // 9 августа - Лев
    }
    
    const zodiacSign = getZodiacSign(birthDate)
    
    const result = await pool.query(
      `UPDATE users 
       SET zodiac_sign = $1, birth_date = $2 
       WHERE email = $3
       RETURNING email, zodiac_sign, birth_date`,
      [zodiacSign, birthDate, session.user.email]
    )

    return NextResponse.json({ 
      success: true, 
      user: result.rows[0],
      message: `Знак ${zodiacSign} установлен для ${session.user.email}`
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}