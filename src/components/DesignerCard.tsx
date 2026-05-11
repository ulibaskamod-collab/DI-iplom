'use client'

import Link from 'next/link'

interface DesignerCardProps {
  designer: {
    id: number
    name: string
    bio: string
    imageUrl: string
    socialLinks?: {
      instagram?: string
      website?: string
    }
  }
}

export default function DesignerCard({ designer }: DesignerCardProps) {
  const shortBio = designer.bio.length > 120 ? designer.bio.slice(0, 120) + '...' : designer.bio

  return (
    <Link href={`/designers/${designer.id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
        <div className="aspect-square bg-gray-100">
          <img src={designer.imageUrl} alt={designer.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{designer.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-3">{shortBio}</p>
        </div>
      </div>
    </Link>
  )
}