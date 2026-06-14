'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Star, ShoppingBag } from 'lucide-react'
import HomePageAllSigns from './(home)/page'

// Полные данные для всех знаков
const zodiacFullData: Record<string, any> = {
  oven: {
    name: 'Овен', symbol: '♈', element: 'Огонь', planet: 'Марс',
    dates: '21 марта – 19 апреля', accentColor: '#FF4500', heroImage: '🔥',
    title: 'Стиль Овна: Смелость и Спорт-ШИК',
    description: 'Пионер, воин, первооткрыватель. Овен — первый знак зодиака, заряженный динамикой, мужеством и страстью.',
    styleDesc: 'Авангард, динамика, функциональность. Кожа, металлические детали, яркие акценты.',
    styleKeywords: ['Смелость', 'Динамика', 'Функциональность', 'Огонь'],
    colors: ['#FF0000', '#FF4500', '#8B0000', '#1A1A1A', '#C0C0C0'],
    colorNames: ['Красный огонь', 'Мандарин', 'Кармин', 'Графит', 'Серебро'],
    bgGradient: 'from-red-900/40 via-orange-900/30 to-black'
  },
  telec: {
    name: 'Телец', symbol: '♉', element: 'Земля', planet: 'Венера',
    dates: '20 апреля – 20 мая', accentColor: '#2ECC71', heroImage: '🌿',
    title: 'Стиль Тельца: Природная элегантность',
    description: 'Чувственность, стойкость, любовь к роскоши. Телец — знак земной силы и красоты.',
    styleDesc: 'Натуральные ткани, мягкие силуэты, теплые земляные оттенки.',
    styleKeywords: ['Роскошь', 'Комфорт', 'Элегантность', 'Натуральность'],
    colors: ['#8B7355', '#D2B48C', '#556B2F', '#FFB6C1', '#F5DEB3'],
    colorNames: ['Коричневый', 'Бежевый', 'Оливковый', 'Пудровый', 'Кремовый'],
    bgGradient: 'from-emerald-900/40 via-green-900/30 to-black'
  },
  bliznetsy: {
    name: 'Близнецы', symbol: '♊', element: 'Воздух', planet: 'Меркурий',
    dates: '21 мая – 20 июня', accentColor: '#FFD700', heroImage: '🌀',
    title: 'Стиль Близнецов: Эклектика и игра',
    description: 'Двойственность, коммуникабельность, жажда перемен.',
    styleDesc: 'Смешение фактур и направлений: спорт-шик с бохо.',
    styleKeywords: ['Эклектика', 'Многослойность', 'Игривость', 'Свобода'],
    colors: ['#FFD700', '#87CEEB', '#32CD32', '#FFA500', '#9370DB'],
    colorNames: ['Золотой', 'Голубой', 'Лайм', 'Оранжевый', 'Пурпурный'],
    bgGradient: 'from-yellow-900/40 via-amber-900/30 to-black'
  },
  rak: {
    name: 'Рак', symbol: '♋', element: 'Вода', planet: 'Луна',
    dates: '21 июня – 22 июля', accentColor: '#6C5CE7', heroImage: '🌙',
    title: 'Стиль Рака: Лунная женственность',
    description: 'Эмпатия, глубина чувств, любовь к дому.',
    styleDesc: 'Мягкие драпировки, струящиеся ткани, пастельные оттенки.',
    styleKeywords: ['Нежность', 'Уют', 'Романтика', 'Защита'],
    colors: ['#FFFFFF', '#C0C0C0', '#F0F8FF', '#E6E6FA', '#48D1CC'],
    colorNames: ['Белый', 'Серебряный', 'Небесный', 'Лавандовый', 'Бирюзовый'],
    bgGradient: 'from-blue-900/40 via-cyan-900/30 to-black'
  },
  lev: {
    name: 'Лев', symbol: '♌', element: 'Огонь', planet: 'Солнце',
    dates: '23 июля – 22 августа', accentColor: '#FFD700', heroImage: '👑',
    title: 'Стиль Льва: Старый Голливуд',
    description: 'Величественный, страстный, королевский знак.',
    styleDesc: 'Люкс-бренды, золото, леопардовый принт, бархат.',
    styleKeywords: ['Роскошь', 'Власть', 'Гламур', 'Царственность'],
    colors: ['#FFD700', '#8B008B', '#FF4500', '#1A1A1A', '#DAA520', '#800020'],
    colorNames: ['Золотой', 'Пурпурный', 'Оранжевый', 'Чёрный', 'Шампань', 'Бургунди'],
    bgGradient: 'from-amber-900/40 via-yellow-900/30 to-black'
  },
  deva: {
    name: 'Дева', symbol: '♍', element: 'Земля', planet: 'Меркурий',
    dates: '23 августа – 22 сентября', accentColor: '#95A5A6', heroImage: '🍃',
    title: 'Стиль Девы: Элегантный минимализм',
    description: 'Элегантность, аналитический ум, безупречный вкус.',
    styleDesc: 'Лаконичные силуэты, натуральные ткани, нейтральные оттенки.',
    styleKeywords: ['Минимализм', 'Чистота', 'Практичность', 'Совершенство'],
    colors: ['#FFFFFF', '#808080', '#D3D3D3', '#F5F5DC', '#6B8E23'],
    colorNames: ['Белый', 'Серый', 'Светло-серый', 'Бежевый', 'Оливковый'],
    bgGradient: 'from-gray-900/40 via-stone-900/30 to-black'
  },
  vesy: {
    name: 'Весы', symbol: '♎', element: 'Воздух', planet: 'Венера',
    dates: '23 сентября – 22 октября', accentColor: '#FFB6C1', heroImage: '🌸',
    title: 'Стиль Весов: Утончённая элегантность',
    description: 'Гармония, дипломатичность, утончённость.',
    styleDesc: 'Мягкие силуэты, пастельные тона, изысканные ткани.',
    styleKeywords: ['Гармония', 'Эстетика', 'Женственность', 'Шик'],
    colors: ['#FFB6C1', '#87CEEB', '#DDA0DD', '#F5DEB3', '#FFF0F5'],
    colorNames: ['Розовый', 'Небесный', 'Лавандовый', 'Шампань', 'Жемчужный'],
    bgGradient: 'from-pink-900/40 via-rose-900/30 to-black'
  },
  skorpion: {
    name: 'Скорпион', symbol: '♏', element: 'Вода', planet: 'Плутон',
    dates: '23 октября – 21 ноября', accentColor: '#FF6B6B', heroImage: '🦂',
    title: 'Стиль Скорпиона: Тёмная элегантность',
    description: 'Страсть, магнетизм, трансформация.',
    styleDesc: 'Кожа, латекс, глубокий чёрный, винный и кроваво-красный.',
    styleKeywords: ['Таинственность', 'Страсть', 'Магнетизм', 'Сила'],
    colors: ['#FF6B6B', '#8B0000', '#4B0082', '#800080', '#2E8B57'],
    colorNames: ['Коралловый', 'Кровавый', 'Индиго', 'Фиолетовый', 'Изумрудный'],
    bgGradient: 'from-purple-900/40 via-purple-950/40 to-black'
  },
  strelets: {
    name: 'Стрелец', symbol: '♐', element: 'Огонь', planet: 'Юпитер',
    dates: '22 ноября – 21 декабря', accentColor: '#8A2BE2', heroImage: '🏹',
    title: 'Стиль Стрельца: Бохо-шик',
    description: 'Искатель приключений, философ, огненный странник.',
    styleDesc: 'Этнические мотивы, свободные силуэты, кожа, замша.',
    styleKeywords: ['Свобода', 'Приключения', 'Этника', 'Оптимизм'],
    colors: ['#800080', '#0000CD', '#FFA500', '#40E0D0', '#DDA0DD'],
    colorNames: ['Пурпурный', 'Синий', 'Оранжевый', 'Бирюзовый', 'Лиловый'],
    bgGradient: 'from-indigo-900/40 via-purple-900/30 to-black'
  },
  kozerog: {
    name: 'Козерог', symbol: '♑', element: 'Земля', planet: 'Сатурн',
    dates: '22 декабря – 19 января', accentColor: '#708090', heroImage: '🏔️',
    title: 'Стиль Козерога: Классика и статус',
    description: 'Дисциплина, амбиции, безупречный вкус.',
    styleDesc: 'Кашемир, твид, идеально скроенные костюмы.',
    styleKeywords: ['Власть', 'Классика', 'Статус', 'Элегантность'],
    colors: ['#1A1A1A', '#2F4F4F', '#696969', '#8B4513', '#F5F5DC'],
    colorNames: ['Чёрный', 'Тёмный', 'Серый', 'Коричневый', 'Бежевый'],
    bgGradient: 'from-slate-900/40 via-gray-900/30 to-black'
  },
  vodoley: {
    name: 'Водолей', symbol: '♒', element: 'Воздух', planet: 'Уран',
    dates: '20 января – 18 февраля', accentColor: '#00FFFF', heroImage: '💧',
    title: 'Стиль Водолея: Авангард и футуризм',
    description: 'Инновации, свобода, авангард.',
    styleDesc: 'Асимметрия, необычные фактуры, техно-аксессуары.',
    styleKeywords: ['Авангард', 'Футуризм', 'Технологичность', 'Свобода'],
    colors: ['#00FFFF', '#C0C0C0', '#0000FF', '#FF00FF', '#40E0D0'],
    colorNames: ['Бирюзовый', 'Серебряный', 'Синий', 'Неоновый', 'Мятный'],
    bgGradient: 'from-cyan-900/40 via-blue-900/30 to-black'
  },
  ryby: {
    name: 'Рыбы', symbol: '♓', element: 'Вода', planet: 'Нептун',
    dates: '19 февраля – 20 марта', accentColor: '#48D1CC', heroImage: '🐟',
    title: 'Стиль Рыб: Морская феерия',
    description: 'Интуиция, глубинная эмпатия, творческий дар.',
    styleDesc: 'Невесомые ткани, переливчатые оттенки, струящийся шифон.',
    styleKeywords: ['Романтика', 'Таинственность', 'Творчество', 'Мечтательность'],
    colors: ['#48D1CC', '#E0FFFF', '#D8BFD8', '#F0E68C', '#FFB6C1'],
    colorNames: ['Бирюзовый', 'Белый', 'Лавандовый', 'Шампань', 'Розовый'],
    bgGradient: 'from-teal-900/40 via-cyan-900/30 to-black'
  }
}

