import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const [usersRes, zodiacRes, clothingRes, designersRes, favoritesRes] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM zodiac_signs'),
      pool.query('SELECT COUNT(*) FROM clothing_items'),
      pool.query('SELECT COUNT(*) FROM designers'),
      pool.query('SELECT COUNT(*) FROM favorites'),
    ]);

    return NextResponse.json({
      users: parseInt(usersRes.rows[0].count),
      zodiacSigns: parseInt(zodiacRes.rows[0].count),
      clothingItems: parseInt(clothingRes.rows[0].count),
      designers: parseInt(designersRes.rows[0].count),
      favorites: parseInt(favoritesRes.rows[0].count),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
