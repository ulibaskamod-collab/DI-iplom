import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        slug, 
        element, 
        start_date, 
        end_date, 
        description, 
        style_desc, 
        colors, 
        image_url
      FROM zodiac_signs 
      ORDER BY id
    `)
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching zodiac signs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch zodiac signs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, element, start_date, end_date, description, style_desc, colors, image_url } = body

    const result = await pool.query(
      `INSERT INTO zodiac_signs 
       (name, slug, element, start_date, end_date, description, style_desc, colors, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [name, slug, element, start_date, end_date, description, style_desc, colors, image_url]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating zodiac sign:', error)
    return NextResponse.json(
      { error: 'Failed to create zodiac sign' },
      { status: 500 }
    )
  }
}