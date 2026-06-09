'use client' 
import ZodiacPageContent from '@/src/components/ZodiacPageContent'
import { zodiacFullData } from '@/src/lib/zodiacData'

export default function VesyPage() {
  return <ZodiacPageContent signData={zodiacFullData.vesy} slug="vesy" />
}