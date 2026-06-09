export const dynamic = 'force-dynamic'

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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('Session email:', session?.user?.email)
    
    if (!session?.user?.email) {
      console.log('No session email')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await pool.query(
      'SELECT zodiac_sign FROM users WHERE email = $1',
      [session.user.email]
    )

    console.log('Query result:', result.rows)

    const user = result.rows[0]
    
    if (!user || !user.zodiac_sign) {
      console.log('No zodiac sign found for user')
      return NextResponse.json({ 
        zodiac_sign: null, 
        slug: null,
        message: 'Знак зодиака не найден. Заполните дату рождения в профиле.'
      })
    }

    const slugs: Record<string, string> = {
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

    const slug = slugs[user.zodiac_sign]
    console.log('Zodiac sign found:', user.zodiac_sign, 'Slug:', slug)

    return NextResponse.json({
      zodiac_sign: user.zodiac_sign,
      slug: slug,
    })
  } catch (error) {
    console.error('Error fetching user zodiac:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}