'use client'

import Link from 'next/link'
import { useState } from 'react'

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
  // ... добавьте остальные 10 знаков по аналогии
]

export default function HomePage() {
  const [activeZodiac, setActiveZodiac] = useState<string | null>(null)

  const scrollToZodiac = (name: string) => {
    const element = document.getElementById(`zodiac-${name}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="astroliv-page">
      <section className="hero">
        <div className="container">
          <h1 className="main-title">Астрология души и нарядов</h1>
          <div className="zodiac-nav">
            {Object.keys(zodiacSlugs).map((name) => (
              <button key={name} onClick={() => scrollToZodiac(name)}>
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {zodiacBlocks.map((zodiac) => (
        <section
          key={zodiac.name}
          id={`zodiac-${zodiac.name}`}
          className={`zodiac-block ${zodiac.name.toLowerCase()}`}
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

      <footer className="astroliv-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">StellarFit</div>
            <div className="footer-links">
              <h4>Меню</h4>
              <ul>
                <li><Link href="/">Главная</Link></li>
                <li><Link href="/designers">Дизайнеры</Link></li>
              </ul>
            </div>
            <div className="footer-address">
              <p>Email: rotaralena661@gmail.com</p>
              <p>Тел: +7 (962) 4949-35-05</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}