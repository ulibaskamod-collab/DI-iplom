'use client'

export const dynamic = 'force-dynamic'

import ZodiacPageContent from '@/src/components/ZodiacPageContent'
import { zodiacFullData } from '@/src/lib/zodiacData'

export default function ZodiacPage() {
  return <ZodiacPageContent signData={zodiacFullData.rak} slug="rak" />
}