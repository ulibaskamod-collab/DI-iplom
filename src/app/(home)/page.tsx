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
      fate: 'Овен - первопроходец. Он всегда борется за свое место, но иногда не понимает, что добившись своего, теряет интерес.',
      bgClass: 'bg-red-900/40'
    },
    {
      name: 'Телец',
      dates: '20 апреля - 20 мая',
      icon: '♉',
      style: 'Сдержанный, элегантный. Цвета: зеленый, голубой, серый, нежно-розовый.',
      hobbies: 'Кулинария, садоводство, искусство (живопись, музыка), коллекционирование, отдых на природе.',
      facts: 'Тельцы - очень приземленные и практичные люди. Любят комфорт и стабильность. Они очень терпеливы.',
      fate: 'Судьба Тельца - это стремление к материальному благополучию и наслаждению жизнью.',
      bgClass: 'bg-green-900/40'
    },
    {
      name: 'Близнецы',
      dates: '21 мая - 20 июня',
      icon: '♊',
      style: 'Легкий, разнообразный, модный. Цвета: желтый, серебристый, голубой, бирюзовый.',
      hobbies: 'Чтение, изучение языков, путешествия, общение, игры, программирование, журналистика.',
      facts: 'Близнецы известны своей двойственной натурой. Они очень любопытны и любят узнавать новое.',
      fate: 'Судьба Близнецов - это постоянное движение и поиск. Им важно не потеряться между двумя путями.',
      bgClass: 'bg-yellow-900/40'
    },
    {
      name: 'Рак',
      dates: '21 июня - 22 июля',
      icon: '♋',
      style: 'Домашний, уютный, чувствительный. Цвета: серебряный, белый, светло-зеленый, голубой.',
      hobbies: 'Кулинария, создание уюта дома, уход за растениями, чтение, рукоделие, семейные мероприятия.',
      facts: 'Раки очень эмоциональны и привязаны к дому и семье. Они заботливые и отзывчивые.',
      fate: 'Судьба Рака - это забота о близких и создание крепкого семейного очага.',
      bgClass: 'bg-blue-900/40'
    },
    {
      name: 'Лев',
      dates: '23 июля - 22 августа',
      icon: '♌',
      style: 'Роскошный, яркий, театральный. Цвета: золотой, оранжевый, красный, пурпурный.',
      hobbies: 'Сцена, искусство, организация мероприятий, спорт, волонтерство, игра на публику.',
      facts: 'Львы - прирожденные лидеры, любят быть в центре внимания. Благородны и щедры.',
      fate: 'Судьба Льва - это проявить свои таланты и поделиться энергией с миром.',
      bgClass: 'bg-amber-900/40'
    },
    {
      name: 'Дева',
      dates: '23 августа - 22 сентября',
      icon: '♍',
      style: 'Аккуратный, практичный, умеренный. Цвета: синий, зеленый, бежевый, серый.',
      hobbies: 'Чтение, учеба, рукоделие, кулинария, аналитика, помощь другим, забота о здоровье.',
      facts: 'Девы очень внимательны к деталям, любят порядок и анализ. Часто склонны к самокритике.',
      fate: 'Судьба Девы - помогать другим своим интеллектом и практичностью.',
      bgClass: 'bg-gray-900/40'
    },
    {
      name: 'Весы',
      dates: '23 сентября - 22 октября',
      icon: '♎',
      style: 'Элегантный, гармоничный, изысканный. Цвета: нежно-розовый, голубой, пастельные тона.',
      hobbies: 'Искусство, музыка, танцы, общение, путешествия, урегулирование конфликтов, посещение выставок.',
      facts: 'Весы стремятся к гармонии и равновесию. Любят красоту и справедливость, очень дипломатичны.',
      fate: 'Судьба Весов - находить баланс и примирять людей.',
      bgClass: 'bg-pink-900/40'
    },
    {
      name: 'Скорпион',
      dates: '23 октября - 21 ноября',
      icon: '♏',
      style: 'Загадочный, сильный, сексуальный. Цвета: темно-красный, черный, бордовый, темно-синий.',
      hobbies: 'Психология, исследования, экстремальные виды спорта, мистика, любая деятельность, связанная с углублением.',
      facts: 'Скорпионы очень страстные, влиятельные и харизматичные. Обладают сильной интуицией.',
      fate: 'Судьба Скорпиона - трансформация и преображение. Они проходят через кризисы, чтобы стать сильнее.',
      bgClass: 'bg-purple-900/40'
    },
    {
      name: 'Стрелец',
      dates: '22 ноября - 21 декабря',
      icon: '♐',
      style: 'Яркий, свободный, приключенческий. Цвета: синий, фиолетовый, сиреневый, зеленый.',
      hobbies: 'Путешествия, спорт, изучение философии, образование, духовные практики, игры.',
      facts: 'Стрельцы - оптимисты, любят свободу и приключения. Ценят честность и справедливость.',
      fate: 'Судьба Стрельцов - искать истину и делиться мудростью.',
      bgClass: 'bg-indigo-900/40'
    },
    {
      name: 'Козерог',
      dates: '22 декабря - 19 января',
      icon: '♑',
      style: 'Классический, строгий, эффективный. Цвета: темно-коричневый, черный, серый, темно-синий.',
      hobbies: 'Карьеризм, учеба, планирование, спорт, история, коллекционирование.',
      facts: 'Козероги очень амбициозны, целеустремленны и дисциплинированны. Ценят традиции и ответственность.',
      fate: 'Судьба Козерогов - достичь вершин и построить прочный фундамент.',
      bgClass: 'bg-slate-900/40'
    },
    {
      name: 'Водолей',
      dates: '20 января - 18 февраля',
      icon: '♒',
      style: 'Необычный, футуристичный, независимый. Цвета: голубой, бирюзовый, серебристый, фиолетовый.',
      hobbies: 'Наука, технологии, астрономия, социальные движения, искусство, программирование, дружба.',
      facts: 'Водолеи - оригинальны, независимы и гуманисты. Ценят свободу и дружбу, часто имеют нестандартное мышление.',
      fate: 'Судьба Водолеев - привнести что-то новое в мир и помочь человечеству.',
      bgClass: 'bg-cyan-900/40'
    },
    {
      name: 'Рыбы',
      dates: '19 февраля - 20 марта',
      icon: '♓',
      style: 'Мечтательный, романтичный, интуитивный. Цвета: морской зеленый, синий, лавандовый, фиолетовый.',
      hobbies: 'Искусство, музыка, поэзия, медитация, духовные практики, помощь другим, работа с водой.',
      facts: 'Рыбы - очень чувствительны, сострадательны и интуитивны. Обладают богатым воображением.',
      fate: 'Судьба Рыб - это служение и исцеление. Важно научиться отличать реальность от иллюзий.',
      bgClass: 'bg-teal-900/40'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-5xl text-center font-serif text-purple-300 mt-12 mb-8">
          Астрология души и нарядов
        </h1>
        
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {zodiacButtons.map((name) => (
            <button
              key={name}
              onClick={() => {
                const element = document.getElementById(`zodiac-${name}`)
                if (element) element.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-purple-800/50 hover:bg-purple-700/70 text-purple-200 px-5 py-3 rounded-full transition"
            >
              {name}
            </button>
          ))}
        </div>

        {zodiacBlocks.map((zodiac) => (
          <div
            key={zodiac.name}
            id={`zodiac-${zodiac.name}`}
            className={`${zodiac.bgClass} rounded-2xl mx-auto mb-8 p-8 max-w-3xl flex flex-col md:flex-row gap-6 hover:-translate-y-1 transition`}
          >
            <div className="text-6xl text-center min-w-[80px] drop-shadow-md">
              {zodiac.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-4xl text-purple-200 mb-1">{zodiac.name}</h2>
              <p className="text-gray-300 text-lg mb-4">{zodiac.dates}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-xl p-4">
                  <h3 className="text-xl text-purple-200 border-b border-white/30 pb-2 mb-3">Стиль и цветотип</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{zodiac.style}</p>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <h3 className="text-xl text-purple-200 border-b border-white/30 pb-2 mb-3">Хобби</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{zodiac.hobbies}</p>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <h3 className="text-xl text-purple-200 border-b border-white/30 pb-2 mb-3">Интересные факты</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{zodiac.facts}</p>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <h3 className="text-xl text-purple-200 border-b border-white/30 pb-2 mb-3">Судьба</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{zodiac.fate}</p>
                </div>
              </div>
              
              <Link href={`/zodiac/${zodiacSlugs[zodiac.name]}`} className="inline-block mt-4 text-purple-300 hover:text-white hover:underline">
                Подробнее →
              </Link>
            </div>
          </div>
        ))}

        <footer className="text-center py-10 mt-12 border-t border-white/10">
          <div className="flex flex-wrap justify-around gap-6">
            <div className="text-2xl font-script text-purple-300">StellarFit</div>
            <div>
              <h4 className="text-purple-300 mb-2">Меню</h4>
              <ul className="space-y-1">
                <li><Link href="/" className="text-gray-400 hover:text-purple-300">Главная</Link></li>
                <li><Link href="/designers" className="text-gray-400 hover:text-purple-300">Дизайнеры</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-400">Адрес: Улица Пушкина, дом Колотушкина, 111</p>
              <p><a href="mailto:rotaralena661@gmail.com" className="text-gray-400 hover:text-purple-300">rotaralena661@gmail.com</a></p>
              <p><a href="tel:+79629493596" className="text-gray-400 hover:text-purple-300">+7 (962) 4949-35-05</a></p>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-8">© 2026 StellarFit. Пусть звёзды ведут тебя ✨</p>
        </footer>
      </div>
    </div>
  )
}