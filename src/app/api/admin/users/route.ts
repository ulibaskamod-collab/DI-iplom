import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// GET - получить всех пользователей
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, name, email, user_role, created_at FROM users ORDER BY created_at DESC'
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('GET users error:', error)
    return NextResponse.json([])
  }
}

// POST - создать нового пользователя (админ может добавлять)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, user_role } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 })
    }

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

    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, user_role, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
       RETURNING id, name, email, user_role, created_at`,
      [name || null, email, hashedPassword, user_role || 'user']
    )

    return NextResponse.json({ success: true, user: result.rows[0] })
  } catch (error: any) {
    console.error('POST user error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - обновить пользователя (роль, имя)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, user_role } = body

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           user_role = COALESCE($2, user_role),
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email, user_role, created_at`,
      [name, user_role, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user: result.rows[0] })
  } catch (error: any) {
    console.error('PUT user error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - удалить пользователя
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE user error:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}