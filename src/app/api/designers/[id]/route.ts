import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // Оптимизация соединений
  max: 10,
  idleTimeoutMillis: 30000,
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const designerId = parseInt(params.id)

    if (isNaN(designerId)) {
      return NextResponse.json({ error: 'Invalid ID', designer: null, works: [] }, { status: 400 })
    }

    // Оптимизированный запрос с JOIN
    const result = await pool.query(`
      SELECT 
        d.id,
        d.designer_name,
        d.bio,
        d.designer_image,
        d.social_links,
        COALESCE(
          json_agg(
            json_build_object(
              'id', dw.id,
              'work_title', dw.work_title,
              'work_image', dw.work_image,
              'description', dw.description
            )
          ) FILTER (WHERE dw.id IS NOT NULL),
          '[]'
        ) as works
      FROM designers d
      LEFT JOIN designer_works dw ON d.id = dw.designer_id
      WHERE d.id = $1
      GROUP BY d.id
    `, [designerId])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Designer not found', designer: null, works: [] }, { status: 404 })
    }

    const row = result.rows[0]
    
    return NextResponse.json({
      designer: {
        id: row.id,
        designer_name: row.designer_name,
        bio: row.bio,
        designer_image: row.designer_image,
        social_links: row.social_links,
      },
      works: row.works || [],
    })

  } catch (error) {
    console.error('GET designer detail error:', error)
    return NextResponse.json(
      { error: 'Server error', designer: null, works: [] },
      { status: 500 }
    )
  }
}