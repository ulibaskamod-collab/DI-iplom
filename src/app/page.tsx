'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import HomePageAllSigns from './(home)/page'
import { Star } from 'lucide-react'

// Полные данные для всех знаков (копируем из ZodiacPageContent)
const zodiacFullData: Record<string, any> = {
  oven: {
    name: 'Овен',
    symbol: '♈',
    element: 'Огонь',
    planet: 'Марс',
    dates: '21 марта – 19 апреля',
    bgGradient: 'from-red-900/40 via-orange-900/30 to-black',
    accentColor: '#FF4500',
    heroImage: '🔥',
    title: 'Стиль Овна: Смелость и Спорт-ШИК',
    description: 'Пионер, воин, первооткрыватель. Овен — первый знак зодиака, заряженный динамикой, мужеством и страстью.',
    styleDesc: 'Авангард, динамика, функциональность. Кожа, металлические детали, яркие акценты.',
    styleKeywords: ['Смелость', 'Динамика', 'Функциональность', 'Огонь'],
    colors: ['#FF0000', '#FF4500', '#8B0000', '#1A1A1A', '#C0C0C0'],
    colorNames: ['Красный огонь', 'Мандарин', 'Кармин', 'Графит', 'Серебро'],
    hobbies: ['Экстрим', 'Спорт', 'Путешествия', 'Лидерство', 'Быстрые машины'],
    facts: ['Первый знак зодиака', 'Огненная стихия', 'Управляется Марсом', 'Камень — алмаз'],
    elementIcon: 'Zap',
    vibe: 'Энергичный и дерзкий'
  },
  telec: {
    name: 'Телец',
    symbol: '♉',
    element: 'Земля',
    planet: 'Венера',
    dates: '20 апреля – 20 мая',
    bgGradient: 'from-emerald-900/40 via-green-900/30 to-black',
    accentColor: '#2ECC71',
    heroImage: '🌿',
    title: 'Стиль Тельца: Природная элегантность',
    description: 'Чувственность, стойкость, любовь к роскоши. Телец — знак земной силы и красоты.',
    styleDesc: 'Натуральные ткани, мягкие силуэты, теплые земляные оттенки. Кашемир, шёлк, хлопок.',
    styleKeywords: ['Роскошь', 'Комфорт', 'Элегантность', 'Натуральность'],
    colors: ['#8B7355', '#D2B48C', '#556B2F', '#FFB6C1', '#F5DEB3'],
    colorNames: ['Коричневый', 'Бежевый', 'Оливковый', 'Пудровый', 'Кремовый'],
    hobbies: ['Кулинария', 'Искусство', 'Сад', 'Комфорт', 'Виноделие'],
    facts: ['Знак Земли', 'Управляется Венерой', 'Знак стабильности', 'Камень — изумруд'],
    elementIcon: 'Leaf',
    vibe: 'Утончённый и чувственный'
  },
  bliznetsy: {
    name: 'Близнецы',
    symbol: '♊',
    element: 'Воздух',
    planet: 'Меркурий',
    dates: '21 мая – 20 июня',
    bgGradient: 'from-yellow-900/40 via-amber-900/30 to-black',
    accentColor: '#FFD700',
    heroImage: '🌀',
    title: 'Стиль Близнецов: Эклектика и игра',
    description: 'Двойственность, коммуникабельность, жажда перемен. Близнецы — самый любознательный знак.',
    styleDesc: 'Смешение фактур и направлений: спорт-шик с бохо, офисный жакет с джинсами.',
    styleKeywords: ['Эклектика', 'Многослойность', 'Игривость', 'Свобода'],
    colors: ['#FFD700', '#87CEEB', '#32CD32', '#FFA500', '#9370DB'],
    colorNames: ['Золотой', 'Голубой', 'Лайм', 'Оранжевый', 'Пурпурный'],
    hobbies: ['Общение', 'Чтение', 'Путешествия', 'Танцы', 'Языки'],
    facts: ['Воздушная стихия', 'Управляется Меркурием', 'Самый общительный', 'Камень — агат'],
    elementIcon: 'Wind',
    vibe: 'Живой и многогранный'
  },
  rak: {
    name: 'Рак',
    symbol: '♋',
    element: 'Вода',
    planet: 'Луна',
    dates: '21 июня – 22 июля',
    bgGradient: 'from-blue-900/40 via-cyan-900/30 to-black',
    accentColor: '#6C5CE7',
    heroImage: '🌙',
    title: 'Стиль Рака: Лунная женственность',
    description: 'Эмпатия, глубина чувств, любовь к дому. Рак — самый заботливый и интуитивный знак.',
    styleDesc: 'Мягкие драпировки, струящиеся ткани, пастельные оттенки и винтажные нотки.',
    styleKeywords: ['Нежность', 'Уют', 'Романтика', 'Защита'],
    colors: ['#FFFFFF', '#C0C0C0', '#F0F8FF', '#E6E6FA', '#48D1CC'],
    colorNames: ['Белый', 'Серебряный', 'Небесный', 'Лавандовый', 'Бирюзовый'],
    hobbies: ['Дом', 'Семья', 'Кулинария', 'Творчество', 'Астрология'],
    facts: ['Водная стихия', 'Управляется Луной', 'Самый домашний', 'Камень — лунный камень'],
    elementIcon: 'Moon',
    vibe: 'Заботливый и мечтательный'
  },
  lev: {
    name: 'Лев',
    symbol: '♌',
    element: 'Огонь',
    planet: 'Солнце',
    dates: '23 июля – 22 августа',
    bgGradient: 'from-amber-900/40 via-yellow-900/30 to-black',
    accentColor: '#FFD700',
    heroImage: '👑',
    title: 'Стиль Льва: Старый Голливуд',
    description: 'Величественный, страстный, королевский знак. Солнце правит Львом, даря магнетизм и любовь к роскоши.',
    styleDesc: 'Люкс-бренды, золото, леопардовый принт, бархат, пайетки. Драгоценные ткани и броские аксессуары.',
    styleKeywords: ['Роскошь', 'Власть', 'Гламур', 'Царственность'],
    colors: ['#FFD700', '#8B008B', '#FF4500', '#1A1A1A', '#DAA520', '#800020'],
    colorNames: ['Золотой', 'Пурпурный', 'Оранжевый', 'Чёрный', 'Шампань', 'Бургунди'],
    hobbies: ['Творчество', 'Сцена', 'Роскошь', 'Развлечения', 'Театр'],
    facts: ['Огненная стихия', 'Управляется Солнцем', 'Королевский знак', 'Камень — рубин'],
    elementIcon: 'Crown',
    vibe: 'Дерзкий и королевский'
  },
  deva: {
    name: 'Дева',
    symbol: '♍',
    element: 'Земля',
    planet: 'Меркурий',
    dates: '23 августа – 22 сентября',
    bgGradient: 'from-gray-900/40 via-stone-900/30 to-black',
    accentColor: '#95A5A6',
    heroImage: '🍃',
    title: 'Стиль Девы: Элегантный минимализм',
    description: 'Элегантность, аналитический ум, безупречный вкус. Дева — знак чистоты и порядка.',
    styleDesc: 'Лаконичные силуэты, натуральные ткани, нейтральные оттенки с акцентами на детали.',
    styleKeywords: ['Минимализм', 'Чистота', 'Практичность', 'Совершенство'],
    colors: ['#FFFFFF', '#808080', '#D3D3D3', '#F5F5DC', '#6B8E23'],
    colorNames: ['Белый', 'Серый', 'Светло-серый', 'Бежевый', 'Оливковый'],
    hobbies: ['Порядок', 'Анализ', 'Здоровье', 'Саморазвитие', 'Йога'],
    facts: ['Знак Земли', 'Управляется Меркурием', 'Самый перфекционистский', 'Камень — сапфир'],
    elementIcon: 'Shield',
    vibe: 'Изысканный и безупречный'
  },
  vesy: {
    name: 'Весы',
    symbol: '♎',
    element: 'Воздух',
    planet: 'Венера',
    dates: '23 сентября – 22 октября',
    bgGradient: 'from-pink-900/40 via-rose-900/30 to-black',
    accentColor: '#FFB6C1',
    heroImage: '🌸',
    title: 'Стиль Весов: Утончённая элегантность',
    description: 'Гармония, дипломатичность, утончённость. Весы — знак равновесия и эстетики.',
    styleDesc: 'Мягкие силуэты, пастельные тона, изысканные ткани. Женственность без вычурности.',
    styleKeywords: ['Гармония', 'Эстетика', 'Женственность', 'Шик'],
    colors: ['#FFB6C1', '#87CEEB', '#DDA0DD', '#F5DEB3', '#FFF0F5'],
    colorNames: ['Розовый', 'Небесный', 'Лавандовый', 'Шампань', 'Жемчужный'],
    hobbies: ['Искусство', 'Красота', 'Гармония', 'Общение', 'Дизайн'],
    facts: ['Воздушная стихия', 'Управляется Венерой', 'Знак равновесия', 'Камень — опал'],
    elementIcon: 'Sparkles',
    vibe: 'Элегантный и гармоничный'
  },
  skorpion: {
    name: 'Скорпион',
    symbol: '♏',
    element: 'Вода',
    planet: 'Плутон',
    dates: '23 октября – 21 ноября',
    bgGradient: 'from-purple-900/40 via-purple-950/40 to-black',
    accentColor: '#FF6B6B',
    heroImage: '🦂',
    title: 'Стиль Скорпиона: Тёмная элегантность',
    description: 'Страсть, магнетизм, трансформация. Скорпион — самый загадочный и сильный знак.',
    styleDesc: 'Кожа, латекс, глубокий чёрный, винный и кроваво-красный. Стиль "рок-шик".',
    styleKeywords: ['Таинственность', 'Страсть', 'Магнетизм', 'Сила'],
    colors: ['#FF6B6B', '#8B0000', '#4B0082', '#800080', '#2E8B57'],
    colorNames: ['Коралловый', 'Кровавый', 'Индиго', 'Фиолетовый', 'Изумрудный'],
    hobbies: ['Тайны', 'Трансформация', 'Исследования', 'Интенсивность', 'Психология'],
    facts: ['Водная стихия', 'Управляется Плутоном', 'Самый загадочный', 'Камень — топаз'],
    elementIcon: 'Eye',
    vibe: 'Загадочный и мощный'
  },
  strelets: {
    name: 'Стрелец',
    symbol: '♐',
    element: 'Огонь',
    planet: 'Юпитер',
    dates: '22 ноября – 21 декабря',
    bgGradient: 'from-indigo-900/40 via-purple-900/30 to-black',
    accentColor: '#8A2BE2',
    heroImage: '🏹',
    title: 'Стиль Стрельца: Бохо-шик',
    description: 'Искатель приключений, философ, огненный странник. Стрелец — знак свободы и оптимизма.',
    styleDesc: 'Свобода — главное правило. Этнические мотивы, свободные силуэты, кожа, замша.',
    styleKeywords: ['Свобода', 'Приключения', 'Этника', 'Оптимизм'],
    colors: ['#800080', '#0000CD', '#FFA500', '#40E0D0', '#DDA0DD'],
    colorNames: ['Пурпурный', 'Синий', 'Оранжевый', 'Бирюзовый', 'Лиловый'],
    hobbies: ['Путешествия', 'Философия', 'Приключения', 'Спорт', 'Фотография'],
    facts: ['Огненная стихия', 'Управляется Юпитером', 'Знак свободы', 'Камень — бирюза'],
    elementIcon: 'Star',
    vibe: 'Свободный и оптимистичный'
  },
  kozerog: {
    name: 'Козерог',
    symbol: '♑',
    element: 'Земля',
    planet: 'Сатурн',
    dates: '22 декабря – 19 января',
    bgGradient: 'from-slate-900/40 via-gray-900/30 to-black',
    accentColor: '#708090',
    heroImage: '🏔️',
    title: 'Стиль Козерога: Классика и статус',
    description: 'Дисциплина, амбиции, безупречный вкус. Козерог — знак горных вершин, символ власти.',
    styleDesc: 'Кашемир, твид, идеально скроенные костюмы, минималистичные аксессуары.',
    styleKeywords: ['Власть', 'Классика', 'Статус', 'Элегантность'],
    colors: ['#1A1A1A', '#2F4F4F', '#696969', '#8B4513', '#F5F5DC'],
    colorNames: ['Чёрный', 'Тёмный', 'Серый', 'Коричневый', 'Бежевый'],
    hobbies: ['Карьера', 'Дисциплина', 'Достижения', 'Планирование', 'История'],
    facts: ['Знак Земли', 'Управляется Сатурном', 'Самый амбициозный', 'Камень — гранат'],
    elementIcon: 'Shield',
    vibe: 'Властный и статусный'
  },
  vodoley: {
    name: 'Водолей',
    symbol: '♒',
    element: 'Воздух',
    planet: 'Уран',
    dates: '20 января – 18 февраля',
    bgGradient: 'from-cyan-900/40 via-blue-900/30 to-black',
    accentColor: '#00FFFF',
    heroImage: '💧',
    title: 'Стиль Водолея: Авангард и футуризм',
    description: 'Инновации, свобода, авангард. Водолей — знак будущего и нестандартного мышления.',
    styleDesc: 'Необычные акценты, асимметрия, техно-аксессуары. Гость из будущего.',
    styleKeywords: ['Авангард', 'Футуризм', 'Технологичность', 'Свобода'],
    colors: ['#00FFFF', '#C0C0C0', '#0000FF', '#FF00FF', '#40E0D0'],
    colorNames: ['Бирюзовый', 'Серебряный', 'Синий', 'Неоновый', 'Мятный'],
    hobbies: ['Инновации', 'Технологии', 'Свобода', 'Изобретательство'],
    facts: ['Воздушная стихия', 'Управляется Ураном', 'Самый непредсказуемый', 'Камень — аметист'],
    elementIcon: 'Zap',
    vibe: 'Нестандартный и прогрессивный'
  },
  ryby: {
    name: 'Рыбы',
    symbol: '♓',
    element: 'Вода',
    planet: 'Нептун',
    dates: '19 февраля – 20 марта',
    bgGradient: 'from-teal-900/40 via-cyan-900/30 to-black',
    accentColor: '#48D1CC',
    heroImage: '🐟',
    title: 'Стиль Рыб: Морская феерия',
    description: 'Интуиция, глубинная эмпатия, творческий дар. Рыбы — последний знак зодиака.',
    styleDesc: 'Невесомые ткани, переливчатые оттенки, струящийся шифон, перламутр и блеск.',
    styleKeywords: ['Романтика', 'Таинственность', 'Творчество', 'Мечтательность'],
    colors: ['#48D1CC', '#E0FFFF', '#D8BFD8', '#F0E68C', '#FFB6C1'],
    colorNames: ['Бирюзовый', 'Белый', 'Лавандовый', 'Шампань', 'Розовый'],
    hobbies: ['Творчество', 'Музыка', 'Мечты', 'Интуиция', 'Рисование'],
    facts: ['Водная стихия', 'Управляется Нептуном', 'Самый интуитивный', 'Камень — аквамарин'],
    elementIcon: 'Droplets',
    vibe: 'Мечтательный и творческий'
  }
}

