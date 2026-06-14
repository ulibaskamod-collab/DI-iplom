'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const zodiacButtons = [
  'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
  'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
]

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
  // ... остальные знаки
]

export default function HomePage() {
  const [activeZodiac, setActiveZodiac] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveZodiac(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    zodiacBlocks.forEach((zodiac) => {
      const element = document.getElementById(`zodiac-${zodiac.name}`)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

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
            {zodiacButtons.map((name) => (
              <button
                key={name}
                onClick={() => scrollToZodiac(name)}
                className="zodiac-nav-btn"
              >
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
          className="zodiac-block"
        >
          <div className="zodiac-header">
            <div className="zodiac-symbol">{zodiac.icon}</div>
            <div className="zodiac-title">
              <h2>{zodiac.name}</h2>
              <p>{zodiac.dates}</p>
            </div>
          </div>
          <div className="zodiac-grid-content">
            <div className="zodiac-item">
              <h3>✨ Стиль и цветотип</h3>
              <p>{zodiac.style}</p>
            </div>
            <div className="zodiac-item">
              <h3>🎯 Хобби</h3>
              <p>{zodiac.hobbies}</p>
            </div>
            <div className="zodiac-item">
              <h3>⭐ Интересные факты</h3>
              <p>{zodiac.facts}</p>
            </div>
            <div className="zodiac-item">
              <h3>🔮 Судьба</h3>
              <p>{zodiac.fate}</p>
            </div>
          </div>
          <Link href={`/zodiac/${zodiacSlugs[zodiac.name]}`} className="details-link">
            Подробнее →
          </Link>
        </section>
      ))}

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">StellarFit</div>
          <div className="footer-links">
            <h4>Меню</h4>
            <Link href="/">Главная</Link>
            <Link href="/zodiac">Все знаки</Link>
            <Link href="/designers">Дизайнеры</Link>
          </div>
          <div className="footer-contacts">
            <h4>Контакты</h4>
            <p>Email: info@stellarfit.com</p>
            <p>Для вопросов и сотрудничества</p>
          </div>
        </div>
      </footer>
    </div>
  )
}