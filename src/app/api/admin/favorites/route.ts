import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'zadiac',
  user: 'postgres',
  password: '1234',
})

export async function GET() {
  try {
    const totalRes = await pool.query('SELECT COUNT(*) FROM favorites')
    
    const usersRes = await pool.query(
      'SELECT COUNT(DISTINCT user_id) FROM favorites'
    )
    
    const topItemsRes = await pool.query(
      `SELECT f.clothing_item_id, COUNT(*) as count, c.title 
       FROM favorites f 
       LEFT JOIN clothing_items c ON f.clothing_item_id = c.id 
       GROUP BY f.clothing_item_id, c.title 
       ORDER BY count DESC 
       LIMIT 5`
    )
    
    const topUsersRes = await pool.query(
      `SELECT f.user_id, COUNT(*) as count, u.name, u.email 
       FROM favorites f 
       JOIN users u ON f.user_id = u.id 
       GROUP BY f.user_id, u.name, u.email 
       ORDER BY count DESC 
       LIMIT 5`
    )

    return NextResponse.json({
      total_favorites: parseInt(totalRes.rows[0].count),
      total_users: parseInt(usersRes.rows[0].count),
      top_items: topItemsRes.rows,
      top_users: topUsersRes.rows,
    })
  } catch (error) {
    console.error('GET favorites stats error:', error)
    return NextResponse.json({
      total_favorites: 0,
      total_users: 0,
      top_items: [],
      top_users: [],
    })
  }
}