// Компонент для отображения полной страницы знака (упрощенная версия)
function UserZodiacPage({ slug }: { slug: string }) {
  const sign = zodiacFullData[slug]
  const [loading, setLoading] = useState(true)
  const [clothingItems, setClothingItems] = useState<any[]>([])
  const [selectedGender, setSelectedGender] = useState('all')
  const [selectedSeason, setSelectedSeason] = useState('all')

  useEffect(() => {
    fetch(`/api/zodiac/items?zodiacSlug=${slug}`)
      .then(res => res.json())
      .then(data => setClothingItems(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

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

  const filteredItems = clothingItems.filter(item => {
    if (selectedGender !== 'all' && item.gender !== selectedGender && item.gender !== 'unisex') return false
    if (selectedSeason !== 'all' && item.season !== selectedSeason) return false
    return true
  })

  return (
    <div className={`min-h-screen bg-gradient-to-b ${sign.bgGradient}`}>
      {/* Герой-секция */}
      <div className="relative h-[450px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-20">
          <div className="text-7xl md:text-8xl mb-4 drop-shadow-2xl">{sign.heroImage}</div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-3 tracking-wider" style={{ textShadow: `0 0 40px ${sign.accentColor}40` }}>
            {sign.name}
          </h1>
          <div className="flex items-center gap-2 text-white/70 text-sm md:text-base flex-wrap justify-center">
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

        {/* Цветовая палитра */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-center mb-6 text-white/90">
            Цветовая палитра {sign.name}
          </h3>
          <div className="flex flex-wrap justify-center gap-5">
            {sign.colors.map((color: string, idx: number) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(color)}
              >
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg"
                  style={{ backgroundColor: color, boxShadow: `0 0 25px ${color}40` }}
                />
                <span className="text-white/50 text-xs">{sign.colorNames[idx]}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/30 text-xs mt-4">💡 Нажмите на цвет, чтобы скопировать код</p>
        </div>

        {/* Хобби и факты */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              ✨ Хобби и увлечения
            </h3>
            <div className="flex flex-wrap gap-2">
              {sign.hobbies.map((hobby: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/60 border border-white/10">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              ⭐ Интересные факты
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

        {/* Гардероб */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-white">
            Гардероб {sign.name}
          </h2>
          <p className="text-center text-white/40 text-sm mb-8">
            Выбирайте идеальные образы по сезону и стилю
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

          {/* Товары */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-white/80" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-white/40">Нет товаров для выбранных фильтров</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {filteredItems.map((item, idx) => (
                <div key={item.id} className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500">
                  <div className="aspect-[3/4] bg-gradient-to-br from-white/5 to-white/10 relative overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl opacity-30">👕</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm truncate">{item.title || 'Без названия'}</h3>
                    <p className="text-white/40 text-xs mt-1">
                      {item.gender === 'female' ? ' Жен.' : item.gender === 'male' ? ' Муж.' : ' Унисекс'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

// ГЛАВНАЯ СТРАНИЦА
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

  // Показываем загрузку
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    )
  }

  // Неавторизованный → показываем все знаки
  if (status === 'unauthenticated') {
    return <HomePageAllSigns />
  }

  // Авторизованный, но нет знака → предлагаем заполнить профиль
  if (!userZodiacSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="text-center">
          <div className="text-6xl mb-4">🌟</div>
          <p className="text-white text-lg mb-2">Не удалось определить ваш знак зодиака</p>
          <p className="text-white/50 text-sm mb-6">Заполните дату рождения в профиле</p>
          <Link href="/profile" className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-semibold hover:opacity-90 transition">
            Перейти в профиль
          </Link>
        </div>
      </div>
    )
  }

  // Авторизованный и есть знак → показываем полную страницу знака
  return <UserZodiacPage slug={userZodiacSlug} />
}