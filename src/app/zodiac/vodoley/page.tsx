'use client' 
import ZodiacPageContent from '@/src/components/ZodiacPageContent'
import { zodiacFullData } from '@/src/lib/zodiacData'

export default function VodoleyPage() {
  return <ZodiacPageContent signData={zodiacFullData.vodoley} slug="vodoley" />
}