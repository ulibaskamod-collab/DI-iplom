import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Pool } from 'pg'
import { authOptions } from '@/src/lib/auth'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'zadiac',
  user: 'postgres',
  password: '1234',
})

export async function GET() {
  try {
    console.log('=== GET /api/user/profile ===')
    const session = await getServerSession(authOptions)
    
    console.log('Session:', session?.user?.email)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await pool.query(
      'SELECT id, name, email, birth_date, gender, zodiac_sign FROM users WHERE email = $1',
      [session.user.email]
    )

    console.log('Query result:', result.rows)

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
    console.error('GET error DETAILS:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    console.log('=== PUT /api/user/profile ===')
    const session = await getServerSession(authOptions)
    
    console.log('Session:', session?.user?.email)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    console.log('Request body:', body)
    const { name, birthDate, gender } = body

    const checkUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [session.user.email]
    )

    if (checkUser.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let query = 'UPDATE users SET name = $1, gender = $2, updated_at = NOW()'
    const params: any[] = [name, gender]
    let paramCount = 3
    
    if (birthDate && birthDate !== '') {
      query += `, birth_date = $${paramCount}`
      params.push(birthDate)
      paramCount++
    }
    
    query += ` WHERE email = $${paramCount}`
    params.push(session.user.email)

    console.log('Query:', query)
    console.log('Params:', params)

    await pool.query(query, params)

    const result = await pool.query(
      'SELECT id, name, email, birth_date, gender, zodiac_sign FROM users WHERE email = $1',
      [session.user.email]
    )

    console.log('Updated user:', result.rows[0])

    return NextResponse.json({ 
      success: true,
      user: result.rows[0]
    })
  } catch (error) {
    console.error('PUT error DETAILS:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}