'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, Sparkles, Star, ShoppingBag, 
  Quote, Eye, X
} from 'lucide-react'

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

// Компонент карточки одежды (с работающим "Быстрый просмотр")
function ClothingCard({ item, idx }: { item: any; idx: number }) {
  const [imgError, setImgError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
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

  const getGenderIcon = (gender: string) => {
    switch(gender) {
      case 'female': return '👩'
      case 'male': return '👨'
      default: return '👥'
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.06, duration: 0.4 }}
        whileHover={{ y: -8 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group bg-white/[0.03] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-black/30"
      >
        <div className="aspect-[3/4] bg-gradient-to-br from-white/[0.02] to-white/[0.05] relative overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={item.title || 'Одежда'}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
            loading="lazy"
            onError={() => setImgError(true)}
          />
          
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton itemId={item.id} />
          </div>
          
          {item.season && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-medium text-white/90 border border-white/10 flex items-center gap-1">
                {getSeasonIcon(item.season)}
                <span className="hidden sm:inline">{item.season === 'winter' ? 'Зима' : item.season === 'spring' ? 'Весна' : item.season === 'summer' ? 'Лето' : 'Осень'}</span>
              </span>
            </div>
          )}

          <div className="absolute bottom-3 right-3 z-10">
            <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-medium text-white/90 border border-white/10">
              {getGenderIcon(item.gender)}
            </span>
          </div>

          {/* Кнопка "Быстрый просмотр" - ТЕПЕРЬ РАБОТАЕТ */}

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
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-[10px]">✨</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>
      </motion.div>

      {/* Модальное окно "Быстрый просмотр" */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl max-w-md w-full p-6 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">{item.title || 'Без названия'}</h2>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-white/50 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
              
              {item.image_url && (
                <div className="aspect-square bg-gradient-to-br from-white/5 to-white/10 rounded-xl overflow-hidden mb-4">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              {item.description && (
                <p className="text-white/70 text-sm mb-3">{item.description}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {item.season && (
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/60">
                    {item.season === 'winter' && '❄️ Зима'}
                    {item.season === 'spring' && '🌸 Весна'}
                    {item.season === 'summer' && '☀️ Лето'}
                    {item.season === 'autumn' && '🍂 Осень'}
                  </span>
                )}
                <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/60">
                  {item.gender === 'female' ? '👩 Женский' : item.gender === 'male' ? '👨 Мужской' : '👥 Унисекс'}
                </span>
              </div>
              
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 bg-pink-500 rounded-xl text-white font-medium hover:bg-pink-600 transition"
              >
                Закрыть
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Гороскоп на сегодня
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

// Комплимент дня
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

// Совместимость с другими знаками
const getCompatibility = (signName: string) => {
  const compatibility: Record<string, { best: string[], worst: string[] }> = {
    'Овен': { best: ['Лев', 'Стрелец'], worst: ['Рак', 'Козерог'] },
    'Телец': { best: ['Дева', 'Козерог'], worst: ['Лев', 'Водолей'] },
    'Близнецы': { best: ['Весы', 'Водолей'], worst: ['Дева', 'Рыбы'] },
    'Рак': { best: ['Скорпион', 'Рыбы'], worst: ['Овен', 'Весы'] },
    'Лев': { best: ['Овен', 'Стрелец'], worst: ['Телец', 'Скорпион'] },
    'Дева': { best: ['Телец', 'Козерог'], worst: ['Близнецы', 'Стрелец'] },
    'Весы': { best: ['Близнецы', 'Водолей'], worst: ['Рак', 'Козерог'] },
    'Скорпион': { best: ['Рак', 'Рыбы'], worst: ['Лев', 'Водолей'] },
    'Стрелец': { best: ['Овен', 'Лев'], worst: ['Дева', 'Рыбы'] },
    'Козерог': { best: ['Телец', 'Дева'], worst: ['Овен', 'Весы'] },
    'Водолей': { best: ['Близнецы', 'Весы'], worst: ['Телец', 'Скорпион'] },
    'Рыбы': { best: ['Рак', 'Скорпион'], worst: ['Близнецы', 'Стрелец'] }
  }
  return compatibility[signName] || { best: ['Лев', 'Стрелец'], worst: ['Рак', 'Козерог'] }
}

// Lucky items
const getLuckyItems = (signName: string) => {
  const items: Record<string, { color: string, number: number, day: string }> = {
    'Овен': { color: 'Красный', number: 9, day: 'Вторник' },
    'Телец': { color: 'Зеленый', number: 6, day: 'Пятница' },
    'Близнецы': { color: 'Желтый', number: 5, day: 'Среда' },
    'Рак': { color: 'Белый', number: 2, day: 'Понедельник' },
    'Лев': { color: 'Золотой', number: 1, day: 'Воскресенье' },
    'Дева': { color: 'Серый', number: 7, day: 'Среда' },
    'Весы': { color: 'Розовый', number: 6, day: 'Пятница' },
    'Скорпион': { color: 'Черный', number: 8, day: 'Вторник' },
    'Стрелец': { color: 'Фиолетовый', number: 3, day: 'Четверг' },
    'Козерог': { color: 'Коричневый', number: 4, day: 'Суббота' },
    'Водолей': { color: 'Голубой', number: 11, day: 'Суббота' },
    'Рыбы': { color: 'Бирюзовый', number: 12, day: 'Четверг' }
  }
  return items[signName] || { color: 'Золотой', number: 7, day: 'Воскресенье' }
}

// Данные для всех знаков
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
    hobbies: ['Экстрим', 'Спорт', 'Путешествия', 'Лидерство', 'Быстрые машины'],
    facts: ['Первый знак зодиака', 'Огненная стихия', 'Управляется Марсом', 'Камень — алмаз'],
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
    hobbies: ['Кулинария', 'Искусство', 'Сад', 'Комфорт', 'Виноделие'],
    facts: ['Знак Земли', 'Управляется Венерой', 'Знак стабильности', 'Камень — изумруд'],
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
    hobbies: ['Общение', 'Чтение', 'Путешествия', 'Танцы', 'Языки'],
    facts: ['Воздушная стихия', 'Управляется Меркурием', 'Самый общительный', 'Камень — агат'],
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
    hobbies: ['Дом', 'Семья', 'Кулинария', 'Творчество', 'Астрология'],
    facts: ['Водная стихия', 'Управляется Луной', 'Самый домашний', 'Камень — лунный камень'],
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
    hobbies: ['Творчество', 'Сцена', 'Роскошь', 'Развлечения', 'Театр'],
    facts: ['Огненная стихия', 'Управляется Солнцем', 'Королевский знак', 'Камень — рубин'],
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
    hobbies: ['Порядок', 'Анализ', 'Здоровье', 'Саморазвитие', 'Йога'],
    facts: ['Знак Земли', 'Управляется Меркурием', 'Самый перфекционистский', 'Камень — сапфир'],
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
    hobbies: ['Искусство', 'Красота', 'Гармония', 'Общение', 'Дизайн'],
    facts: ['Воздушная стихия', 'Управляется Венерой', 'Знак равновесия', 'Камень — опал'],
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
    hobbies: ['Тайны', 'Трансформация', 'Исследования', 'Интенсивность', 'Психология'],
    facts: ['Водная стихия', 'Управляется Плутоном', 'Самый загадочный', 'Камень — топаз'],
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
    hobbies: ['Путешествия', 'Философия', 'Приключения', 'Спорт', 'Фотография'],
    facts: ['Огненная стихия', 'Управляется Юпитером', 'Знак свободы', 'Камень — бирюза'],
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
    hobbies: ['Карьера', 'Дисциплина', 'Достижения', 'Планирование', 'История'],
    facts: ['Знак Земли', 'Управляется Сатурном', 'Самый амбициозный', 'Камень — гранат'],
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
    hobbies: ['Инновации', 'Технологии', 'Свобода', 'Изобретательство'],
    facts: ['Воздушная стихия', 'Управляется Ураном', 'Самый непредсказуемый', 'Камень — аметист'],
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
    hobbies: ['Творчество', 'Музыка', 'Мечты', 'Интуиция', 'Рисование'],
    facts: ['Водная стихия', 'Управляется Нептуном', 'Самый интуитивный', 'Камень — аквамарин'],
    bgGradient: 'from-teal-900/40 via-cyan-900/30 to-black'
  }
}

interface UserZodiacPageProps {
  slug: string
}

export default function UserZodiacPage({ slug }: UserZodiacPageProps) {
  const sign = zodiacFullData[slug]
  const [selectedGender, setSelectedGender] = useState('all')
  const [selectedSeason, setSelectedSeason] = useState('all')
  const [clothingItems, setClothingItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showHoroscope, setShowHoroscope] = useState(false)
  const [activeTab, setActiveTab] = useState<'style' | 'compatibility' | 'lucky'>('style')

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

  const compatibility = getCompatibility(sign.name)
  const luckyItems = getLuckyItems(sign.name)
  const dailyHoroscope = getDailyHoroscope(sign.name)
  const dailyCompliment = getDailyCompliment(sign.name)

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
            className="text-5xl md:text-7xl font-bold text-white mb-3 tracking-wider"
            style={{ textShadow: `0 0 40px ${sign.accentColor}40` }}
          >
            {sign.name}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 text-white/70 text-sm md:text-base flex-wrap justify-center"
          >
            <span>{sign.element} • {sign.planet} • {sign.dates}</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/70 text-base md:text-lg max-w-xl mx-auto mt-5 leading-relaxed"
          >
            {sign.description}
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
              style={{ backgroundColor: `${sign.accentColor}20`, color: sign.accentColor, border: `1px solid ${sign.accentColor}40` }}
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
                style={{ backgroundColor: `${sign.accentColor}10`, border: `1px solid ${sign.accentColor}30` }}
              >
                <Quote className="w-4 h-4 mx-auto mb-2" style={{ color: sign.accentColor }} />
                <p className="text-white/80 text-sm">{dailyHoroscope}</p>
                <p className="text-white/50 text-xs mt-2 italic">{dailyCompliment}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Табы */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('style')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'style'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            🎨 Стиль и цвет
          </button>
          <button
            onClick={() => setActiveTab('compatibility')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'compatibility'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            💑 Совместимость
          </button>
          <button
            onClick={() => setActiveTab('lucky')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'lucky'
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            🍀 Lucky day
          </button>
        </div>

        {/* Содержимое табов */}
        <AnimatePresence mode="wait">
          {activeTab === 'style' && (
            <motion.div
              key="style"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:scale-105"
                    style={{ backgroundColor: `${sign.accentColor}15`, color: sign.accentColor, border: `1px solid ${sign.accentColor}30` }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'compatibility' && (
            <motion.div
              key="compatibility"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 rounded-2xl p-6 md:p-8 mb-10 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-4" style={{ color: sign.accentColor }}>
                💑 Совместимость знаков
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                  <h3 className="font-semibold text-green-400 mb-2">✨ Идеальная пара</h3>
                  <div className="flex flex-wrap gap-2">
                    {compatibility.best.map(s => (
                      <Link key={s} href={`/zodiac/${s === 'Овен' ? 'oven' : s === 'Телец' ? 'telec' : s === 'Близнецы' ? 'bliznetsy' : s === 'Рак' ? 'rak' : s === 'Лев' ? 'lev' : s === 'Дева' ? 'deva' : s === 'Весы' ? 'vesy' : s === 'Скорпион' ? 'skorpion' : s === 'Стрелец' ? 'strelets' : s === 'Козерог' ? 'kozerog' : s === 'Водолей' ? 'vodoley' : 'ryby'}`}>
                        <span className="px-3 py-1.5 bg-green-500/20 rounded-full text-sm text-green-300 hover:bg-green-500/30 transition">
                          {s}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                  <h3 className="font-semibold text-red-400 mb-2">⚠️ Сложные отношения</h3>
                  <div className="flex flex-wrap gap-2">
                    {compatibility.worst.map(s => (
                      <Link key={s} href={`/zodiac/${s === 'Овен' ? 'oven' : s === 'Телец' ? 'telec' : s === 'Близнецы' ? 'bliznetsy' : s === 'Рак' ? 'rak' : s === 'Лев' ? 'lev' : s === 'Дева' ? 'deva' : s === 'Весы' ? 'vesy' : s === 'Скорпион' ? 'skorpion' : s === 'Стрелец' ? 'strelets' : s === 'Козерог' ? 'kozerog' : s === 'Водолей' ? 'vodoley' : 'ryby'}`}>
                        <span className="px-3 py-1.5 bg-red-500/20 rounded-full text-sm text-red-300 hover:bg-red-500/30 transition">
                          {s}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'lucky' && (
            <motion.div
              key="lucky"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 rounded-2xl p-6 md:p-8 mb-10 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: sign.accentColor }}>
                🍀 Ваши Lucky items
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-3xl mb-2">🎨</div>
                  <p className="text-white/50 text-sm">Счастливый цвет</p>
                  <p className="text-xl font-bold" style={{ color: sign.accentColor }}>{luckyItems.color}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-3xl mb-2">🔢</div>
                  <p className="text-white/50 text-sm">Счастливое число</p>
                  <p className="text-xl font-bold" style={{ color: sign.accentColor }}>{luckyItems.number}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-3xl mb-2">📅</div>
                  <p className="text-white/50 text-sm">Удачный день</p>
                  <p className="text-xl font-bold" style={{ color: sign.accentColor }}>{luckyItems.day}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Цветовая палитра */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h3 className="text-xl font-semibold text-center mb-6 text-white/90">
            Цветовая палитра {sign.name}
          </h3>
          <div className="flex flex-wrap justify-center gap-5">
            {sign.colors.map((color: string, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(color)}
              >
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg transition-shadow"
                  style={{ backgroundColor: color, boxShadow: `0 0 25px ${color}40` }}
                />
                <span className="text-white/50 text-xs">{sign.colorNames[idx]}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-white/30 text-xs mt-4">💡 Нажмите на цвет, чтобы скопировать код</p>
        </motion.div>

        {/* Хобби и факты */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.08]"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4" style={{ color: sign.accentColor }} />
              Хобби и увлечения
            </h3>
            <div className="flex flex-wrap gap-2">
              {sign.hobbies.map((hobby: string, idx: number) => (
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
              <Star className="w-4 h-4" style={{ color: sign.accentColor }} />
              Интересные факты
            </h3>
            <ul className="space-y-2">
              {sign.facts.map((fact: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-white/60">
                  <span style={{ color: sign.accentColor }}>✦</span> {fact}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Гардероб */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
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

        {/* Ссылка на все знаки */}
        <div className="text-center mt-12">
          <Link href="/zodiac" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition">
            <Star size={18} />
            Посмотреть все знаки зодиака
          </Link>
        </div>
      </div>

      <footer className="text-center py-8 mt-16 border-t border-white/[0.05]">
        <p className="text-white/25 text-xs">© 2026 StellarFit. Пусть звёзды ведут тебя ✨</p>
      </footer>
    </div>
  )
}