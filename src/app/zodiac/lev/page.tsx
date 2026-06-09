'use client' 
import ZodiacPageContent from '@/src/components/ZodiacPageContent'
import { zodiacFullData } from '@/src/lib/zodiacData'

export default function LevPage() {
  return <ZodiacPageContent signData={zodiacFullData.lev} slug="lev" />
}