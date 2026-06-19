'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import HomePageAllSigns from './(home)/page'
import { Star } from 'lucide-react'

// Данные для всех знаков (только основные поля)
const zodiacFullData: Record<string, any> = {
  oven: { name: 'Овен', symbol: '♈', element: 'Огонь', planet: 'Марс', dates: '21 марта – 19 апреля', accentColor: '#FF4500', heroImage: '🔥', title: 'Стиль Овна: Смелость и Спорт-ШИК', description: 'Пионер, воин, первооткрыватель.', styleDesc: 'Авангард, динамика, функциональность.', styleKeywords: ['Смелость', 'Динамика', 'Функциональность', 'Огонь'], bgGradient: 'from-red-900/40 via-orange-900/30 to-black' },
  telec: { name: 'Телец', symbol: '♉', element: 'Земля', planet: 'Венера', dates: '20 апреля – 20 мая', accentColor: '#2ECC71', heroImage: '🌿', title: 'Стиль Тельца: Природная элегантность', description: 'Чувственность, стойкость, любовь к роскоши.', styleDesc: 'Натуральные ткани, мягкие силуэты.', styleKeywords: ['Роскошь', 'Комфорт', 'Элегантность', 'Натуральность'], bgGradient: 'from-emerald-900/40 via-green-900/30 to-black' },
  bliznetsy: { name: 'Близнецы', symbol: '♊', element: 'Воздух', planet: 'Меркурий', dates: '21 мая – 20 июня', accentColor: '#FFD700', heroImage: '🌀', title: 'Стиль Близнецов: Эклектика и игра', description: 'Двойственность, коммуникабельность, жажда перемен.', styleDesc: 'Смешение фактур и направлений.', styleKeywords: ['Эклектика', 'Многослойность', 'Игривость', 'Свобода'], bgGradient: 'from-yellow-900/40 via-amber-900/30 to-black' },
  rak: { name: 'Рак', symbol: '♋', element: 'Вода', planet: 'Луна', dates: '21 июня – 22 июля', accentColor: '#6C5CE7', heroImage: '🌙', title: 'Стиль Рака: Лунная женственность', description: 'Эмпатия, глубина чувств, любовь к дому.', styleDesc: 'Мягкие драпировки, струящиеся ткани.', styleKeywords: ['Нежность', 'Уют', 'Романтика', 'Защита'], bgGradient: 'from-blue-900/40 via-cyan-900/30 to-black' },
  lev: { name: 'Лев', symbol: '♌', element: 'Огонь', planet: 'Солнце', dates: '23 июля – 22 августа', accentColor: '#FFD700', heroImage: '👑', title: 'Стиль Льва: Старый Голливуд', description: 'Величественный, страстный, королевский знак.', styleDesc: 'Люкс-бренды, золото, леопардовый принт.', styleKeywords: ['Роскошь', 'Власть', 'Гламур', 'Царственность'], bgGradient: 'from-amber-900/40 via-yellow-900/30 to-black' },
  deva: { name: 'Дева', symbol: '♍', element: 'Земля', planet: 'Меркурий', dates: '23 августа – 22 сентября', accentColor: '#95A5A6', heroImage: '🍃', title: 'Стиль Девы: Элегантный минимализм', description: 'Элегантность, аналитический ум, безупречный вкус.', styleDesc: 'Лаконичные силуэты, натуральные ткани.', styleKeywords: ['Минимализм', 'Чистота', 'Практичность', 'Совершенство'], bgGradient: 'from-gray-900/40 via-stone-900/30 to-black' },
  vesy: { name: 'Весы', symbol: '♎', element: 'Воздух', planet: 'Венера', dates: '23 сентября – 22 октября', accentColor: '#FFB6C1', heroImage: '🌸', title: 'Стиль Весов: Утончённая элегантность', description: 'Гармония, дипломатичность, утончённость.', styleDesc: 'Мягкие силуэты, пастельные тона.', styleKeywords: ['Гармония', 'Эстетика', 'Женственность', 'Шик'], bgGradient: 'from-pink-900/40 via-rose-900/30 to-black' },
  skorpion: { name: 'Скорпион', symbol: '♏', element: 'Вода', planet: 'Плутон', dates: '23 октября – 21 ноября', accentColor: '#FF6B6B', heroImage: '🦂', title: 'Стиль Скорпиона: Тёмная элегантность', description: 'Страсть, магнетизм, трансформация.', styleDesc: 'Кожа, латекс, глубокий чёрный.', styleKeywords: ['Таинственность', 'Страсть', 'Магнетизм', 'Сила'], bgGradient: 'from-purple-900/40 via-purple-950/40 to-black' },
  strelets: { name: 'Стрелец', symbol: '♐', element: 'Огонь', planet: 'Юпитер', dates: '22 ноября – 21 декабря', accentColor: '#8A2BE2', heroImage: '🏹', title: 'Стиль Стрельца: Бохо-шик', description: 'Искатель приключений, философ.', styleDesc: 'Этнические мотивы, свободные силуэты.', styleKeywords: ['Свобода', 'Приключения', 'Этника', 'Оптимизм'], bgGradient: 'from-indigo-900/40 via-purple-900/30 to-black' },
  kozerog: { name: 'Козерог', symbol: '♑', element: 'Земля', planet: 'Сатурн', dates: '22 декабря – 19 января', accentColor: '#708090', heroImage: '🏔️', title: 'Стиль Козерога: Классика и статус', description: 'Дисциплина, амбиции, безупречный вкус.', styleDesc: 'Кашемир, твид, идеально скроенные костюмы.', styleKeywords: ['Власть', 'Классика', 'Статус', 'Элегантность'], bgGradient: 'from-slate-900/40 via-gray-900/30 to-black' },
  vodoley: { name: 'Водолей', symbol: '♒', element: 'Воздух', planet: 'Уран', dates: '20 января – 18 февраля', accentColor: '#00FFFF', heroImage: '💧', title: 'Стиль Водолея: Авангард и футуризм', description: 'Инновации, свобода, авангард.', styleDesc: 'Асимметрия, необычные фактуры.', styleKeywords: ['Авангард', 'Футуризм', 'Технологичность', 'Свобода'], bgGradient: 'from-cyan-900/40 via-blue-900/30 to-black' },
  ryby: { name: 'Рыбы', symbol: '♓', element: 'Вода', planet: 'Нептун', dates: '19 февраля – 20 марта', accentColor: '#48D1CC', heroImage: '🐟', title: 'Стиль Рыб: Морская феерия', description: 'Интуиция, глубина, творческий дар.', styleDesc: 'Невесомые ткани, переливчатые оттенки.', styleKeywords: ['Романтика', 'Таинственность', 'Творчество', 'Мечтательность'], bgGradient: 'from-teal-900/40 via-cyan-900/30 to-black' },
}

function UserZodiacPage({ slug }: { slug: string }) {
  const sign = zodiacFullData[slug]
  const [loading, setLoading] = useState(true)

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
          <div className="text-7xl md:text-8xl mb-4 drop-shadow-2xl">{sign.heroImage}</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-3 tracking-wider" style={{ textShadow: `0 0 40px ${sign.accentColor}40` }}>
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