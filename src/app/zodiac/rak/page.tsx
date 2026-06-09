import ZodiacPageContent from '@/src/components/ZodiacPageContent'
import { zodiacFullData } from '@/src/lib/zodiacData'

export default function RakPage() {
  return <ZodiacPageContent signData={zodiacFullData.rak} slug="rak" />
}