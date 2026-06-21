'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, Sparkles, Star, ShoppingBag,
  Moon, Sun, Cloud, Droplets, Crown,
  Shield, Wind, Leaf, Palette, Zap, Eye,
  Calendar, Activity, Gem, TrendingUp,
  ChevronLeft, ChevronRight, Quote
} from 'lucide-react'

// ===== КОМПОНЕНТ КНОПКИ ИЗБРАННОГО =====
function FavoriteButton({ itemId }: { itemId: number }) {
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
      const res = await fetch('/api/user/favorites')
      const data = await res.json()
      if (Array.isArray(data)) {
        const found = data.some((f: any) => f.clothing_item_id === itemId)
        setIsFavorite(found)
      }
    } catch (error) {
      console.error('Error checking favorite:', error)
    }
  }

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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
      className={`p-2.5 rounded-full transition-all duration-300 ${
        isFavorite
          ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/30'
          : 'bg-black/40 text-white/60 hover:text-red-400 hover:bg-black/60 backdrop-blur-sm'
      }`}
    >
      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
    </button>
  )
}

// ===== КОМПОНЕНТ КАРТОЧКИ ОДЕЖДЫ (ТОЛЬКО ОДИН РАЗ!) =====
function ClothingCard({ item, idx }: { item: any; idx: number }) {
  const [imgError, setImgError] = useState(false)

  const imageUrl = (!item.image_url || imgError)
    ? 'https://via.placeholder.com/400x500?text=No+Image'
    : item.image_url

  const getSeasonIcon = (season: string) => {
    switch(season) {
      case 'winter': return '❄️'
      case 'spring': return '🌸'
      case 'summer': return '☀️'
      case 'autumn': return '🍂'
      default: return '👕'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-pink-500/30 transition-all duration-300"
    >
      <div className="aspect-square bg-gradient-to-br from-white/5 to-white/10 relative">
        <img
          src={imageUrl}
          alt={item.title || 'Одежда'}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {/* ===== СЕРДЕЧКО ===== */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton itemId={item.id} />
        </div>

        {/* Сезон */}
        {item.season && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white/80">
            {getSeasonIcon(item.season)}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-white font-medium text-sm truncate">
          {item.title || 'Без названия'}
        </h3>
        <p className="text-white/40 text-xs mt-1">
          {item.gender === 'female' ? '👩 Женский' : 
           item.gender === 'male' ? '👨 Мужской' : '👥 Унисекс'}
        </p>
      </div>
    </motion.div>
  )
}

// ===== ДАННЫЕ ДЛЯ ГОРОСКОПА =====
const getDailyHoroscope = (signName: string) => {
  const horoscopes: Record<string, string> = {
    'Овен': 'Сегодня отличный день для новых начинаний! Ваша энергия на пике.',
    'Телец': 'День благоприятен для финансовых решений. Доверьтесь интуиции.',
    'Близнецы': 'Ожидайте приятных новостей. Общение принесет радость.',
    'Рак': 'Время для заботы о себе. Уделите внимание домашнему уюту.',
    'Лев': 'Ваша харизма сегодня особенно сильна. Будьте в центре внимания!',
    'Дева': 'Идеальный день для планирования. Систематизируйте дела.',
    'Весы': 'Гармония во всем. Отличное время для творчества.',
    'Скорпион': 'Ваша страсть поможет достичь целей. Действуйте решительно!',
    'Стрелец': 'Приключения ждут вас! Не бойтесь новых впечатлений.',
    'Козерог': 'Ваша дисциплина принесет плоды. Продолжайте в том же духе.',
    'Водолей': 'Нестандартные идеи приведут к успеху. Будьте оригинальны!',
    'Рыбы': 'Доверьтесь своей интуиции. Она вас не подведет.'
  }
  return horoscopes[signName] || 'Сегодня звезды благосклонны к вам!'
}

// ===== КОМПЛИМЕНТ ДНЯ =====
const getDailyCompliment = (signName: string) => {
  const compliments: Record<string, string> = {
    'Овен': 'Ваша смелость вдохновляет окружающих!',
    'Телец': 'Ваша надежность — опора для многих.',
    'Близнецы': 'Ваша способность к общению — настоящий дар!',
    'Рак': 'Ваша забота делает мир теплее.',
    'Лев': 'Ваша щедрость и теплота притягивают людей.',
    'Дева': 'Ваше внимание к деталям бесценно!',
    'Весы': 'Ваше чувство прекрасного создает гармонию вокруг.',
    'Скорпион': 'Ваша страстность и глубина впечатляют.',
    'Стрелец': 'Ваш оптимизм заразителен!',
    'Козерог': 'Ваша целеустремленность достойна восхищения.',
    'Водолей': 'Ваше нестандартное мышление меняет мир.',
    'Рыбы': 'Ваша эмпатия и творчество уникальны.'
  }
  return compliments[signName] || 'Вы прекрасны! ✨'
}

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
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
  const [showHoroscope, setShowHoroscope] = useState(false)

  useEffect(() => {
    fetch(`/api/zodiac/items?zodiacSlug=${slug}`)
      .then(res => res.json())
      .then(data => {
        setClothingItems(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const ElementIcon = signData.elementIcon
  const dailyHoroscope = getDailyHoroscope(signData.name)
  const dailyCompliment = getDailyCompliment(signData.name)

  const filteredItems = clothingItems.filter(item => {
    if (selectedGender !== 'all' && item.gender !== selectedGender && item.gender !== 'unisex') return false
    if (selectedSeason !== 'all' && item.season !== selectedSeason) return false
    return true
  })

  return (
    <div className={`min-h-screen bg-gradient-to-b ${signData.bgGradient}`}>
      {/* Герой-секция */}
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
            className="flex items-center gap-2 text-white/70 text-sm md:text-base flex-wrap justify-center"
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

          {/* Гороскоп дня */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6"
          >
            <button
              onClick={() => setShowHoroscope(!showHoroscope)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{ backgroundColor: `${signData.accentColor}20`, color: signData.accentColor, border: `1px solid ${signData.accentColor}40` }}
            >
              {showHoroscope ? 'Скрыть гороскоп' : '✨ Гороскоп на сегодня ✨'}
            </button>
          </motion.div>

          <AnimatePresence>
            {showHoroscope && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 p-4 rounded-xl max-w-md mx-auto"
                style={{ backgroundColor: `${signData.accentColor}10`, border: `1px solid ${signData.accentColor}30` }}
              >
                <Quote className="w-4 h-4 mx-auto mb-2" style={{ color: signData.accentColor }} />
                <p className="text-white/80 text-sm">{dailyHoroscope}</p>
                <p className="text-white/50 text-xs mt-2 italic">{dailyCompliment}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Стиль */}
        <div className="bg-white/5 rounded-2xl p-6 md:p-8 mb-10 border border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: signData.accentColor }}>
            {signData.title}
          </h2>
          <p className="text-white/70 text-base leading-relaxed">{signData.styleDesc}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {signData.styleKeywords.map((keyword: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${signData.accentColor}15`, color: signData.accentColor, border: `1px solid ${signData.accentColor}30` }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Цветовая палитра */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-center mb-6 text-white/90">
            Цветовая палитра {signData.name}
          </h3>
          <div className="flex flex-wrap justify-center gap-5">
            {signData.colors.map((color: string, idx: number) => (
              <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => navigator.clipboard.writeText(color)}>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg" style={{ backgroundColor: color, boxShadow: `0 0 25px ${color}40` }} />
                <span className="text-white/50 text-xs">{signData.colorNames[idx]}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/30 text-xs mt-4">💡 Нажмите на цвет, чтобы скопировать код</p>
        </div>

        {/* Хобби и факты */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">✨ Хобби и увлечения</h3>
            <div className="flex flex-wrap gap-2">
              {signData.hobbies.map((hobby: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/60 border border-white/10">{hobby}</span>
              ))}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">⭐ Интересные факты</h3>
            <ul className="space-y-2">
              {signData.facts.map((fact: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                  <span style={{ color: signData.accentColor }}>✦</span> {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Гардероб с сердечками */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-white">
            Гардероб {signData.name}
          </h2>
          <p className="text-center text-white/40 text-sm mb-8">
            ❤️ Нажмите на сердечко, чтобы добавить в избранное
          </p>

          {/* Фильтры */}
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
                  {gender === 'all' ? 'Все' : gender === 'female' ? '👩 Женский' : '👨 Мужской'}
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

          {/* Товары с сердечками */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-white/80" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
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

        {/* Ссылка на все знаки */}
        <div className="text-center mt-12">
          <Link href="/zodiac" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
            <Star size={18} />
            Посмотреть все знаки зодиака
          </Link>
        </div>
      </div>

      <footer className="text-center py-8 mt-16 border-t border-white/10">
        <p className="text-white/30 text-xs">© 2026 StellarFit. Пусть звёзды ведут тебя ✨</p>
      </footer>
    </div>
  )
}