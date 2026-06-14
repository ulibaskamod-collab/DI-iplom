'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const zodiacData = [
  {
    name: 'Овен',
    dates: '21 марта - 19 апреля',
    symbol: '♈',
    style: 'Классический, яркий, стремительный',
    colors: 'Красный, оранжевый, пурпурный',
    hobby: 'Экстремальные виды спорта, туризм',
    fact: 'Овны обладают высоким уровнем энергии и смелостью',
    fate: 'Первопроходец, всегда борется за свое место',
    slug: 'aries',
    gradient: 'from-red-100 to-orange-100',
    color: '#FF4500'
  },
  {
    name: 'Телец',
    dates: '20 апреля - 20 мая',
    symbol: '♉',
    style: 'Сдержанный, элегантный, натуральный',
    colors: 'Зеленый, голубой, нежно-розовый',
    hobby: 'Кулинария, садоводство, искусство',
    fact: 'Практичные, любят комфорт и стабильность',
    fate: 'Стремление к материальному благополучию',
    slug: 'taurus',
    gradient: 'from-green-100 to-emerald-100',
    color: '#2ECC71'
  },
  {
    name: 'Близнецы',
    dates: '21 мая - 20 июня',
    symbol: '♊',
    style: 'Легкий, разнообразный, модный',
    colors: 'Желтый, серебристый, бирюзовый',
    hobby: 'Чтение, путешествия, общение',
    fact: 'Двойственная натура, любопытство',
    fate: 'Постоянное движение и поиск',
    slug: 'gemini',
    gradient: 'from-yellow-100 to-amber-100',
    color: '#FFD700'
  },
  {
    name: 'Рак',
    dates: '21 июня - 22 июля',
    symbol: '♋',
    style: 'Домашний, уютный, чувствительный',
    colors: 'Серебряный, белый, голубой',
    hobby: 'Кулинария, рукоделие, забота о доме',
    fact: 'Эмоциональны, привязаны к дому и семье',
    fate: 'Забота о близких и создание уюта',
    slug: 'cancer',
    gradient: 'from-blue-100 to-cyan-100',
    color: '#6C5CE7'
  },
  {
    name: 'Лев',
    dates: '23 июля - 22 августа',
    symbol: '♌',
    style: 'Роскошный, яркий, театральный',
    colors: 'Золотой, оранжевый, пурпурный',
    hobby: 'Сцена, искусство, организация мероприятий',
    fact: 'Прирожденные лидеры, любят быть в центре внимания',
    fate: 'Проявить таланты и поделиться энергией',
    slug: 'leo',
    gradient: 'from-orange-100 to-amber-100',
    color: '#FF8C00'
  },
  {
    name: 'Дева',
    dates: '23 августа - 22 сентября',
    symbol: '♍',
    style: 'Аккуратный, практичный, умеренный',
    colors: 'Синий, зеленый, серый',
    hobby: 'Чтение, аналитика, забота о здоровье',
    fact: 'Внимательны к деталям, любят порядок',
    fate: 'Помогать другим интеллектом и практичностью',
    slug: 'virgo',
    gradient: 'from-teal-100 to-cyan-100',
    color: '#20B2AA'
  },
  {
    name: 'Весы',
    dates: '23 сентября - 22 октября',
    symbol: '♎',
    style: 'Элегантный, гармоничный, изысканный',
    colors: 'Нежно-розовый, голубой, пастельные тона',
    hobby: 'Искусство, музыка, общение',
    fact: 'Стремятся к гармонии и равновесию',
    fate: 'Находить баланс и примирять людей',
    slug: 'libra',
    gradient: 'from-pink-100 to-rose-100',
    color: '#FF69B4'
  },
  {
    name: 'Скорпион',
    dates: '23 октября - 21 ноября',
    symbol: '♏',
    style: 'Загадочный, сильный, страстный',
    colors: 'Темно-красный, черный, бордовый',
    hobby: 'Психология, исследования, мистика',
    fact: 'Страстные, харизматичные, сильная интуиция',
    fate: 'Трансформация и преображение',
    slug: 'scorpio',
    gradient: 'from-red-100 to-rose-100',
    color: '#8B0000'
  },
  {
    name: 'Стрелец',
    dates: '22 ноября - 21 декабря',
    symbol: '♐',
    style: 'Яркий, свободный, приключенческий',
    colors: 'Синий, фиолетовый, сиреневый',
    hobby: 'Путешествия, спорт, философия',
    fact: 'Оптимисты, любят свободу и приключения',
    fate: 'Искать истину и делиться мудростью',
    slug: 'sagittarius',
    gradient: 'from-purple-100 to-indigo-100',
    color: '#9B59B6'
  },
  {
    name: 'Козерог',
    dates: '22 декабря - 19 января',
    symbol: '♑',
    style: 'Классический, строгий, эффективный',
    colors: 'Темно-коричневый, черный, серый',
    hobby: 'Карьеризм, учеба, планирование',
    fact: 'Амбициозны, целеустремленны, дисциплинированны',
    fate: 'Достичь вершин и построить фундамент',
    slug: 'capricorn',
    gradient: 'from-gray-100 to-slate-100',
    color: '#2C3E50'
  },
  {
    name: 'Водолей',
    dates: '20 января - 18 февраля',
    symbol: '♒',
    style: 'Необычный, футуристичный, независимый',
    colors: 'Голубой, бирюзовый, фиолетовый',
    hobby: 'Наука, технологии, социальные движения',
    fact: 'Оригинальны, независимы, гуманисты',
    fate: 'Привнести новое и помочь человечеству',
    slug: 'aquarius',
    gradient: 'from-cyan-100 to-blue-100',
    color: '#00CED1'
  },
  {
    name: 'Рыбы',
    dates: '19 февраля - 20 марта',
    symbol: '♓',
    style: 'Мечтательный, романтичный, интуитивный',
    colors: 'Морской зеленый, лавандовый, фиолетовый',
    hobby: 'Искусство, музыка, медитация',
    fact: 'Чувствительны, сострадательны, интуитивны',
    fate: 'Служение и исцеление',
    slug: 'pisces',
    gradient: 'from-teal-100 to-emerald-100',
    color: '#48D1CC'
  }
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

    zodiacData.forEach((zodiac) => {
      const element = document.getElementById(zodiac.slug)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToZodiac = (slug: string) => {
    const element = document.getElementById(slug)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Hero секция */}
      <section className="hero">
        <div className="hero-content">
          <h1>StellarFit</h1>
          <p>Астрология души и нарядов</p>
          
          <div className="zodiac-nav">
            {zodiacData.map((zodiac) => (
              <button
                key={zodiac.slug}
                onClick={() => scrollToZodiac(zodiac.slug)}
                className="zodiac-nav-btn"
                style={{
                  borderColor: activeZodiac === zodiac.slug ? zodiac.color : '#FFD4C8',
                  color: activeZodiac === zodiac.slug ? zodiac.color : '#5A5A5A'
                }}
              >
                {zodiac.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Блоки знаков зодиака */}
      {zodiacData.map((zodiac) => (
        <section
          key={zodiac.slug}
          id={zodiac.slug}
          className="zodiac-block"
          style={{ background: `linear-gradient(135deg, ${zodiac.color}08, ${zodiac.color}04)` }}
        >
          <div className="zodiac-header">
            <div className="zodiac-symbol" style={{ color: zodiac.color }}>
              {zodiac.symbol}
            </div>
            <div className="zodiac-title">
              <h2 style={{ color: zodiac.color }}>{zodiac.name}</h2>
              <p>{zodiac.dates}</p>
            </div>
          </div>

          <div className="zodiac-grid-content">
            <div className="zodiac-item">
              <h3>
                <span style={{ color: zodiac.color }}>✨</span> Стиль и цветотип
              </h3>
              <p>{zodiac.style}</p>
              <div className="colors-list" style={{ marginTop: '12px' }}>
                {zodiac.colors.split(', ').map((color, idx) => (
                  <div
                    key={idx}
                    className="color-dot"
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="zodiac-item">
              <h3>
                <span style={{ color: zodiac.color }}>🎯</span> Хобби
              </h3>
              <p>{zodiac.hobby}</p>
            </div>

            <div className="zodiac-item">
              <h3>
                <span style={{ color: zodiac.color }}>⭐</span> Интересные факты
              </h3>
              <p>{zodiac.fact}</p>
            </div>

            <div className="zodiac-item">
              <h3>
                <span style={{ color: zodiac.color }}>🔮</span> Судьба
              </h3>
              <p>{zodiac.fate}</p>
            </div>
          </div>

          <Link href={`/zodiac/${zodiac.slug}`} className="details-link" style={{ color: zodiac.color }}>
            Подробнее о знаке {zodiac.name} →
          </Link>
        </section>
      ))}

      {/* Футер */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">StellarFit</div>
          <div className="footer-links">
            <h4>Меню</h4>
            <a href="/">Главная</a>
            <a href="/zodiac">Все знаки</a>
            <a href="/designers">Дизайнеры</a>
          </div>
          <div className="footer-contacts">
            <h4>Контакты</h4>
            <p>Email: info@stellarfit.com</p>
            <p>Для вопросов и сотрудничества</p>
          </div>
        </div>
      </footer>
    </>
  )
}