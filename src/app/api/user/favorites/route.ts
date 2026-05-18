import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Pool } from 'pg'
import { authOptions } from '@/src/lib/auth'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json([])
    }

    // Находим пользователя
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [session.user.email]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json([])
    }

    const userId = userResult.rows[0].id

    // Получаем избранное
    const favoritesResult = await pool.query(
      `SELECT f.*, c.* FROM favorites f 
       JOIN clothing_items c ON f.clothing_item_id = c.id 
       WHERE f.user_id = $1`,
      [userId]
    )

    return NextResponse.json(favoritesResult.rows)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { clothingItemId } = body

    if (!clothingItemId) {
      return NextResponse.json({ error: 'clothingItemId required' }, { status: 400 })
    }

    // Находим пользователя
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [session.user.email]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = userResult.rows[0].id

    // Проверяем, существует ли товар
    const itemResult = await pool.query(
      'SELECT id FROM clothing_items WHERE id = $1',
      [clothingItemId]
    )

    if (itemResult.rows.length === 0) {
      return NextResponse.json({ error: 'Clothing item not found' }, { status: 404 })
    }

    // Добавляем в избранное
    await pool.query(
      `INSERT INTO favorites (user_id, clothing_item_id) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id, clothing_item_id) DO NOTHING`,
      [userId, clothingItemId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Получаем ID товара из URL
    const url = new URL(req.url)
    const clothingItemId = url.searchParams.get('clothingItemId')

    console.log('DELETE - clothingItemId:', clothingItemId)

    if (!clothingItemId) {
      return NextResponse.json({ error: 'clothingItemId required' }, { status: 400 })
    }

    // Находим пользователя
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [session.user.email]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = userResult.rows[0].id

    // Удаляем из избранного
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND clothing_item_id = $2',
      [userId, parseInt(clothingItemId)]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}