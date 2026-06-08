'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

// Данные о знаках (копия из zodiac/[slug]/page.tsx)
const zodiacFullData: Record<string, any> = {
  oven: {
    name: 'Овен', symbol: '♈', element: 'Огонь', planet: 'Марс',
    dates: '21 марта – 19 апреля', accentColor: '#FF4500', heroImage: '🔥',
    title: 'Стиль Овна: Смелость и Спорт-ШИК',
    description: 'Пионер, воин, первооткрыватель. Овен — первый знак зодиака, заряженный динамикой, мужеством и страстью.',
  },
  telec: {
    name: 'Телец', symbol: '♉', element: 'Земля', planet: 'Венера',
    dates: '20 апреля – 20 мая', accentColor: '#2ECC71', heroImage: '🌿',
    title: 'Стиль Тельца: Природная элегантность',
    description: 'Чувственность, стойкость, любовь к роскоши. Телец — знак земной силы и красоты.',
  },
  bliznetsy: {
    name: 'Близнецы', symbol: '♊', element: 'Воздух', planet: 'Меркурий',
    dates: '21 мая – 20 июня', accentColor: '#FFD700', heroImage: '🌀',
    title: 'Стиль Близнецов: Эклектика и игра',
    description: 'Двойственность, коммуникабельность, жажда перемен. Близнецы — самый любознательный знак.',
  },
  rak: {
    name: 'Рак', symbol: '♋', element: 'Вода', planet: 'Луна',
    dates: '21 июня – 22 июля', accentColor: '#6C5CE7', heroImage: '🌙',
    title: 'Стиль Рака: Лунная женственность',
    description: 'Эмпатия, глубина чувств, любовь к дому. Рак — самый заботливый и интуитивный знак.',
  },
  lev: {
    name: 'Лев', symbol: '♌', element: 'Огонь', planet: 'Солнце',
    dates: '23 июля – 22 августа', accentColor: '#FFD700', heroImage: '👑',
    title: 'Стиль Льва: Старый Голливуд',
    description: 'Величественный, страстный, королевский знак. Солнце правит Львом, даря магнетизм и любовь к роскоши.',
  },
  deva: {
    name: 'Дева', symbol: '♍', element: 'Земля', planet: 'Меркурий',
    dates: '23 августа – 22 сентября', accentColor: '#95A5A6', heroImage: '🍃',
    title: 'Стиль Девы: Элегантный минимализм',
    description: 'Элегантность, аналитический ум, безупречный вкус. Дева — знак чистоты и порядка.',
  },
  vesy: {
    name: 'Весы', symbol: '♎', element: 'Воздух', planet: 'Венера',
    dates: '23 сентября – 22 октября', accentColor: '#FFB6C1', heroImage: '🌸',
    title: 'Стиль Весов: Утончённая элегантность',
    description: 'Гармония, дипломатичность, утончённость. Весы — знак равновесия и эстетики.',
  },
  skorpion: {
    name: 'Скорпион', symbol: '♏', element: 'Вода', planet: 'Плутон',
    dates: '23 октября – 21 ноября', accentColor: '#FF6B6B', heroImage: '🦂',
    title: 'Стиль Скорпиона: Тёмная элегантность',
    description: 'Страсть, магнетизм, трансформация. Скорпион — самый загадочный и сильный знак.',
  },
  strelets: {
    name: 'Стрелец', symbol: '♐', element: 'Огонь', planet: 'Юпитер',
    dates: '22 ноября – 21 декабря', accentColor: '#8A2BE2', heroImage: '🏹',
    title: 'Стиль Стрельца: Бохо-шик',
    description: 'Искатель приключений, философ, огненный странник. Стрелец — знак свободы и оптимизма.',
  },
  kozerog: {
    name: 'Козерог', symbol: '♑', element: 'Земля', planet: 'Сатурн',
    dates: '22 декабря – 19 января', accentColor: '#708090', heroImage: '🏔️',
    title: 'Стиль Козерога: Классика и статус',
    description: 'Дисциплина, амбиции, безупречный вкус. Козерог — знак горных вершин, символ власти.',
  },
  vodoley: {
    name: 'Водолей', symbol: '♒', element: 'Воздух', planet: 'Уран',
    dates: '20 января – 18 февраля', accentColor: '#00FFFF', heroImage: '💧',
    title: 'Стиль Водолея: Авангард и футуризм',
    description: 'Инновации, свобода, авангард. Водолей — знак будущего и нестандартного мышления.',
  },
  ryby: {
    name: 'Рыбы', symbol: '♓', element: 'Вода', planet: 'Нептун',
    dates: '19 февраля – 20 марта', accentColor: '#48D1CC', heroImage: '🐟',
    title: 'Стиль Рыб: Морская феерия',
    description: 'Интуиция, глубинная эмпатия, творческий дар. Рыбы — последний знак зодиака.',
  },
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userZodiacSlug, setUserZodiacSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [clothingItems, setClothingItems] = useState<any[]>([])
  const [loadingItems, setLoadingItems] = useState(true)

  // Получаем знак пользователя
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetch('/api/user/zodiac')
        .then(res => res.json())
        .then(data => {
          setUserZodiacSlug(data.slug)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [session, status])

  // Загружаем товары для знака
  useEffect(() => {
    if (userZodiacSlug) {
      fetch(`/api/zodiac/items?zodiacSlug=${userZodiacSlug}`)
        .then(res => res.json())
        .then(data => setClothingItems(data))
        .catch(console.error)
        .finally(() => setLoadingItems(false))
    } else {
      setLoadingItems(false)
    }
  }, [userZodiacSlug])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  // Если пользователь не авторизован - показываем приветствие и каталог
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

          {/* Показываем каталог знаков для незалогиненных */}
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

  // Если знак не найден
  if (!userZodiacSlug) {
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

  const sign = zodiacFullData[userZodiacSlug]
  
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

  // 🔥 ПОЛНАЯ СТРАНИЦА ЗНАКА (как на /zodiac/lev)
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-20">
          <div className="text-7xl md:text-8xl mb-4 drop-shadow-2xl">
            {sign.heroImage}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-3" style={{ textShadow: `0 0 40px ${sign.accentColor}40` }}>
            {sign.name}
          </h1>
          <div className="flex items-center gap-2 text-white/70 text-sm md:text-base">
            <span>{sign.element} • {sign.planet} • {sign.dates}</span>
          </div>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto mt-5">
            {sign.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Стиль */}
        <div className="bg-white/5 rounded-2xl p-6 md:p-8 mb-10 border border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: sign.accentColor }}>
            {sign.title}
          </h2>
          <p className="text-white/70 text-base leading-relaxed">
            Люкс-бренды, золото, леопардовый принт, бархат, пайетки. Драгоценные ткани и броские аксессуары.
          </p>
        </div>

        {/* Товары */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Гардероб {sign.name}</h2>
          
          {loadingItems ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white" />
            </div>
          ) : clothingItems.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <p>Товары для этого знака скоро появятся</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {clothingItems.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition">
                  <div className="aspect-square bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl opacity-30">👕</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">{item.title || 'Без названия'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}