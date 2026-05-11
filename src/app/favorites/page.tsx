'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, Trash2, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FavoriteItem {
  id: string
  user_id: string
  clothing_item_id: number
  title?: string
  description?: string
  image_url?: string
  season?: string
  gender?: string
  zodiac_sign_id?: number
}

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/favorites')
        .then(res => res.json())
        .then(data => {
          console.log('Favorites:', data)
          if (Array.isArray(data)) {
            const normalized = data.map((item: any) => ({
              id: item.id,
              user_id: item.user_id,
              clothing_item_id: item.clothing_item_id || item.clothingItemId,
              title: item.title || item.clothingItem?.title || `Товар #${item.clothing_item_id || item.clothingItemId}`,
              description: item.description || item.clothingItem?.description || '',
              image_url: item.image_url || item.clothingItem?.image_url || '',
              season: item.season || item.clothingItem?.season || '',
              gender: item.gender || item.clothingItem?.gender || '',
              zodiac_sign_id: item.zodiac_sign_id || item.clothingItem?.zodiac_sign_id,
            }))
            setFavorites(normalized)
          } else {
            setFavorites([])
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [session])

  const removeFavorite = async (itemId: number) => {
    try {
      const res = await fetch(`/api/user/favorites?clothingItemId=${itemId}`, { 
        method: 'DELETE' 
      })
      if (res.ok) {
        setFavorites(prev => prev.filter(f => f.clothing_item_id !== itemId))
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-pink-500/30 border-t-pink-500 mx-auto mb-4" />
          <p className="text-white/50 text-sm">Загружаем избранное...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d25] to-[#0a0a1a]">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 mb-6"
          >
            <Heart className="w-10 h-10 text-pink-400" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Избранное
            </span>
          </h1>
          <p className="text-white/40 text-sm md:text-base">
            {favorites.length > 0 
              ? `У вас ${favorites.length} ${getNumEnding(favorites.length, 'избранный', 'избранных', 'избранных')} ${getNumEnding(favorites.length, 'товар', 'товара', 'товаров')}`
              : 'Добавляйте понравившиеся образы, нажимая на сердечко ❤️'
            }
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Heart className="w-12 h-12 text-white/20" />
            </div>
            <p className="text-xl text-white/40 mb-2">У вас пока нет избранных товаров</p>
            <p className="text-white/25 text-sm mb-8">Нажмите на сердечко на карточке товара, чтобы добавить его сюда</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-pink-500/25"
            >
              <Sparkles size={18} />
  На главную
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="mb-8">
              <Link
                href="/zodiac"
                className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm"
              >
                <ArrowLeft size={16} />
                Продолжить просмотр
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
              <AnimatePresence>
                {favorites.map((fav, idx) => (
                  <motion.div
                    key={fav.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    transition={{ delay: idx * 0.05 }}
                    layout
                    className="group bg-white/[0.03] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/[0.08] hover:border-pink-500/30 transition-all duration-300"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-white/[0.02] to-white/[0.05] relative overflow-hidden">
                      {fav.image_url ? (
                        <img
                          src={fav.image_url}
                          alt={fav.title || 'Одежда'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget
                            target.style.display = 'none'
                          }}
                        />
                      ) : null}
                      
                      {!fav.image_url && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                          <ShoppingBag className="w-10 h-10 text-white/20 mb-1" />
                          <span className="text-white/20 text-xs">Нет фото</span>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

                      <button
                        onClick={() => removeFavorite(fav.clothing_item_id)}
                        className="absolute top-3 right-3 p-2.5 bg-red-500/80 hover:bg-red-500 rounded-full transition-all opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 backdrop-blur-sm shadow-lg"
                        title="Удалить из избранного"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>

                      <div className="absolute bottom-3 left-3 flex gap-1.5">
                        {fav.season && (
                          <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-medium text-white/80 border border-white/10">
                            {fav.season === 'winter' && '❄️'}
                            {fav.season === 'spring' && '🌸'}
                            {fav.season === 'summer' && '☀️'}
                            {fav.season === 'autumn' && '🍂'}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-medium text-white/80 border border-white/10">
                          {fav.gender === 'female' ? '👩' : fav.gender === 'male' ? '👨' : '👥'}
                        </span>
                      </div>

                      {/* Сердечко (уже в избранном) */}
                      <div className="absolute top-3 left-3">
                        <span className="p-1.5 bg-red-500/90 rounded-full backdrop-blur-sm">
                          <Heart className="w-3.5 h-3.5 text-white fill-white" />
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5">
                      <h3 className="text-white font-medium text-sm truncate group-hover:text-pink-400 transition-colors">
                        {fav.title || `Товар #${fav.clothing_item_id}`}
                      </h3>
                      {fav.description && (
                        <p className="text-white/35 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {fav.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-white/5">
                        <span className="text-white/25 text-[10px]">ID: {fav.clothing_item_id}</span>
                        <button
                          onClick={() => removeFavorite(fav.clothing_item_id)}
                          className="ml-auto text-white/30 hover:text-red-400 text-xs transition-colors"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function getNumEnding(num: number, one: string, two: string, five: string): string {
  const n = Math.abs(num) % 100
  if (n >= 11 && n <= 19) return five
  const lastDigit = n % 10
  if (lastDigit === 1) return one
  if (lastDigit >= 2 && lastDigit <= 4) return two
  return five
}