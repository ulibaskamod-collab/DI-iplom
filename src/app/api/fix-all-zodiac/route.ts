export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { Pool } from 'pg'

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
    const users = await pool.query(
      'SELECT id, email, birth_date, zodiac_sign FROM users'
    )
    
    let updated = 0
    const results = []
    
    for (const user of users.rows) {
      if (user.birth_date && (!user.zodiac_sign || user.zodiac_sign === 'Не определен')) {
        const newSign = getZodiacSign(user.birth_date)
        if (newSign) {
          await pool.query(
            'UPDATE users SET zodiac_sign = $1 WHERE id = $2',
            [newSign, user.id]
          )
          updated++
          results.push({ email: user.email, newSign })
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      total_users: users.rows.length,
      updated: updated,
      results: results
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}