export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, email, name, user_role FROM users ORDER BY created_at DESC'
    )
    
    return NextResponse.json({
      count: result.rows.length,
      users: result.rows
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}