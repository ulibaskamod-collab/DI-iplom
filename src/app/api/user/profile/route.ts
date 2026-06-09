import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Pool } from 'pg'
import { authOptions } from '@/src/lib/auth'

// Правильное подключение с SSL для Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Для Render PostgreSQL
  },
})

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

    const checkUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [session.user.email]
    )

    if (checkUser.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updateQuery = `
      UPDATE users 
      SET name = $1, 
          gender = $2, 
          birth_date = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE email = $4
      RETURNING id, name, email, birth_date, gender, zodiac_sign
    `
    
    const values = [name || null, gender || null, birthDate || null, session.user.email]
    
    const result = await pool.query(updateQuery, values)

    return NextResponse.json({
      success: true,
      user: result.rows[0]
    })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}