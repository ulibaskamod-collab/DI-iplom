import useSWR, { mutate } from 'swr'
import { useSession } from 'next-auth/react'
import { fetcher } from '../fetcher'

interface Favorite {
  id: number
  clothingItemId: number
  clothingItem?: any
}

export function useFavorites() {
  const { data: session } = useSession()
  const { data, error, isLoading } = useSWR<Favorite[]>(
    session ? '/api/user/favorites' : null,
    fetcher
  )

  const addFavorite = async (itemId: number) => {
    try {
      mutate('/api/user/favorites', (current: Favorite[] = []) => 
        [...current, { id: Date.now(), clothingItemId: itemId }], false
      )
      await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })
      mutate('/api/user/favorites')
    } catch (error) {
      mutate('/api/user/favorites')
    }
  }

  const removeFavorite = async (itemId: number) => {
    try {
      mutate('/api/user/favorites', (current: Favorite[] = []) => 
        current.filter((item) => item.clothingItemId !== itemId), false
      )
      await fetch(`/api/user/favorites?itemId=${itemId}`, { method: 'DELETE' })
      mutate('/api/user/favorites')
    } catch (error) {
      mutate('/api/user/favorites')
    }
  }

  const isFavorite = (itemId: number): boolean => {
    return data?.some((item) => item.clothingItemId === itemId) || false
  }

  return {
    favorites: data || [],
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
}