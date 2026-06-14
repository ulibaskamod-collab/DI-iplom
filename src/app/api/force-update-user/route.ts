export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Pool } from 'pg'
import { authOptions } from '@/src/lib/auth'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Принудительно устанавливаем данные
    const result = await pool.query(
      `UPDATE users 
       SET name = 'Пользователь',
           birth_date = '2000-08-09', 
           zodiac_sign = 'Лев',
           updated_at = NOW()
       WHERE email = $1
       RETURNING email, name, birth_date, zodiac_sign`,
      [session.user.email]
    )

    return NextResponse.json({ 
      success: true, 
      user: result.rows[0],
      message: 'Данные пользователя обновлены! Теперь знак должен определиться.'
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}