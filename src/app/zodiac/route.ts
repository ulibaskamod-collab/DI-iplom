import { prisma } from '@/src/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const zodiacSigns = await prisma.zodiacSign.findMany()
    return NextResponse.json(zodiacSigns)
  } catch (error) {
    console.error('Error fetching zodiac signs:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}