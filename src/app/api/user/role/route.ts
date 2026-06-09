export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const result = await pool.query(
      'SELECT user_role FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ role: null })
    }

    return NextResponse.json({ role: result.rows[0].user_role || 'user' })
  } catch (error) {
    console.error('Role check error:', error)
    return NextResponse.json({ role: null })
  }
}