'use client'

import { useState } from 'react'
import { useFavorites } from '../lib/hooks/useFavorites'

export default function FavoriteButton({ itemId }: { itemId: number }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const [isAnimating, setIsAnimating] = useState(false)
  const favorited = isFavorite(itemId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    if (favorited) {
      await removeFavorite(itemId)
    } else {
      await addFavorite(itemId)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-200 ${
        favorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
      } ${isAnimating ? 'scale-125' : 'scale-100'}`}
    >
      <svg className="w-5 h-5" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  )
}