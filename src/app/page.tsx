'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Star, ArrowRight } from 'lucide-react'

// Данные о знаках для отображения на главной
const zodiacData: Record<string, any> = {
  oven: {
    name: 'Овен',
    symbol: '♈',
    element: 'Огонь',
    description: 'Смелый, энергичный, первопроходец',
    accentColor: '#FF4500',
    heroImage: '🔥'
  },
  telec: {
    name: 'Телец',
    symbol: '♉',
    element: 'Земля',
    description: 'Надёжный, чувственный, терпеливый',
    accentColor: '#2ECC71',
    heroImage: '🌿'
  },
  bliznetsy: {
    name: 'Близнецы',
    symbol: '♊',
    element: 'Воздух',
    description: 'Общительный, любознательный, адаптивный',
    accentColor: '#FFD700',
    heroImage: '🌀'
  },
  rak: {
    name: 'Рак',
    symbol: '♋',
    element: 'Вода',
    description: 'Заботливый, интуитивный, эмоциональный',
    accentColor: '#6C5CE7',
    heroImage: '🌙'
  },
  lev: {
    name: 'Лев',
    symbol: '♌',
    element: 'Огонь',
    description: 'Щедрый, творческий, уверенный',
    accentColor: '#FFA500',
    heroImage: '👑'
  },
  deva: {
    name: 'Дева',
    symbol: '♍',
    element: 'Земля',
    description: 'Аналитичный, практичный, внимательный',
    accentColor: '#95A5A6',
    heroImage: '🍃'
  },
  vesy: {
    name: 'Весы',
    symbol: '♎',
    element: 'Воздух',
    description: 'Дипломатичный, гармоничный, справедливый',
    accentColor: '#FFB6C1',
    heroImage: '🌸'
  },
  skorpion: {
    name: 'Скорпион',
    symbol: '♏',
    element: 'Вода',
    description: 'Страстный, загадочный, решительный',
    accentColor: '#FF6B6B',
    heroImage: '🦂'
  },
  strelets: {
    name: 'Стрелец',
    symbol: '♐',
    element: 'Огонь',
    description: 'Оптимистичный, свободолюбивый, философский',
    accentColor: '#8A2BE2',
    heroImage: '🏹'
  },
  kozerog: {
    name: 'Козерог',
    symbol: '♑',
    element: 'Земля',
    description: 'Дисциплинированный, амбициозный, ответственный',
    accentColor: '#708090',
    heroImage: '🏔️'
  },
  vodoley: {
    name: 'Водолей',
    symbol: '♒',
    element: 'Воздух',
    description: 'Инновационный, независимый, гуманистичный',
    accentColor: '#00FFFF',
    heroImage: '💧'
  },
  ryby: {
    name: 'Рыбы',
    symbol: '♓',
    element: 'Вода',
    description: 'Интуитивный, творческий, сострадательный',
    accentColor: '#48D1CC',
    heroImage: '🐟'
  }
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userZodiac, setUserZodiac] = useState<{ zodiac_sign: string | null, slug: string | null }>({
    zodiac_sign: null,
    slug: null
  })
  const [loading, setLoading] = useState(true)

  // Получаем знак пользователя
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetch('/api/user/zodiac')
        .then(res => res.json())
        .then(data => {
          setUserZodiac({
            zodiac_sign: data.zodiac_sign,
            slug: data.slug
          })
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [session, status])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  // Если пользователь не авторизован - показываем приветственную страницу
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Sparkles className="w-20 h-20 text-pink-400 mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              StellarFit
            </h1>
            <p className="text-purple-300 text-xl max-w-2xl mx-auto">
              Открой свой идеальный стиль с помощью звёзд
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <Link href="/auth/signin" className="px-6 py-3 bg-pink-500 rounded-full text-white font-semibold hover:bg-pink-600 transition">
                Войти
              </Link>
              <Link href="/auth/register" className="px-6 py-3 bg-white/10 rounded-full text-white font-semibold hover:bg-white/20 transition">
                Регистрация
              </Link>
            </div>
          </div>

          {/* Превью знаков */}
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold text-white mb-8">12 знаков зодиака</h2>
            <Link href="/zodiac" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300">
              Смотреть все знаки <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Если пользователь авторизован, но знак не найден
  if (!userZodiac.slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center">
          <p className="text-white mb-4">Не удалось определить ваш знак зодиака</p>
          <Link href="/profile" className="text-pink-400 hover:text-pink-300">
            Заполните дату рождения в профиле
          </Link>
        </div>
      </div>
    )
  }

  const sign = zodiacData[userZodiac.slug]
  
  if (!sign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center">
          <p className="text-white">Знак не найден</p>
          <Link href="/zodiac" className="text-pink-400 hover:text-pink-300">
            Перейти к списку знаков
          </Link>
        </div>
      </div>
    )
  }

  // Показываем страницу знака пользователя
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-20">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 1 }}
            className="text-7xl md:text-8xl mb-4 drop-shadow-2xl"
          >
            {sign.heroImage}
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-3"
            style={{ textShadow: `0 0 40px ${sign.accentColor}40` }}
          >
            {sign.name}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 text-white/70 text-sm md:text-base"
          >
            <span>{sign.symbol} • {sign.element}</span>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/70 text-base md:text-lg max-w-xl mx-auto mt-5"
          >
            {sign.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Link
              href={`/zodiac/${userZodiac.slug}`}
              className="px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 inline-flex items-center gap-2"
              style={{ backgroundColor: sign.accentColor, color: '#000' }}
            >
              Перейти к стилю {sign.name} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <Link
            href="/zodiac"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
          >
            <Star size={18} />
            Смотреть все знаки зодиака
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <footer className="text-center py-8 mt-16 border-t border-white/10">
        <p className="text-white/30 text-xs">© 2026 StellarFit. Пусть звёзды ведут тебя ✨</p>
      </footer>
    </div>
  )
}