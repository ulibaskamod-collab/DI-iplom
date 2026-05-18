import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "zadiac",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "1234",
});

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