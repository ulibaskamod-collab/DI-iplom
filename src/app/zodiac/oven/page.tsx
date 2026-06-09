import ZodiacPageContent from '@/src/components/ZodiacPageContent'
import { zodiacFullData } from '@/src/lib/zodiacData'

export default function OvenPage() {
  return <ZodiacPageContent signData={zodiacFullData.oven} slug="oven" />
}