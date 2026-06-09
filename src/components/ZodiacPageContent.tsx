'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Star, ShoppingBag } from 'lucide-react'

// Компонент кнопки избранного
function FavoriteButton({ itemId }: { itemId: number }) {
  const { data: session } = useSession()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session && itemId) {
      fetch(`/api/user/favorites?clothingItemId=${itemId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const found = data.some((f: any) => f.clothing_item_id === itemId || f.clothingItemId === itemId)
            setIsFavorite(found)
          }
        })
        .catch(() => {})
    }
  }, [itemId, session])

  const toggleFavorite = async () => {
    if (!session) { window.location.href = '/auth/signin'; return }
    setLoading(true)
    try {
      if (isFavorite) {
        await fetch(`/api/user/favorites?clothingItemId=${itemId}`, { method: 'DELETE' })
        setIsFavorite(false)
      } else {
        await fetch('/api/user/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clothingItemId: itemId }),
        })
        setIsFavorite(true)
      }
    } catch (error) { console.error(error) }
    setLoading(false)
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite() }}
      disabled={loading}
      className={`p-2.5 rounded-full transition-all duration-300 ${
        isFavorite 
          ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/30' 
          : 'bg-black/40 text-white/70 hover:text-red-400 hover:bg-black/60 backdrop-blur-sm'
      }`}
    >
      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
    </button>
  )
}

// Компонент карточки одежды
function ClothingCard({ item, idx }: { item: any; idx: number }) {
  const [imgError, setImgError] = useState(false)
  
  const imageUrl = (!item.image_url || imgError) 
    ? 'https://via.placeholder.com/400x500?text=No+Image' 
    : item.image_url

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group bg-white/[0.03] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-black/30"
    >
      <div className="aspect-[3/4] bg-gradient-to-br from-white/[0.02] to-white/[0.05] relative overflow-hidden">
        <img
          src={imageUrl}
          alt={item.title || 'Одежда'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton itemId={item.id} />
        </div>
        
        {item.season && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-medium text-white/90 border border-white/10">
              {item.season === 'winter' && '❄️'}
              {item.season === 'spring' && '🌸'}
              {item.season === 'summer' && '☀️'}
              {item.season === 'autumn' && '🍂'}
            </span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-medium text-white/90 border border-white/10">
            {item.gender === 'female' ? '👩' : item.gender === 'male' ? '👨' : '👥'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold text-sm truncate group-hover:text-pink-400 transition-colors duration-300">
          {item.title || 'Без названия'}
        </h3>
        {item.description && (
          <p className="text-white/40 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  )
}

// Основной компонент страницы знака
interface ZodiacPageContentProps {
  signData: {
    name: string
    symbol: string
    element: string
    planet: string
    dates: string
    bgGradient: string
    accentColor: string
    heroImage: string
    title: string
    description: string
    styleDesc: string
    styleKeywords: string[]
    colors: string[]
    colorNames: string[]
    hobbies: string[]
    facts: string[]
    elementIcon: any
    vibe: string
  }
  slug: string
}

export default function ZodiacPageContent({ signData, slug }: ZodiacPageContentProps) {
  const [selectedGender, setSelectedGender] = useState('all')
  const [selectedSeason, setSelectedSeason] = useState('all')
  const [clothingItems, setClothingItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/zodiac/items?zodiacSlug=${slug}`)
      .then(res => res.json())
      .then(data => setClothingItems(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const ElementIcon = signData.elementIcon
  const filteredItems = clothingItems.filter(item => {
    if (selectedGender !== 'all' && item.gender !== selectedGender && item.gender !== 'unisex') return false
    if (selectedSeason !== 'all' && item.season !== selectedSeason) return false
    return true
  })

  return (
    <div className={`min-h-screen bg-gradient-to-b ${signData.bgGradient}`}>
      <div className="relative h-[450px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-20">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1 }}
            className="text-7xl md:text-8xl mb-4 drop-shadow-2xl"
          >
            {signData.heroImage}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-3 tracking-wider"
            style={{ textShadow: `0 0 40px ${signData.accentColor}40` }}
          >
            {signData.name}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 text-white/70 text-sm md:text-base"
          >
            <ElementIcon className="w-4 h-4" style={{ color: signData.accentColor }} />
            <span>{signData.element} • {signData.planet} • {signData.dates}</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/70 text-base md:text-lg max-w-xl mx-auto mt-5 leading-relaxed"
          >
            {signData.description}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-10 border border-white/[0.08]"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: signData.accentColor }}>
            {signData.title}
          </h2>
          <p className="text-white/70 text-base leading-relaxed">{signData.styleDesc}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {signData.styleKeywords.map((keyword: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:scale-105"
                style={{ backgroundColor: `${signData.accentColor}15`, color: signData.accentColor, border: `1px solid ${signData.accentColor}30` }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h3 className="text-xl font-semibold text-center mb-6 text-white/90">
            Цветовая палитра {signData.name}
          </h3>
          <div className="flex flex-wrap justify-center gap-5">
            {signData.colors.map((color: string, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg cursor-pointer transition-shadow"
                  style={{ backgroundColor: color, boxShadow: `0 0 25px ${color}40` }}
                />
                <span className="text-white/50 text-xs">{signData.colorNames[idx]}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.08]"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4" style={{ color: signData.accentColor }} />
              Хобби и увлечения
            </h3>
            <div className="flex flex-wrap gap-2">
              {signData.hobbies.map((hobby: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/60 border border-white/10">
                  {hobby}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.08]"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Star className="w-4 h-4" style={{ color: signData.accentColor }} />
              Интересные факты
            </h3>
            <ul className="space-y-2">
              {signData.facts.map((fact: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                  <span style={{ color: signData.accentColor }}>✦</span> {fact}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-white">
            Гардероб {signData.name}
          </h2>
          <p className="text-center text-white/40 text-sm mb-8">
            Выбирайте идеальные образы по сезону и стилю
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className="flex gap-1.5 bg-white/5 rounded-full p-1">
              {['all', 'female', 'male'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    selectedGender === gender
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {gender === 'all' ? 'Все' : gender === 'female' ? ' Женский' : ' Мужской'}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 bg-white/5 rounded-full p-1">
              {['all', 'summer', 'autumn', 'winter', 'spring'].map((season) => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${
                    selectedSeason === season
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {season === 'all' && 'Все'}
                  {season === 'summer' && '☀️'}
                  {season === 'autumn' && '🍂'}
                  {season === 'winter' && '❄️'}
                  {season === 'spring' && '🌸'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-white/80" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
              <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">Нет товаров для выбранных фильтров</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {filteredItems.map((item, idx) => (
                <ClothingCard key={item.id} item={item} idx={idx} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <footer className="text-center py-8 mt-16 border-t border-white/[0.05]">
        <p className="text-white/25 text-xs">© 2026 StellarFit. Пусть звёзды ведут тебя</p>
      </footer>
    </div>
  )
}