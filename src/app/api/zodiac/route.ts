import { prisma } from '@/src/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const signs = await prisma.zodiacSign.findMany()
    return NextResponse.json(signs)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}