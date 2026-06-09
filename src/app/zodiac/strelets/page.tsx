'use client' 
import ZodiacPageContent from '@/src/components/ZodiacPageContent'
import { zodiacFullData } from '@/src/lib/zodiacData'

export default function StreletsPage() {
  return <ZodiacPageContent signData={zodiacFullData.strelets} slug="strelets" />
}