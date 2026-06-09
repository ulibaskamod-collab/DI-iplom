'use client' 
import ZodiacPageContent from '@/src/components/ZodiacPageContent'
import { zodiacFullData } from '@/src/lib/zodiacData'

export default function BliznetsyPage() {
  return <ZodiacPageContent signData={zodiacFullData.bliznetsy} slug="bliznetsy" />
}