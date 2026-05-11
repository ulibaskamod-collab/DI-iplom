import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      birthDate?: string
      gender?: string
      zodiacSign?: string
    }
  }

  interface User {
    id: string
    birthDate?: string
    gender?: string
    zodiacSign?: string
  }
}

export interface ZodiacSign {
  id: number
  name: string
  slug: string
  element: 'fire' | 'earth' | 'air' | 'water'
  startDate: string
  endDate: string
  description: string
  styleDesc: string
  colors: string[]
  imageUrl: string | null
}

export interface ClothingItem {
  id: number
  title: string
  description: string
  imageUrl: string
  season: 'winter' | 'spring' | 'summer' | 'autumn'
  gender: 'male' | 'female' | 'unisex'
  zodiacSignId: number
  createdAt: Date
  zodiacSign?: ZodiacSign
}

export interface Designer {
  id: number
  name: string
  bio: string
  imageUrl: string
  socialLinks: {
    instagram?: string
    website?: string
    behance?: string
  }
  createdAt: Date
}

export interface Favorite {
  id: number
  userId: number
  clothingItemId: number
  clothingItem: ClothingItem
}