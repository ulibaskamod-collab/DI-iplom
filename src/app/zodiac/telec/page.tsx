'use client' 
export const dynamic = 'force-dynamic'
import ZodiacPageContent from '@/src/components/ZodiacPageContent'
import { zodiacFullData } from '@/src/lib/zodiacData'

export default function TelecPage() {
  return <ZodiacPageContent signData={zodiacFullData.telec} slug="telec" />
}