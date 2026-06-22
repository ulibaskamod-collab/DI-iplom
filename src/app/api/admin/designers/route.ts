import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { designer_name, bio, designer_image, social_links } = body

    if (!designer_name || !bio) {
      return NextResponse.json(
        { error: 'Имя и биография обязательны' },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `INSERT INTO designers (designer_name, bio, designer_image, social_links) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [designer_name, bio, designer_image || null, social_links || {}]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating designer:', error)
    return NextResponse.json(
      { error: 'Failed to create designer' },
      { status: 500 }
    )
  }
}