'use client' 
export const dynamic = 'force-dynamic'
import ZodiacPageContent from '@/src/components/ZodiacPageContent'
import { zodiacFullData } from '@/src/lib/zodiacData'

export default function KozerogPage() {
  return <ZodiacPageContent signData={zodiacFullData.kozerog} slug="kozerog" />
}