import { prisma } from '@/src/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const sign = await prisma.zodiacSign.findUnique({
      where: { slug: params.slug }
    })
    
    if (!sign) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    
    return NextResponse.json(sign)
  } catch (error) {
    console.error('Error fetching zodiac sign:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}