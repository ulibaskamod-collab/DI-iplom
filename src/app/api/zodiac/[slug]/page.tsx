'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, Sparkles, Filter } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

const zodiacData: Record<string, any> = {
  'Овен': {
    slug: 'oven', name: 'Овен', symbol: '♈', dates: '21 марта - 19 апреля',
    element: 'Огонь', planet: 'Марс', bgColor: '#1a0a0a', accentColor: '#FF4500',
    title: 'Стиль Овна: Смелость и Спорт-ШИК',
    description: 'Пионер, воин, первооткрыватель. Овен — первый знак зодиака, заряженный динамикой, мужеством и страстью.',
    styleDesc: 'Авангард, динамика, функциональность. Овны предпочитают удобство, но с огненной изюминкой — кожа, металлические детали, яркие акценты.',
    colors: ['#FF4500', '#FF0000', '#8B0000', '#1A1A1A', '#C0C0C0'],
    colorNames: ['Красный огонь', 'Алый', 'Кармин', 'Графит', 'Серебро'],
    hobbies: ['Экстрим', 'Спорт', 'Путешествия', 'Лидерство'],
    facts: ['Первый знак зодиака', 'Огненная стихия', 'Управляется Марсом', 'Камень — алмаз'],
    fate: 'Судьба Овна — быть первым.',
    wardrobeTitle: 'Гардероб Овна: Мощь и Стиль',
  },
  'Телец': {
    slug: 'telec', name: 'Телец', symbol: '♉', dates: '20 апреля - 20 мая',
    element: 'Земля', planet: 'Венера', bgColor: '#0a1a0a', accentColor: '#2ECC71',
    title: 'Стиль Тельца: природная элегантность',
    description: 'Чувственность, стойкость, любовь к роскоши.',
    styleDesc: 'Натуральные ткани, мягкие силуэты, теплые земляные оттенки.',
    colors: ['#8B7355', '#D2B48C', '#556B2F', '#FFB6C1', '#F5DEB3'],
    colorNames: ['Коричневый', 'Бежевый', 'Оливковый', 'Пудровый', 'Кремовый'],
    hobbies: ['Кулинария', 'Искусство', 'Сад', 'Комфорт'],
    facts: ['Знак Земли', 'Управляется Венерой', 'Знак стабильности', 'Камень — изумруд'],
    fate: 'Судьба Тельца — наслаждаться жизнью.',
    wardrobeTitle: 'Гардероб Тельца: роскошь в каждой детали',
  },
  'Близнецы': {
    slug: 'bliznetsy', name: 'Близнецы', symbol: '♊', dates: '21 мая - 20 июня',
    element: 'Воздух', planet: 'Меркурий', bgColor: '#1a0a1a', accentColor: '#FFD700',
    title: 'Стиль Близнецов: эклектика',
    description: 'Двойственность, коммуникабельность, жажда перемен.',
    styleDesc: 'Смешение фактур и направлений: спорт-шик с бохо.',
    colors: ['#FFD700', '#87CEEB', '#32CD32', '#FFA500', '#9370DB'],
    colorNames: ['Золотой', 'Голубой', 'Лайм', 'Оранжевый', 'Пурпурный'],
    hobbies: ['Общение', 'Чтение', 'Путешествия', 'Танцы'],
    facts: ['Воздушная стихия', 'Управляется Меркурием', 'Самый общительный', 'Камень — агат'],
    fate: 'Судьба — быть в центре событий.',
    wardrobeTitle: 'Гардероб Близнецов: стиль без границ',
  },
  'Рак': {
    slug: 'rak', name: 'Рак', symbol: '♋', dates: '21 июня - 22 июля',
    element: 'Вода', planet: 'Луна', bgColor: '#0a0a1a', accentColor: '#6C5CE7',
    title: 'Стиль Рака: нежность и комфорт',
    description: 'Эмпатия, глубина чувств, любовь к дому.',
    styleDesc: 'Мягкие драпировки, струящиеся ткани, пастельные оттенки.',
    colors: ['#FFFFFF', '#C0C0C0', '#F0F8FF', '#E6E6FA', '#48D1CC'],
    colorNames: ['Белый', 'Серебряный', 'Небесный', 'Лавандовый', 'Бирюзовый'],
    hobbies: ['Дом', 'Семья', 'Кулинария', 'Творчество'],
    facts: ['Водная стихия', 'Управляется Луной', 'Самый домашний', 'Камень — лунный камень'],
    fate: 'Судьба — создавать уют.',
    wardrobeTitle: 'Гардероб Рака: уютная элегантность',
  },
  'Лев': {
    slug: 'lev', name: 'Лев', symbol: '♌', dates: '23 июля - 22 августа',
    element: 'Огонь', planet: 'Солнце', bgColor: '#1a0a00', accentColor: '#FFD700',
    title: 'Стиль Льва: Сияй ярко',
    description: 'Величественный, страстный, королевский знак.',
    styleDesc: 'Люкс-бренды, золото, леопардовый принт, бархат.',
    colors: ['#FFD700', '#8B008B', '#FF4500', '#1A1A1A', '#DAA520', '#800020'],
    colorNames: ['Золотой', 'Пурпурный', 'Оранжевый', 'Чёрный', 'Шампань', 'Бургунди'],
    hobbies: ['Творчество', 'Сцена', 'Роскошь', 'Развлечения'],
    facts: ['Огненная стихия', 'Управляется Солнцем', 'Королевский знак', 'Камень — рубин'],
    fate: 'Судьба — быть в центре внимания.',
    wardrobeTitle: 'Гардероб Льва: королевская коллекция',
  },
  'Дева': {
    slug: 'deva', name: 'Дева', symbol: '♍', dates: '23 августа - 22 сентября',
    element: 'Земля', planet: 'Меркурий', bgColor: '#0a1a0a', accentColor: '#95A5A6',
    title: 'Стиль Девы: элегантный минимализм',
    description: 'Элегантность, аналитический ум, безупречный вкус.',
    styleDesc: 'Лаконичные силуэты, натуральные ткани, нейтральные оттенки.',
    colors: ['#FFFFFF', '#808080', '#D3D3D3', '#F5F5DC', '#6B8E23'],
    colorNames: ['Белый', 'Серый', 'Светло-серый', 'Бежевый', 'Оливковый'],
    hobbies: ['Порядок', 'Анализ', 'Здоровье', 'Саморазвитие'],
    facts: ['Знак Земли', 'Управляется Меркурием', 'Самый перфекционистский', 'Камень — сапфир'],
    fate: 'Судьба — помогать другим.',
    wardrobeTitle: 'Гардероб Девы: безупречные образы',
  },
  'Весы': {
    slug: 'vesy', name: 'Весы', symbol: '♎', dates: '23 сентября - 22 октября',
    element: 'Воздух', planet: 'Венера', bgColor: '#1a0a1a', accentColor: '#FFB6C1',
    title: 'Стиль Весов: утончённость',
    description: 'Гармония, дипломатичность, утончённость.',
    styleDesc: 'Мягкие силуэты, пастельные тона, изысканные ткани.',
    colors: ['#FFB6C1', '#87CEEB', '#DDA0DD', '#F5DEB3', '#FFF0F5'],
    colorNames: ['Розовый', 'Небесный', 'Лавандовый', 'Шампань', 'Жемчужный'],
    hobbies: ['Искусство', 'Красота', 'Гармония', 'Общение'],
    facts: ['Воздушная стихия', 'Управляется Венерой', 'Знак равновесия', 'Камень — опал'],
    fate: 'Судьба — создавать красоту.',
    wardrobeTitle: 'Гардероб Весов: элегантность вне времени',
  },
'Скорпион': {
  slug: 'skorpion', name: 'Скорпион', symbol: '♏', dates: '23 октября - 21 ноября',
  element: 'Вода', planet: 'Плутон', bgColor: '#2a0a2a', accentColor: '#FF6B6B',
  title: 'Стиль Скорпиона: тёмная элегантность',
  description: 'Страсть, магнетизм, трансформация.',
  styleDesc: 'Кожа, латекс, глубокий чёрный, винный и кроваво-красный.',
  colors: ['#FF6B6B', '#8B0000', '#4B0082', '#800080', '#2E8B57'],
  colorNames: ['Коралловый', 'Кровавый', 'Индиго', 'Фиолетовый', 'Изумрудный'],
  hobbies: ['Тайны', 'Трансформация', 'Исследования', 'Интенсивность'],
  facts: ['Водная стихия', 'Управляется Плутоном', 'Самый загадочный', 'Камень — топаз'],
  fate: 'Судьба — трансформироваться.',
  wardrobeTitle: 'Гардероб Скорпиона: тёмный магнетизм',
},
  'Стрелец': {
    slug: 'strelets', name: 'Стрелец', symbol: '♐', dates: '22 ноября - 21 декабря',
    element: 'Огонь', planet: 'Юпитер', bgColor: '#1a0a0a', accentColor: '#8A2BE2',
    title: 'Стиль Стрельца: Бохо-шик',
    description: 'Искатель приключений, философ, огненный странник.',
    styleDesc: 'Этнические мотивы, свободные силуэты, кожа, замша.',
    colors: ['#800080', '#0000CD', '#FFA500', '#40E0D0', '#DDA0DD'],
    colorNames: ['Пурпурный', 'Синий', 'Оранжевый', 'Бирюзовый', 'Лиловый'],
    hobbies: ['Путешествия', 'Философия', 'Приключения', 'Спорт'],
    facts: ['Огненная стихия', 'Управляется Юпитером', 'Знак свободы', 'Камень — бирюза'],
    fate: 'Судьба — искать истину.',
    wardrobeTitle: 'Гардероб Стрельца: стиль для покорения мира',
  },
  'Козерог': {
    slug: 'kozerog', name: 'Козерог', symbol: '♑', dates: '22 декабря - 19 января',
    element: 'Земля', planet: 'Сатурн', bgColor: '#0a0a0a', accentColor: '#708090',
    title: 'Стиль Козерога: статусная классика',
    description: 'Дисциплина, амбиции, безупречный вкус.',
    styleDesc: 'Кашемир, твид, идеально скроенные костюмы.',
    colors: ['#1A1A1A', '#2F4F4F', '#696969', '#8B4513', '#F5F5DC'],
    colorNames: ['Чёрный', 'Тёмный', 'Серый', 'Коричневый', 'Бежевый'],
    hobbies: ['Карьера', 'Дисциплина', 'Достижения', 'Планирование'],
    facts: ['Знак Земли', 'Управляется Сатурном', 'Самый амбициозный', 'Камень — гранат'],
    fate: 'Судьба — достигать вершин.',
    wardrobeTitle: 'Гардероб Козерога: инвестиции в стиль',
  },
  'Водолей': {
    slug: 'vodoley', name: 'Водолей', symbol: '♒', dates: '20 января - 18 февраля',
    element: 'Воздух', planet: 'Уран', bgColor: '#0a0a1a', accentColor: '#00FFFF',
    title: 'Стиль Водолея: авангард',
    description: 'Инновации, свобода, авангард.',
    styleDesc: 'Асимметрия, необычные фактуры, техно-аксессуары.',
    colors: ['#00FFFF', '#C0C0C0', '#0000FF', '#FF00FF', '#40E0D0'],
    colorNames: ['Бирюзовый', 'Серебряный', 'Синий', 'Неоновый', 'Мятный'],
    hobbies: ['Инновации', 'Технологии', 'Свобода', 'Изобретательство'],
    facts: ['Воздушная стихия', 'Управляется Ураном', 'Самый непредсказуемый', 'Камень — аметист'],
    fate: 'Судьба — изобретать.',
    wardrobeTitle: 'Гардероб Водолея: стиль из будущего',
  },
  'Рыбы': {
    slug: 'ryby', name: 'Рыбы', symbol: '♓', dates: '19 февраля - 20 марта',
    element: 'Вода', planet: 'Нептун', bgColor: '#0a1a1a', accentColor: '#48D1CC',
    title: 'Стиль Рыб: морская феерия',
    description: 'Интуиция, глубина, творческий дар.',
    styleDesc: 'Невесомые ткани, переливчатые оттенки, перламутр.',
    colors: ['#48D1CC', '#E0FFFF', '#D8BFD8', '#F0E68C', '#FFB6C1'],
    colorNames: ['Бирюзовый', 'Белый', 'Лавандовый', 'Шампань', 'Розовый'],
    hobbies: ['Творчество', 'Музыка', 'Мечты', 'Интуиция'],
    facts: ['Водная стихия', 'Управляется Нептуном', 'Самый интуитивный', 'Камень — аквамарин'],
    fate: 'Судьба — мечтать и создавать магию.',
    wardrobeTitle: 'Гардероб Рыб: поэзия в одежде',
  },
}

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
            setIsFavorite(data.some((f: any) => f.clothing_item_id === itemId))
          } else {
            setIsFavorite(!!data.id)
          }
        })
        .catch(() => {})
    }
  }, [itemId, session])

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
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-300 ${
        isFavorite 
          ? 'bg-red-500/90 text-white scale-110 shadow-lg shadow-red-500/30' 
          : 'bg-black/40 text-white/60 hover:text-red-400 hover:bg-black/60 backdrop-blur-sm'
      }`}
    >
      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
    </button>
  )
}

export default function ZodiacDetailPage() {
  const params = useParams()
  const signName = decodeURIComponent(params.slug as string)
  const sign = zodiacData[signName]
  const { data: session } = useSession()
  const [selectedGender, setSelectedGender] = useState('all')
  const [selectedSeason, setSelectedSeason] = useState('all')
  const [clothingItems, setClothingItems] = useState<any[]>([])
  const [loadingItems, setLoadingItems] = useState(true)

  useEffect(() => {
    if (sign) {
      fetch(`/api/zodiac/items?zodiacSlug=${sign.slug}`)
        .then(res => res.json())
        .then(data => setClothingItems(Array.isArray(data) ? data : []))
        .catch(console.error)
        .finally(() => setLoadingItems(false))
    }
  }, [sign])

  if (!sign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Знак не найден</h1>
          <Link href="/" className="text-pink-400 hover:text-pink-300">← На главную</Link>
        </div>
      </div>
    )
  }

  const filteredItems = clothingItems.filter(item => {
    if (selectedSeason !== 'all' && item.season !== selectedSeason) return false
    if (selectedGender !== 'all' && item.gender !== selectedGender && item.gender !== 'unisex') return false
    return true
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: sign.bgColor }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold" style={{ color: sign.accentColor, fontFamily: "'Playfair Display', serif" }}>
            StellarFit
          </Link>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/" className="text-white/70 hover:text-white transition">Главная</Link>
            <Link href="/zodiac" className="text-white/70 hover:text-white transition">Знаки зодиака</Link>
            <Link href="/designers" className="text-white/70 hover:text-white transition">Дизайнеры</Link>
          </nav>
          {session ? (
            <Link href="/favorites" className="px-4 py-2 rounded-full text-sm font-medium transition" style={{ backgroundColor: sign.accentColor + '20', color: sign.accentColor, border: `1px solid ${sign.accentColor}40` }}>
              ❤️ Избранное
            </Link>
          ) : (
            <Link href="/auth/signin" className="px-4 py-2 rounded-full text-sm font-semibold transition hover:opacity-90" style={{ backgroundColor: sign.accentColor, color: '#000' }}>
              Войти
            </Link>
          )}
        </div>
      </header>

      <main className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="text-8xl mb-6">{sign.symbol}</div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{ color: sign.accentColor, fontFamily: "'Playfair Display', serif" }}>
              {sign.name}
            </h1>
            <p className="text-white/60 text-lg mb-4">{sign.dates} • {sign.element} • {sign.planet}</p>
            <p className="text-white/80 text-base max-w-xl mx-auto leading-relaxed">{sign.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12 bg-white/5 rounded-2xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: sign.accentColor }}>{sign.title}</h2>
            <p className="text-white/70 leading-relaxed">{sign.styleDesc}</p>
          </motion.div>

          <div className="mb-12">
            <h3 className="text-xl font-semibold text-center mb-6 text-white/80">Цветовая палитра {sign.name}</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {sign.colors.map((color: string, idx: number) => (
                <motion.div key={idx} whileHover={{ scale: 1.1 }} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full shadow-lg border-2 border-white/20" style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}40` }} />
                  <span className="text-xs text-white/50">{sign.colorNames[idx]}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4" style={{ color: sign.accentColor }} />
                Хобби и увлечения
              </h3>
              <div className="flex flex-wrap gap-2">
                {sign.hobbies.map((hobby: string, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 bg-white/10 rounded-full text-xs text-white/70">{hobby}</span>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                ✨ Интересные факты
              </h3>
              <ul className="space-y-2">
                {sign.facts.map((fact: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                    <span style={{ color: sign.accentColor }}>✦</span> {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-white/5 to-transparent rounded-2xl p-8 mb-12 text-center border border-white/10">
            <p className="text-white/70 italic"> {sign.fate}</p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: sign.accentColor }}>{sign.wardrobeTitle}</h2>
            <p className="text-white/40 text-sm">Выберите фильтры для подбора образов</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex gap-1.5 bg-white/5 rounded-full p-1">
              {['all', 'female', 'male'].map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    selectedGender === g ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {g === 'all' ? 'Все' : g === 'female' ? '👩 Жен.' : '👨 Муж.'}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 bg-white/5 rounded-full p-1">
              {['all', 'winter', 'spring', 'summer', 'autumn'].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSeason(s)}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${
                    selectedSeason === s ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {s === 'all' ? 'Все' : s === 'winter' ? '❄️' : s === 'spring' ? '🌸' : s === 'summer' ? '☀️' : '🍂'}
                </button>
              ))}
            </div>
          </div>

          {loadingItems ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 text-white/40">
              <p>Нет товаров для выбранных фильтров</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all group"
                >
                  <div className="aspect-square bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center relative">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl opacity-30">👕</span>
                    )}
                    <div className="absolute top-2 right-2 z-10">
                      <FavoriteButton itemId={item.id} />
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-[10px] text-white/80">
                        {item.season === 'winter' && '❄️'}
                        {item.season === 'spring' && '🌸'}
                        {item.season === 'summer' && '☀️'}
                        {item.season === 'autumn' && '🍂'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">{item.title || 'Без названия'}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {item.gender === 'female' ? ' Жен.' : item.gender === 'male' ? ' Муж.' : ' Унисекс'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            
          </div>
        </div>
      </main>

      <footer className="text-center py-8 border-t border-white/10">
        <p className="text-white/30 text-xs">© 2026 StellarFit. Пусть звёзды ведут тебя ✨</p>
      </footer>
    </div>
  )
}