// Компонент страницы знака пользователя
function UserZodiacPage({ slug }: { slug: string }) {
  const sign = zodiacFullData[slug]
  const [clothingItems, setClothingItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sign) {
      fetch(`/api/zodiac/items?zodiacSlug=${slug}`)
        .then(res => res.json())
        .then(data => setClothingItems(data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [slug, sign])

  if (!sign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Знак не найден</h1>
          <Link href="/zodiac" className="text-pink-400 hover:text-pink-300">← Перейти ко всем знакам</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${sign.bgGradient}`}>
      <div className="relative h-[450px] md:h-[500px] overflow-hidden">
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
            <span>{sign.element} • {sign.planet} • {sign.dates}</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/70 text-base md:text-lg max-w-xl mx-auto mt-5"
          >
            {sign.description}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-2xl p-6 md:p-8 mb-10 border border-white/10"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: sign.accentColor }}>
            {sign.title}
          </h2>
          <p className="text-white/70 text-base leading-relaxed">{sign.styleDesc}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {sign.styleKeywords.map((keyword: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${sign.accentColor}15`, color: sign.accentColor, border: `1px solid ${sign.accentColor}30` }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Гардероб {sign.name}</h2>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-white/80" />
            </div>
          ) : clothingItems.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">Товары для этого знака скоро появятся</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {clothingItems.map((item) => (
                <div key={item.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition">
                  <div className="aspect-square bg-gradient-to-br from-white/10 to-transparent relative">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-white/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">{item.title || 'Без названия'}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {item.gender === 'female' ? '👩 Женский' : item.gender === 'male' ? '👨 Мужской' : '👥 Унисекс'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

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

export default function Page() {
  const { data: session, status } = useSession()
  const [userZodiacSlug, setUserZodiacSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetch('/api/user/zodiac')
        .then(res => res.json())
        .then(data => {
          if (data.slug) setUserZodiacSlug(data.slug)
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

  if (status === 'unauthenticated') {
    return <HomePageAllSigns />
  }

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

  return <UserZodiacPage slug={userZodiacSlug} />
}