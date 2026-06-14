export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Pool } from 'pg'
import { authOptions } from '@/src/lib/auth'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Функция определения знака зодиака по дате рождения (для обновления)
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔍 Session email:', session?.user?.email)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем пользователя
    const result = await pool.query(
      'SELECT zodiac_sign, birth_date FROM users WHERE email = $1',
      [session.user.email]
    )

    console.log('📊 Query result:', result.rows)

    let user = result.rows[0]
    
    // Если знака нет, но есть дата рождения - вычисляем и обновляем
    if (user && (!user.zodiac_sign || user.zodiac_sign === 'Не определен') && user.birth_date) {
      const newZodiacSign = getZodiacSign(user.birth_date)
      console.log('🔄 Обновляем знак:', newZodiacSign)
      
      await pool.query(
        'UPDATE users SET zodiac_sign = $1 WHERE email = $2',
        [newZodiacSign, session.user.email]
      )
      
      user.zodiac_sign = newZodiacSign
    }

    const slugs: Record<string, string> = {
      'Овен': 'oven', 'Телец': 'telec', 'Близнецы': 'bliznetsy',
      'Рак': 'rak', 'Лев': 'lev', 'Дева': 'deva', 'Весы': 'vesy',
      'Скорпион': 'skorpion', 'Стрелец': 'strelets', 'Козерог': 'kozerog',
      'Водолей': 'vodoley', 'Рыбы': 'ryby',
    }

    if (!user || !user.zodiac_sign) {
      console.log('⚠️ Знак зодиака не найден')
      return NextResponse.json({ 
        zodiac_sign: null, 
        slug: null,
        message: 'Знак зодиака не найден. Заполните дату рождения в профиле.'
      })
    }

    const slug = slugs[user.zodiac_sign]
    console.log('✅ Знак найден:', user.zodiac_sign, '→', slug)

    return NextResponse.json({
      zodiac_sign: user.zodiac_sign,
      slug: slug,
    })
  } catch (error) {
    console.error('❌ Ошибка:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}