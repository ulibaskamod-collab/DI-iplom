import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})
export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, designer_name, bio, designer_image, social_links FROM designers ORDER BY id'
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('GET designers error:', error)
    return NextResponse.json([])
  }
}