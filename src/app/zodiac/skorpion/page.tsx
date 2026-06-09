'use client' 
export const dynamic = 'force-dynamic'
export const revalidate = 0
import ZodiacPageContent from '@/src/components/ZodiacPageContent'
import { zodiacFullData } from '@/src/lib/zodiacData'

export default function SkorpionPage() {
  return <ZodiacPageContent signData={zodiacFullData.skorpion} slug="skorpion" />
}