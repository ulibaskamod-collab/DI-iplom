'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

export function FavoriteButton({ itemId }: { itemId: number }) {
  const { data: session } = useSession()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session && itemId) {
      checkFavoriteStatus()
    }
  }, [itemId, session])

  const checkFavoriteStatus = async () => {
    try {
      const res = await fetch(`/api/user/favorites`)
      const data = await res.json()
      if (Array.isArray(data)) {
        const found = data.some((f: any) => f.clothing_item_id === itemId)
        setIsFavorite(found)
      }
    } catch (error) {
      console.error('Error checking favorite:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }

    setLoading(true)
    try {
      if (isFavorite) {
        const res = await fetch(`/api/user/favorites?clothingItemId=${itemId}`, { 
          method: 'DELETE' 
        })
        if (res.ok) {
          setIsFavorite(false)
        }
      } else {
        const res = await fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clothingItemId: itemId }),
        })
        if (res.ok) {
          setIsFavorite(true)
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-300 ${
        isFavorite 
          ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/30' 
          : 'bg-black/40 text-white/70 hover:text-red-400 hover:bg-black/60 backdrop-blur-sm'
      }`}
    >
      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
    </button>
  )
}