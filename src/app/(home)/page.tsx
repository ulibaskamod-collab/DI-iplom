'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'

const zodiacSlugs: Record<string, string> = {
  'Овен': 'oven',
  'Телец': 'telec',
  'Близнецы': 'bliznetsy',
  'Рак': 'rak',
  'Лев': 'lev',
  'Дева': 'deva',
  'Весы': 'vesy',
  'Скорпион': 'skorpion',
  'Стрелец': 'strelets',
  'Козерог': 'kozerog',
  'Водолей': 'vodoley',
  'Рыбы': 'ryby',
}

export default function HomePage() {
  const zodiacButtons = [
    'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
    'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ]

  const zodiacBlocks = [
    {
      name: 'Овен',
      dates: '21 марта - 19 апреля',
      icon: '♈',
      style: 'Классический, яркий, стремительный. Цвета: яркий, красный, оранжевый, пурпурный.',
      hobbies: 'Экстремальные виды спорта (гонки, соревнования), туризм, работа, требующая физической активности.',
      facts: 'У Овнов высокий уровень энергии, они очень смелые. Он любит получать то, что хочет.',
      fate: 'Овен - первопроходец. Он всегда борется за свое место, но иногда не понимает, что добившись своего, теряет интерес.'
    },
    {
      name: 'Телец',
      dates: '20 апреля - 20 мая',
      icon: '♉',
      style: 'Сдержанный, элегантный. Цвета: зеленый, голубой, серый, нежно-розовый.',
      hobbies: 'Кулинария, садоводство, искусство (живопись, музыка), коллекционирование, отдых на природе.',
      facts: 'Тельцы - очень приземленные и практичные люди. Любят комфорт и стабильность. Они очень терпеливы.',
      fate: 'Судьба Тельца - это стремление к материальному благополучию и наслаждению жизнью.'
    },
    {
      name: 'Близнецы',
      dates: '21 мая - 20 июня',
      icon: '♊',
      style: 'Легкий, разнообразный, модный. Цвета: желтый, серебристый, голубой, бирюзовый.',
      hobbies: 'Чтение, изучение языков, путешествия, общение, игры, программирование, журналистика.',
      facts: 'Близнецы известны своей двойственной натурой. Они очень любопытны и любят узнавать новое.',
      fate: 'Судьба Близнецов - это постоянное движение и поиск. Им важно не потеряться между двумя путями.'
    },
    {
      name: 'Рак',
      dates: '21 июня - 22 июля',
      icon: '♋',
      style: 'Домашний, уютный, чувствительный. Цвета: серебряный, белый, светло-зеленый, голубой.',
      hobbies: 'Кулинария, создание уюта дома, уход за растениями, чтение, рукоделие, семейные мероприятия.',
      facts: 'Раки очень эмоциональны и привязаны к дому и семье. Они заботливые и отзывчивые.',
      fate: 'Судьба Рака - это забота о близких и создание крепкого семейного очага.'
    },
    {
      name: 'Лев',
      dates: '23 июля - 22 августа',
      icon: '♌',
      style: 'Роскошный, яркий, театральный. Цвета: золотой, оранжевый, красный, пурпурный.',
      hobbies: 'Сцена, искусство, организация мероприятий, спорт, волонтерство, игра на публику.',
      facts: 'Львы - прирожденные лидеры, любят быть в центре внимания. Благородны и щедры.',
      fate: 'Судьба Льва - это проявить свои таланты и поделиться энергией с миром.'
    },
    {
      name: 'Дева',
      dates: '23 августа - 22 сентября',
      icon: '♍',
      style: 'Аккуратный, практичный, умеренный. Цвета: синий, зеленый, бежевый, серый.',
      hobbies: 'Чтение, учеба, рукоделие, кулинария, аналитика, помощь другим, забота о здоровье.',
      facts: 'Девы очень внимательны к деталям, любят порядок и анализ. Часто склонны к самокритике.',
      fate: 'Судьба Девы - помогать другим своим интеллектом и практичностью.'
    },
    {
      name: 'Весы',
      dates: '23 сентября - 22 октября',
      icon: '♎',
      style: 'Элегантный, гармоничный, изысканный. Цвета: нежно-розовый, голубой, пастельные тона.',
      hobbies: 'Искусство, музыка, танцы, общение, путешествия, урегулирование конфликтов, посещение выставок.',
      facts: 'Весы стремятся к гармонии и равновесию. Любят красоту и справедливость, очень дипломатичны.',
      fate: 'Судьба Весов - находить баланс и примирять людей.'
    },
    {
      name: 'Скорпион',
      dates: '23 октября - 21 ноября',
      icon: '♏',
      style: 'Загадочный, сильный, сексуальный. Цвета: темно-красный, черный, бордовый, темно-синий.',
      hobbies: 'Психология, исследования, экстремальные виды спорта, мистика, любая деятельность, связанная с углублением.',
      facts: 'Скорпионы очень страстные, влиятельные и харизматичные. Обладают сильной интуицией.',
      fate: 'Судьба Скорпиона - трансформация и преображение. Они проходят через кризисы, чтобы стать сильнее.'
    },
    {
      name: 'Стрелец',
      dates: '22 ноября - 21 декабря',
      icon: '♐',
      style: 'Яркий, свободный, приключенческий. Цвета: синий, фиолетовый, сиреневый, зеленый.',
      hobbies: 'Путешествия, спорт, изучение философии, образование, духовные практики, игры.',
      facts: 'Стрельцы - оптимисты, любят свободу и приключения. Ценят честность и справедливость.',
      fate: 'Судьба Стрельцов - искать истину и делиться мудростью.'
    },
    {
      name: 'Козерог',
      dates: '22 декабря - 19 января',
      icon: '♑',
      style: 'Классический, строгий, эффективный. Цвета: темно-коричневый, черный, серый, темно-синий.',
      hobbies: 'Карьеризм, учеба, планирование, спорт, история, коллекционирование.',
      facts: 'Козероги очень амбициозны, целеустремленны и дисциплинированны. Ценят традиции и ответственность.',
      fate: 'Судьба Козерогов - достичь вершин и построить прочный фундамент.'
    },
    {
      name: 'Водолей',
      dates: '20 января - 18 февраля',
      icon: '♒',
      style: 'Необычный, футуристичный, независимый. Цвета: голубой, бирюзовый, серебристый, фиолетовый.',
      hobbies: 'Наука, технологии, астрономия, социальные движения, искусство, программирование, дружба.',
      facts: 'Водолеи - оригинальны, независимы и гуманисты. Ценят свободу и дружбу, часто имеют нестандартное мышление.',
      fate: 'Судьба Водолеев - привнести что-то новое в мир и помочь человечеству.'
    },
    {
      name: 'Рыбы',
      dates: '19 февраля - 20 марта',
      icon: '♓',
      style: 'Мечтательный, романтичный, интуитивный. Цвета: морской зеленый, синий, лавандовый, фиолетовый.',
      hobbies: 'Искусство, музыка, поэзия, медитация, духовные практики, помощь другим, работа с водой.',
      facts: 'Рыбы - очень чувствительны, сострадательны и интуитивны. Обладают богатым воображением.',
      fate: 'Судьба Рыб - это служение и исцеление. Важно научиться отличать реальность от иллюзий.'
    }
  ]
// ===== КОМПОНЕНТ КАРТОЧКИ ОДЕЖДЫ С СЕРДЕЧКОМ =====
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
            {item.season === 'winter' ? '❄️' : 
             item.season === 'spring' ? '🌸' : 
             item.season === 'summer' ? '☀️' : '🍂'}
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
  const getZodiacClass = (name: string) => {
    const classMap: Record<string, string> = {
      'Овен': 'aries', 'Телец': 'taurus', 'Близнецы': 'gemini', 'Рак': 'cancer',
      'Лев': 'leo', 'Дева': 'virgo', 'Весы': 'libra', 'Скорпион': 'scorpio',
      'Стрелец': 'sagittarius', 'Козерог': 'capricorn', 'Водолей': 'aquarius', 'Рыбы': 'pisces'
    }
    return classMap[name] || ''
  }

  return (
    <div className="astroliv-page">
      {/* Заголовок с красивым фоном как на фото */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="container hero-container">
            <div className="hero-content">
              <h1 className="main-title">
                <span className="title-gradient">Астрология</span>
                <span className="title-light">души и нарядов</span>
              </h1>
              
              {/* Кнопки-навигация по знакам */}
              <div className="zodiac-nav">
                {zodiacButtons.map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      const element = document.getElementById(`zodiac-${name}`)
                      if (element) element.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="zodiac-nav-btn"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Блоки знаков */}
      {zodiacBlocks.map((zodiac) => (
        <section
          key={zodiac.name}
          id={`zodiac-${zodiac.name}`}
          className={`zodiac-block ${getZodiacClass(zodiac.name)}`}
        >
          <div className="zodiac-icon">
            <span className="zodiac-symbol">{zodiac.icon}</span>
          </div>
          <div className="zodiac-info">
            <h2 className="zodiac-title">{zodiac.name}</h2>
            <p className="zodiac-date">{zodiac.dates}</p>
            
            <div className="zodiac-content">
              <div className="zodiac-item">
                <h3>Стиль и цветотип</h3>
                <p>{zodiac.style}</p>
              </div>
              <div className="zodiac-item">
                <h3>Хобби</h3>
                <p>{zodiac.hobbies}</p>
              </div>
              <div className="zodiac-item">
                <h3>Интересные факты</h3>
                <p>{zodiac.facts}</p>
              </div>
              <div className="zodiac-item">
                <h3>Судьба</h3>
                <p>{zodiac.fate}</p>
              </div>
            </div>
            
            <Link href={`/zodiac/${zodiacSlugs[zodiac.name]}`} className="details-link">
              Подробнее →
            </Link>
          </div>
        </section>
      ))}

      {/* Футер */}
      <footer className="astroliv-footer">
        <div className="container">
          <div className="footer-grid">
            {/* Логотип и описание */}
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-star">✦</span>
                StellarFit
                <span className="logo-star">✦</span>
              </div>
              <p className="footer-description">
                Астрология стиля — ваш персональный гид по гардеробу, 
                вдохновленный звездами.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Telegram">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Быстрые ссылки */}
            <div className="footer-links">
              <h4>Навигация</h4>
              <ul>
                <li><Link href="/">Главная</Link></li>
                <li><Link href="/zodiac">Все знаки</Link></li>
                <li><Link href="/designers">Дизайнеры</Link></li>
                <li><Link href="/profile">Профиль</Link></li>
              </ul>
            </div>

            {/* Знаки зодиака */}
            <div className="footer-links">
              <h4>Знаки зодиака</h4>
              <ul className="footer-zodiac-list">
                {zodiacButtons.slice(0, 6).map((name) => (
                  <li key={name}>
                    <Link href={`/zodiac/${zodiacSlugs[name]}`}>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-links footer-zodiac-second">
              <ul className="footer-zodiac-list">
                {zodiacButtons.slice(6).map((name) => (
                  <li key={name}>
                    <Link href={`/zodiac/${zodiacSlugs[name]}`}>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Контакты */}
            <div className="footer-contacts">
              <h4>Контакты</h4>
              <ul>
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Улица Пушкина, дом Колотушкина, 111</span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <a href="mailto:rotaralena661@gmail.com">rotaralena661@gmail.com</a>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <a href="tel:+79629493596">+7 (962) 4949-35-05</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Нижняя часть футера */}
          <div className="footer-bottom">
            <div className="footer-divider"></div>
            <div className="footer-bottom-content">
              <p className="footer-copy">
                © 2026 StellarFit. Все права защищены.
              </p>
              <p className="footer-magic">
                ✨ Пусть звёзды ведут тебя ✨
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Стили */}
      <style jsx>{`
        /* Общие стили */
        .astroliv-page {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background: #0a0a0f;
          color: #ffffff;
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        /* ===== ГЕРОЙ-СЕКЦИЯ ===== */
        .hero-section {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: 
            radial-gradient(ellipse at 30% 40%, rgba(80, 30, 120, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 60%, rgba(180, 50, 130, 0.15) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 100%, rgba(60, 20, 150, 0.2) 0%, transparent 40%),
            linear-gradient(180deg, #0a0a0f 0%, #0f0a1a 30%, #0a0a15 60%, #0a0a0f 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          overflow: hidden;
        }

        /* Звездный эффект на фоне */
        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 30% 70%, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.25), transparent),
            radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.15), transparent),
            radial-gradient(1px 1px at 90% 30%, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 15% 90%, rgba(255,255,255,0.1), transparent),
            radial-gradient(1px 1px at 85% 60%, rgba(255,255,255,0.15), transparent),
            radial-gradient(1px 1px at 45% 40%, rgba(255,255,255,0.2), transparent);
          pointer-events: none;
          z-index: 0;
        }

        /* Декоративные круги */
        .hero-section::after {
          content: '';
          position: absolute;
          top: -250px;
          right: -250px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(150, 60, 200, 0.06) 0%, transparent 65%);
          border-radius: 50%;
          pointer-events: none;
        }

        .hero-overlay {
          position: relative;
          width: 100%;
          z-index: 1;
          padding: 70px 0 50px;
        }

        .hero-container {
          display: flex;
          justify-content: center;
        }

        .hero-content {
          max-width: 900px;
          width: 100%;
          text-align: center;
        }

        /* ===== НЕЖНЫЙ ЗАГОЛОВОК ===== */
        .main-title {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 35px;
          font-family: 'Georgia', serif;
          position: relative;
        }

        .title-gradient {
          font-size: 3.8em;
          font-weight: 300;
          letter-spacing: 4px;
          color: rgba(238, 179, 244, 0.85);
          text-shadow: 
            0 0 40px rgba(143, 69, 233, 0.47),
            0 0 80px rgba(200, 150, 255, 0.08),
            0 0 120px rgba(180, 120, 255, 0.05);
          line-height: 1.15;
          font-family: 'Georgia', serif;
        }

        .title-light {
          font-size: 3.2em;
          font-weight: 300;
          letter-spacing: 8px;
          color: rgba(238, 179, 244, 0.85);
          text-shadow: 
            0 0 40px rgba(143, 69, 233, 0.47),
            0 0 60px rgba(200, 150, 255, 0.04);
          margin-top: -8px;
          font-family: 'Georgia', serif;
        }

        /* ===== ЯРКИЕ КНОПКИ ЗНАКОВ ===== */
        .zodiac-nav {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          padding: 10px 0;
        }

        .zodiac-nav-btn {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(200, 150, 255, 0.12);
          padding: 12px 26px;
          border-radius: 30px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.5px;
          position: relative;
          box-shadow: 0 2px 15px rgba(100, 50, 200, 0.05);
        }

        /* Эффект свечения при наведении */
        .zodiac-nav-btn::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 32px;
          background: linear-gradient(135deg, rgba(200, 150, 255, 0), rgba(200, 150, 255, 0));
          transition: all 0.4s ease;
          z-index: -1;
          opacity: 0;
        }

        .zodiac-nav-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border-color: rgba(200, 150, 255, 0.3);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 
            0 8px 35px rgba(150, 80, 200, 0.2),
            0 0 40px rgba(200, 150, 255, 0.05);
        }

        .zodiac-nav-btn:hover::after {
          background: linear-gradient(135deg, rgba(200, 150, 255, 0.08), rgba(150, 80, 200, 0.05));
          opacity: 1;
        }

        .zodiac-nav-btn:active {
          transform: scale(0.95);
        }

        /* Индивидуальные цвета для кнопок */
        .zodiac-nav-btn:nth-child(1) { border-color: rgba(255, 69, 0, 0.2); }
        .zodiac-nav-btn:nth-child(2) { border-color: rgba(46, 204, 113, 0.2); }
        .zodiac-nav-btn:nth-child(3) { border-color: rgba(255, 215, 0, 0.2); }
        .zodiac-nav-btn:nth-child(4) { border-color: rgba(108, 92, 231, 0.2); }
        .zodiac-nav-btn:nth-child(5) { border-color: rgba(255, 215, 0, 0.25); }
        .zodiac-nav-btn:nth-child(6) { border-color: rgba(149, 165, 166, 0.2); }
        .zodiac-nav-btn:nth-child(7) { border-color: rgba(255, 182, 193, 0.2); }
        .zodiac-nav-btn:nth-child(8) { border-color: rgba(255, 107, 107, 0.2); }
        .zodiac-nav-btn:nth-child(9) { border-color: rgba(138, 43, 226, 0.2); }
        .zodiac-nav-btn:nth-child(10) { border-color: rgba(112, 128, 144, 0.2); }
        .zodiac-nav-btn:nth-child(11) { border-color: rgba(0, 255, 255, 0.15); }
        .zodiac-nav-btn:nth-child(12) { border-color: rgba(72, 209, 204, 0.2); }

        .zodiac-nav-btn:nth-child(1):hover { box-shadow: 0 8px 35px rgba(255, 69, 0, 0.2); }
        .zodiac-nav-btn:nth-child(2):hover { box-shadow: 0 8px 35px rgba(46, 204, 113, 0.2); }
        .zodiac-nav-btn:nth-child(3):hover { box-shadow: 0 8px 35px rgba(255, 215, 0, 0.2); }
        .zodiac-nav-btn:nth-child(4):hover { box-shadow: 0 8px 35px rgba(108, 92, 231, 0.2); }
        .zodiac-nav-btn:nth-child(5):hover { box-shadow: 0 8px 35px rgba(255, 215, 0, 0.25); }
        .zodiac-nav-btn:nth-child(6):hover { box-shadow: 0 8px 35px rgba(149, 165, 166, 0.2); }
        .zodiac-nav-btn:nth-child(7):hover { box-shadow: 0 8px 35px rgba(255, 182, 193, 0.2); }
        .zodiac-nav-btn:nth-child(8):hover { box-shadow: 0 8px 35px rgba(255, 107, 107, 0.2); }
        .zodiac-nav-btn:nth-child(9):hover { box-shadow: 0 8px 35px rgba(138, 43, 226, 0.2); }
        .zodiac-nav-btn:nth-child(10):hover { box-shadow: 0 8px 35px rgba(112, 128, 144, 0.2); }
        .zodiac-nav-btn:nth-child(11):hover { box-shadow: 0 8px 35px rgba(0, 255, 255, 0.15); }
        .zodiac-nav-btn:nth-child(12):hover { box-shadow: 0 8px 35px rgba(72, 209, 204, 0.2); }

        /* Блок знака */
        .zodiac-block {
          background-color: rgba(30, 20, 45, 0.6);
          border-radius: 16px;
          margin: 30px auto;
          padding: 30px 35px;
          width: 80%;
          max-width: 900px;
          display: flex;
          align-items: flex-start;
          gap: 30px;
          transition: transform 0.3s, box-shadow 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(4px);
        }

        .zodiac-block:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          border-color: rgba(255, 255, 255, 0.08);
        }
/* Цвета для каждого знака */
.aries { 
  background: rgba(50, 20, 30, 0.6); 
  border-color: rgba(255, 69, 0, 0.15); 
}
.taurus { 
  background: rgba(20, 50, 30, 0.6); 
  border-color: rgba(46, 204, 113, 0.15); 
}
.gemini { 
  background: rgba(50, 45, 20, 0.6); 
  border-color: rgba(255, 215, 0, 0.25); 
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.05);
}
.gemini:hover {
  box-shadow: 0 20px 50px rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.4);
}
.cancer { 
  background: rgba(25, 25, 50, 0.6); 
  border-color: rgba(108, 92, 231, 0.15); 
}
.leo { 
  background: rgba(50, 35, 20, 0.6); 
  border-color: rgba(255, 215, 0, 0.2); 
}
.virgo { 
  background: rgba(30, 45, 35, 0.6); 
  border-color: rgba(149, 165, 166, 0.15); 
}
.libra { 
  background: rgba(50, 30, 55, 0.6); 
  border-color: rgba(255, 182, 193, 0.15); 
}
.scorpio { 
  background: rgba(50, 15, 35, 0.6); 
  border-color: rgba(255, 107, 107, 0.15); 
}
.sagittarius { 
  background: rgba(50, 30, 20, 0.6); 
  border-color: rgba(138, 43, 226, 0.15); 
}
.capricorn { 
  background: rgba(20, 30, 45, 0.6); 
  border-color: rgba(112, 128, 144, 0.15); 
}
.aquarius { 
  background: rgba(20, 40, 55, 0.6); 
  border-color: rgba(0, 255, 255, 0.1); 
}
.pisces { 
  background: rgba(25, 50, 40, 0.6); 
  border-color: rgba(72, 209, 204, 0.15); 
}

/* Дополнительные стили для Близнецов */
.gemini .zodiac-symbol {
  filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.2));
  transition: filter 0.4s;
}

.gemini:hover .zodiac-symbol {
  filter: drop-shadow(0 0 50px rgba(255, 215, 0, 0.35));
}

.gemini .zodiac-title {
  color: #f5d742;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.1);
}

.gemini .zodiac-date {
  color: rgba(255, 215, 0, 0.5);
}

.gemini .zodiac-item h3 {
  color: #f5d742;
  border-bottom-color: rgba(255, 215, 0, 0.15);
}

.gemini .zodiac-item {
  border-color: rgba(255, 215, 0, 0.05);
}

.gemini .zodiac-item:hover {
  background-color: rgba(255, 215, 0, 0.05);
  border-color: rgba(255, 215, 0, 0.15);
}

.gemini .details-link {
  color: #f5d742;
}

.gemini .details-link:hover {
  color: #ffffff;
  border-bottom-color: #f5d742;
}

.gemini .zodiac-item p {
  color: rgba(255, 255, 255, 0.8);
}

/* Стили для кнопки Близнецов в навигации */
.zodiac-nav-btn:nth-child(3) { 
  border-color: rgba(255, 215, 0, 0.25); 
}
.zodiac-nav-btn:nth-child(3):hover { 
  box-shadow: 0 8px 35px rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.4);
}
/* Цвета для каждого знака */
.aries { background: rgba(50, 20, 30, 0.6); border-color: rgba(255, 69, 0, 0.15); }
.taurus { background: rgba(20, 50, 30, 0.6); border-color: rgba(46, 204, 113, 0.15); }
.gemini { 
  background: rgba(50, 45, 20, 0.6); 
  border-color: rgba(255, 215, 0, 0.25); 
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.05);
}
.gemini:hover {
  box-shadow: 0 20px 50px rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.4);
}
.cancer { background: rgba(25, 25, 50, 0.6); border-color: rgba(108, 92, 231, 0.15); }
.leo { background: rgba(50, 35, 20, 0.6); border-color: rgba(255, 215, 0, 0.2); }
.virgo { background: rgba(30, 45, 35, 0.6); border-color: rgba(149, 165, 166, 0.15); }
.libra { background: rgba(50, 30, 55, 0.6); border-color: rgba(255, 182, 193, 0.15); }
.scorpio { background: rgba(50, 15, 35, 0.6); border-color: rgba(255, 107, 107, 0.15); }
.sagittarius { background: rgba(50, 30, 20, 0.6); border-color: rgba(138, 43, 226, 0.15); }
.capricorn { background: rgba(20, 30, 45, 0.6); border-color: rgba(112, 128, 144, 0.15); }
.aquarius { background: rgba(20, 40, 55, 0.6); border-color: rgba(0, 255, 255, 0.1); }
.pisces { background: rgba(25, 50, 40, 0.6); border-color: rgba(72, 209, 204, 0.15); }
        /* Иконка знака */
        .zodiac-icon {
          font-size: 3.8em;
          text-align: center;
          min-width: 80px;
          padding-top: 8px;
          opacity: 0.9;
        }

        .zodiac-symbol {
          filter: drop-shadow(0 0 30px rgba(200, 150, 255, 0.1));
          transition: filter 0.4s;
        }

        .zodiac-block:hover .zodiac-symbol {
          filter: drop-shadow(0 0 40px rgba(200, 150, 255, 0.25));
        }

        /* Информация о знаке */
        .zodiac-info {
          flex: 1;
        }

        .zodiac-title {
          font-size: 2.4em;
          margin-bottom: 2px;
          color: #e8d0f8;
          font-family: 'Georgia', serif;
          font-weight: 600;
        }

        .zodiac-date {
          font-size: 1.1em;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 18px;
          font-weight: 300;
        }

        /* Сетка 2x2 для блоков */
        .zodiac-content {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .zodiac-item {
          background-color: rgba(0, 0, 0, 0.25);
          border-radius: 10px;
          padding: 16px 18px;
          transition: background-color 0.3s;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }

        .zodiac-item:hover {
          background-color: rgba(0, 0, 0, 0.35);
        }

        .zodiac-item h3 {
          font-size: 1em;
          margin-top: 0;
          color: #d0b0f0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 8px;
          margin-bottom: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .zodiac-item p {
          font-size: 0.9em;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.75);
        }

        /* Ссылка "Подробнее" */
        .details-link {
          display: inline-block;
          margin-top: 18px;
          color: #c8a0e8;
          text-decoration: none;
          transition: all 0.3s;
          font-weight: 400;
          font-size: 0.95em;
          border-bottom: 1px solid transparent;
        }

        .details-link:hover {
          color: #ffffff;
          border-bottom-color: #c8a0e8;
        }

        /* ===== ФУТЕР ===== */
        .astroliv-footer {
          background: linear-gradient(180deg, rgba(10, 10, 15, 0.95) 0%, rgba(15, 10, 25, 0.98) 100%);
          padding: 50px 0 20px;
          margin-top: 60px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          position: relative;
          overflow: hidden;
        }

        .astroliv-footer::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(200, 150, 255, 0.15), rgba(200, 100, 200, 0.3), rgba(200, 150, 255, 0.15), transparent);
          pointer-events: none;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr 1.2fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-logo {
          font-size: 1.8em;
          font-family: 'Georgia', serif;
          color: #e8d0f8;
          display: flex;
          align-items: center;
          gap: 12px;
          letter-spacing: 2px;
        }

        .logo-star {
          color: rgba(200, 150, 255, 0.3);
          font-size: 0.7em;
          transition: color 0.3s;
        }

        .footer-logo:hover .logo-star {
          color: rgba(200, 150, 255, 0.8);
        }

        .footer-description {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.9em;
          line-height: 1.6;
          max-width: 280px;
          font-weight: 300;
        }

        .footer-social {
          display: flex;
          gap: 10px;
          margin-top: 4px;
        }

        .social-link {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .social-link:hover {
          background: rgba(200, 150, 255, 0.1);
          border-color: rgba(200, 150, 255, 0.2);
          color: #e8d0f8;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(200, 150, 255, 0.1);
        }

        .footer-links h4,
        .footer-contacts h4 {
          color: #e8d0f8;
          font-size: 0.9em;
          font-weight: 600;
          margin-bottom: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-family: 'Georgia', serif;
        }

        .footer-links ul,
        .footer-contacts ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links ul li,
        .footer-contacts ul li {
          margin-bottom: 8px;
        }

        .footer-links ul li a,
        .footer-contacts ul li a {
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 0.85em;
          font-weight: 300;
          position: relative;
          padding-left: 0;
        }

        .footer-links ul li a::before {
          content: '›';
          opacity: 0;
          margin-right: 4px;
          transition: all 0.3s ease;
          color: #c8a0e8;
        }

        .footer-links ul li a:hover {
          color: #e8d0f8;
          padding-left: 14px;
        }

        .footer-links ul li a:hover::before {
          opacity: 1;
          margin-right: 6px;
        }

        .footer-contacts ul li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.85em;
          font-weight: 300;
          line-height: 1.5;
        }

        .footer-contacts ul li svg {
          flex-shrink: 0;
          margin-top: 2px;
          color: rgba(200, 150, 255, 0.3);
          transition: color 0.3s;
        }

        .footer-contacts ul li:hover svg {
          color: rgba(200, 150, 255, 0.7);
        }

        .footer-contacts ul li a {
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-contacts ul li a:hover {
          color: #e8d0f8;
        }

        .footer-zodiac-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 12px;
        }

        .footer-zodiac-list li {
          margin-bottom: 2px;
        }

        .footer-zodiac-list li a {
          font-size: 0.8em;
        }

        .footer-zodiac-second {
          margin-top: 0;
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
          margin-bottom: 20px;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .footer-copy {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.75em;
          font-weight: 300;
        }

        .footer-magic {
          color: rgba(200, 150, 255, 0.2);
          font-size: 0.75em;
          font-weight: 300;
          letter-spacing: 2px;
          font-family: 'Georgia', serif;
        }

        /* Адаптивность */
        @media (max-width: 768px) {
          .hero-section {
            min-height: 380px;
          }

          .hero-overlay {
            padding: 40px 0 25px;
          }

          .title-gradient {
            font-size: 2.4em;
            letter-spacing: 2px;
          }

          .title-light {
            font-size: 2em;
            letter-spacing: 4px;
          }

          .main-title {
            margin-bottom: 20px;
          }

          .zodiac-nav-btn {
            padding: 8px 16px;
            font-size: 12px;
          }

          .zodiac-nav {
            gap: 6px;
          }

          .zodiac-block {
            flex-direction: column;
            width: 95%;
            padding: 20px;
          }

          .zodiac-icon {
            text-align: center;
            font-size: 3em;
            min-width: unset;
          }

          .zodiac-content {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .zodiac-title {
            font-size: 2em;
            text-align: center;
          }

          .zodiac-date {
            text-align: center;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 25px;
          }

          .footer-brand {
            text-align: center;
            align-items: center;
          }

          .footer-description {
            text-align: center;
            max-width: 100%;
          }

          .footer-social {
            justify-content: center;
          }

          .footer-links h4,
          .footer-contacts h4 {
            text-align: center;
          }

          .footer-links ul {
            text-align: center;
          }

          .footer-links ul li a::before {
            display: none;
          }

          .footer-links ul li a:hover {
            padding-left: 0;
          }

          .footer-zodiac-list {
            justify-items: center;
          }

          .footer-contacts ul li {
            justify-content: center;
          }

          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
            gap: 6px;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            min-height: 300px;
          }

          .hero-overlay {
            padding: 25px 0 15px;
          }

          .title-gradient {
            font-size: 1.8em;
            letter-spacing: 1px;
          }

          .title-light {
            font-size: 1.5em;
            letter-spacing: 2px;
          }

          .zodiac-nav-btn {
            padding: 6px 12px;
            font-size: 10px;
            border-radius: 20px;
          }

          .zodiac-nav {
            gap: 4px;
          }

          .zodiac-block {
            padding: 14px;
            margin: 15px auto;
          }

          .zodiac-item {
            padding: 12px 14px;
          }

          .zodiac-item h3 {
            font-size: 0.9em;
          }

          .zodiac-item p {
            font-size: 0.82em;
          }

          .astroliv-footer {
            padding: 30px 0 15px;
          }

          .footer-logo {
            font-size: 1.4em;
          }

          .footer-description {
            font-size: 0.8em;
          }

          .footer-zodiac-list {
            grid-template-columns: 1fr 1fr;
            gap: 2px 8px;
          }

          .footer-zodiac-list li a {
            font-size: 0.75em;
          }

          .footer-contacts ul li {
            font-size: 0.8em;
          }
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
          
          .footer-brand {
            grid-column: 1 / -1;
          }
          
          .footer-description {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  )
}