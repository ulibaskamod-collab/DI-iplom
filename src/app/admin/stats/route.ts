import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [users, zodiacSigns, clothingItems, designers] = await Promise.all([
      prisma.users.count(),        // Исправлено: users (множественное число)
      prisma.zodiacSign.count(),
      prisma.clothingItem.count(),
      prisma.designers.count(),    // Исправлено: designers (множественное число)
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