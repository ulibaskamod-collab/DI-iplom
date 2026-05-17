import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Добавьте эту строку, чтобы страница не собиралась статически
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [users, zodiacSigns, clothingItems, designers] = await Promise.all([
      prisma.users.count(),
      prisma.zodiacSign.count(),
      prisma.clothingItem.count(),
      prisma.designers.count(),
    ])

    return NextResponse.json({
      users,
      zodiacSigns,
      clothingItems,
      designers,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}