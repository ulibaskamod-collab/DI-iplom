import { prisma } from '@/src/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const zodiacSlug = searchParams.get('zodiacSlug')
    
    if (!zodiacSlug) {
      return NextResponse.json({ error: 'zodiacSlug required' }, { status: 400 })
    }

    const zodiac = await prisma.zodiacSign.findUnique({
      where: { slug: zodiacSlug }
    })

    if (!zodiac) {
      return NextResponse.json({ error: 'Zodiac sign not found' }, { status: 404 })
    }

    const items = await prisma.clothingItem.findMany({
      where: { zodiac_sign_id: zodiac.id }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching zodiac items:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}