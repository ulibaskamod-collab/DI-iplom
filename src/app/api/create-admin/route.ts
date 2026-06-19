import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET() {
  try {
    // Хешируем пароль "admin123"
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    // Создаём или обновляем администратора
    await pool.query(
      `INSERT INTO users (id, name, email, password, user_role, created_at)
       VALUES (gen_random_uuid(), 'Admin', 'admin@stellarfit.ru', $1, 'admin', NOW())
       ON CONFLICT (email) DO UPDATE SET password = $1, user_role = 'admin'`,
      [hashedPassword]
    )
    
    return NextResponse.json({ 
      success: true, 
      message: 'Admin created! Email: admin@stellarfit.ru, Password: admin123'
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}