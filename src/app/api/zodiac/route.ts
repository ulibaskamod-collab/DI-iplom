import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Pool } from 'pg'
import { authOptions } from '@/src/lib/auth'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Маппинг знаков на slugs
const zodiacSlugs: Record<string, string> = {
  'Овен': 'oven',
  'Телец': 'telec',
  'Близнецы': 'bliznetsy',
  'Рак': 'rak',
  'Лев': 'lev',
  'Дева': 'deva',
  'Весы': 'vesy',
  'Скорпион': 'skorpion',
  'Стрелец': 'strelets',
  'Козерог': 'kozerog',
  'Водолей': 'vodoley',
  'Рыбы': 'ryby',
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await pool.query(
      'SELECT zodiac_sign FROM users WHERE email = $1',
      [session.user.email]
    )

    const user = result.rows[0]

    if (!user || !user.zodiac_sign) {
      return NextResponse.json({
        zodiac_sign: null,
        slug: null,
        message: 'Знак зодиака не найден. Заполните дату рождения в профиле.'
      })
    }

    const slug = zodiacSlugs[user.zodiac_sign]

    return NextResponse.json({
      zodiac_sign: user.zodiac_sign,
      slug: slug,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}