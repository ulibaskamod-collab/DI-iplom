'use client'

export const dynamic = 'force-dynamic'

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
      <section className="hero">
        <div className="container">
          <h1 className="main-title">Астрология души и нарядов</h1>
          <div className="zodiac-nav">
            {zodiacButtons.map((name) => (
              <button
                key={name}
                onClick={() => {
                  const element = document.getElementById(`zodiac-${name}`)
                  if (element) element.scrollIntoView({ behavior: 'smooth' })
                }}
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
              <p>Адрес: Улица Пушкина, дом Колотушкина, 111</p>
              <p><a href="mailto:rotaralena661@gmail.com">rotaralena661@gmail.com</a></p>
              <p><a href="tel:+79629493596">+7 (962) 4949-35-05</a></p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .astroliv-page {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #0a0a1a 0%, #0d0d25 50%, #0a0a1a 100%);
          color: #ffffff;
          min-height: 100vh;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .main-title {
          text-align: center;
          margin-top: 50px;
          font-size: 3em;
          font-family: 'Georgia', serif;
          color: #c090e0;
        }
        .zodiac-nav {
          text-align: center;
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }
        .zodiac-nav button {
          background-color: #4a2a6a;
          border: none;
          padding: 12px 25px;
          border-radius: 20px;
          color: #d0b0f0;
          cursor: pointer;
          transition: all 0.3s;
        }
        .zodiac-nav button:hover {
          background-color: #6a4a8a;
          color: white;
        }
        .zodiac-block {
          background-color: rgba(40, 20, 60, 0.7);
          border-radius: 15px;
          margin: 30px auto;
          padding: 30px;
          width: 80%;
          max-width: 900px;
          display: flex;
          align-items: flex-start;
          gap: 30px;
          transition: transform 0.3s;
        }
        .zodiac-block:hover {
          transform: translateY(-5px);
        }
        .aries { background-color: rgba(70, 30, 40, 0.7); }
        .taurus { background-color: rgba(30, 70, 40, 0.7); }
        .gemini { background-color: rgba(30, 70, 40, 0.7); }
        .cancer { background-color: rgba(40, 40, 60, 0.7); }
        .leo { background-color: rgba(70, 50, 30, 0.7); }
        .virgo { background-color: rgba(40, 60, 50, 0.7); }
        .libra { background-color: rgba(70, 50, 80, 0.7); }
        .scorpio { background-color: rgba(70, 20, 50, 0.7); }
        .sagittarius { background-color: rgba(70, 40, 30, 0.7); }
        .capricorn { background-color: rgba(30, 40, 60, 0.7); }
        .aquarius { background-color: rgba(30, 50, 70, 0.7); }
        .pisces { background-color: rgba(40, 70, 60, 0.7); }
        .zodiac-icon {
          font-size: 4em;
          text-align: center;
          min-width: 80px;
        }
        .zodiac-symbol {
          filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
        }
        .zodiac-info {
          flex: 1;
        }
        .zodiac-title {
          font-size: 2.5em;
          margin-bottom: 5px;
          color: #e0b0ff;
        }
        .zodiac-date {
          font-size: 1.2em;
          color: #ccc;
          margin-bottom: 20px;
        }
        .zodiac-content {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .zodiac-item {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          padding: 20px;
        }
        .zodiac-item h3 {
          font-size: 1.3em;
          margin-top: 0;
          color: #d0b0f0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        .zodiac-item p {
          font-size: 0.95em;
          line-height: 1.6;
          color: #eee;
        }
        .details-link {
          display: inline-block;
          margin-top: 20px;
          color: #e0b0ff;
          text-decoration: none;
          transition: color 0.3s;
        }
        .details-link:hover {
          color: white;
          text-decoration: underline;
        }
        .astroliv-footer {
          background-color: rgba(20, 10, 30, 0.9);
          padding: 40px 0;
          margin-top: 60px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer-content {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
        }
        .footer-logo {
          font-size: 1.5em;
          font-family: 'Brush Script MT', cursive;
          color: #e0b0ff;
        }
        .footer-links ul, .footer-address ul {
          list-style: none;
          padding: 0;
        }
        .footer-links a, .footer-address a {
          color: #ccc;
          text-decoration: none;
        }
        .footer-links a:hover, .footer-address a:hover {
          color: #e0b0ff;
        }
        .footer-links h4, .footer-address h4 {
          color: #e0b0ff;
          margin-bottom: 10px;
        }
        @media (max-width: 768px) {
          .zodiac-block {
            flex-direction: column;
            width: 95%;
          }
          .zodiac-icon {
            text-align: center;
          }
          .zodiac-content {
            grid-template-columns: 1fr;
          }
          .footer-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 20px;
          }
          .zodiac-nav button {
            padding: 8px 16px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}

