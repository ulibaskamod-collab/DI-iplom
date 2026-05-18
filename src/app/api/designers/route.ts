import { NextResponse } from 'next/server'
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
      'SELECT id, designer_name, bio, designer_image, social_links FROM designers ORDER BY id'
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('GET designers error:', error)
    return NextResponse.json([])
  }
}