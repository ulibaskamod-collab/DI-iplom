'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Star, ShoppingBag } from 'lucide-react'

const zodiacFullData: Record<string, any> = {
  oven: {
    name: 'Овен', symbol: '♈', element: 'Огонь', planet: 'Марс',
    dates: '21 марта – 19 апреля', accentColor: '#FF4500', heroImage: '🔥',
    title: 'Стиль Овна: Смелость и Спорт-ШИК',
    description: 'Пионер, воин, первооткрыватель. Овен — первый знак зодиака, заряженный динамикой, мужеством и страстью.',
    styleDesc: 'Авангард, динамика, функциональность. Кожа, металлические детали, яркие акценты.',
    styleKeywords: ['Смелость', 'Динамика', 'Функциональность', 'Огонь'],
  },
  telec: {
    name: 'Телец', symbol: '♉', element: 'Земля', planet: 'Венера',
    dates: '20 апреля – 20 мая', accentColor: '#2ECC71', heroImage: '🌿',
    title: 'Стиль Тельца: Природная элегантность',
    description: 'Чувственность, стойкость, любовь к роскоши. Телец — знак земной силы и красоты.',
    styleDesc: 'Натуральные ткани, мягкие силуэты, теплые земляные оттенки.',
    styleKeywords: ['Роскошь', 'Комфорт', 'Элегантность', 'Натуральность'],
  },
  bliznetsy: {
    name: 'Близнецы', symbol: '♊', element: 'Воздух', planet: 'Меркурий',
    dates: '21 мая – 20 июня', accentColor: '#FFD700', heroImage: '🌀',
    title: 'Стиль Близнецов: Эклектика и игра',
    description: 'Двойственность, коммуникабельность, жажда перемен.',
    styleDesc: 'Смешение фактур и направлений: спорт-шик с бохо.',
    styleKeywords: ['Эклектика', 'Многослойность', 'Игривость', 'Свобода'],
  },
  rak: {
    name: 'Рак', symbol: '♋', element: 'Вода', planet: 'Луна',
    dates: '21 июня – 22 июля', accentColor: '#6C5CE7', heroImage: '🌙',
    title: 'Стиль Рака: Лунная женственность',
    description: 'Эмпатия, глубина чувств, любовь к дому.',
    styleDesc: 'Мягкие драпировки, струящиеся ткани, пастельные оттенки.',
    styleKeywords: ['Нежность', 'Уют', 'Романтика', 'Защита'],
  },
  lev: {
    name: 'Лев', symbol: '♌', element: 'Огонь', planet: 'Солнце',
    dates: '23 июля – 22 августа', accentColor: '#FFD700', heroImage: '👑',
    title: 'Стиль Льва: Старый Голливуд',
    description: 'Величественный, страстный, королевский знак.',
    styleDesc: 'Люкс-бренды, золото, леопардовый принт, бархат.',
    styleKeywords: ['Роскошь', 'Власть', 'Гламур', 'Царственность'],
  },
  deva: {
    name: 'Дева', symbol: '♍', element: 'Земля', planet: 'Меркурий',
    dates: '23 августа – 22 сентября', accentColor: '#95A5A6', heroImage: '🍃',
    title: 'Стиль Девы: Элегантный минимализм',
    description: 'Элегантность, аналитический ум, безупречный вкус.',
    styleDesc: 'Лаконичные силуэты, натуральные ткани, нейтральные оттенки.',
    styleKeywords: ['Минимализм', 'Чистота', 'Практичность', 'Совершенство'],
  },
  vesy: {
    name: 'Весы', symbol: '♎', element: 'Воздух', planet: 'Венера',
    dates: '23 сентября – 22 октября', accentColor: '#FFB6C1', heroImage: '🌸',
    title: 'Стиль Весов: Утончённая элегантность',
    description: 'Гармония, дипломатичность, утончённость.',
    styleDesc: 'Мягкие силуэты, пастельные тона, изысканные ткани.',
    styleKeywords: ['Гармония', 'Эстетика', 'Женственность', 'Шик'],
  },
  skorpion: {
    name: 'Скорпион', symbol: '♏', element: 'Вода', planet: 'Плутон',
    dates: '23 октября – 21 ноября', accentColor: '#FF6B6B', heroImage: '🦂',
    title: 'Стиль Скорпиона: Тёмная элегантность',
    description: 'Страсть, магнетизм, трансформация.',
    styleDesc: 'Кожа, латекс, глубокий чёрный, винный и кроваво-красный.',
    styleKeywords: ['Таинственность', 'Страсть', 'Магнетизм', 'Сила'],
  },
  strelets: {
    name: 'Стрелец', symbol: '♐', element: 'Огонь', planet: 'Юпитер',
    dates: '22 ноября – 21 декабря', accentColor: '#8A2BE2', heroImage: '🏹',
    title: 'Стиль Стрельца: Бохо-шик',
    description: 'Искатель приключений, философ, огненный странник.',
    styleDesc: 'Этнические мотивы, свободные силуэты, кожа, замша.',
    styleKeywords: ['Свобода', 'Приключения', 'Этника', 'Оптимизм'],
  },
  kozerog: {
    name: 'Козерог', symbol: '♑', element: 'Земля', planet: 'Сатурн',
    dates: '22 декабря – 19 января', accentColor: '#708090', heroImage: '🏔️',
    title: 'Стиль Козерога: Классика и статус',
    description: 'Дисциплина, амбиции, безупречный вкус.',
    styleDesc: 'Кашемир, твид, идеально скроенные костюмы.',
    styleKeywords: ['Власть', 'Классика', 'Статус', 'Элегантность'],
  },
  vodoley: {
    name: 'Водолей', symbol: '♒', element: 'Воздух', planet: 'Уран',
    dates: '20 января – 18 февраля', accentColor: '#00FFFF', heroImage: '💧',
    title: 'Стиль Водолея: Авангард и футуризм',
    description: 'Инновации, свобода, авангард.',
    styleDesc: 'Асимметрия, необычные фактуры, техно-аксессуары.',
    styleKeywords: ['Авангард', 'Футуризм', 'Технологичность', 'Свобода'],
  },
  ryby: {
    name: 'Рыбы', symbol: '♓', element: 'Вода', planet: 'Нептун',
    dates: '19 февраля – 20 марта', accentColor: '#48D1CC', heroImage: '🐟',
    title: 'Стиль Рыб: Морская феерия',
    description: 'Интуиция, глубинная эмпатия, творческий дар.',
    styleDesc: 'Невесомые ткани, переливчатые оттенки, струящийся шифон.',
    styleKeywords: ['Романтика', 'Таинственность', 'Творчество', 'Мечтательность'],
  },
}

interface UserZodiacPageProps {
  slug: string
}

export default function UserZodiacPage({ slug }: UserZodiacPageProps) {
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
          <Link href="/zodiac" className="text-pink-400 hover:text-pink-300">
            ← Перейти ко всем знакам
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      {/* Герой-секция */}
      <div className="relative h-[450px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-20">
          <div className="text-7xl md:text-8xl mb-4 drop-shadow-2xl">{sign.heroImage}</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-3" style={{ textShadow: `0 0 40px ${sign.accentColor}40` }}>
            {sign.name}
          </h1>
          <div className="flex items-center gap-2 text-white/70 text-sm md:text-base">
            <span>{sign.element} • {sign.planet} • {sign.dates}</span>
          </div>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto mt-5 leading-relaxed">
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
        </div>

        {/* Гардероб */}
        <div>
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
        </div>
      </div>
    </div>
  )
}