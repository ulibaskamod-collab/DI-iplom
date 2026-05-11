'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Globe, Heart, Star, Sparkles } from 'lucide-react'

const designers = [
  {
    id: 1,
    name: 'Коко Шанель',
    brand: 'Chanel',
    years: '1883–1971',
    image: '👒',
    description: 'Икона элегантности, освободившая женщин от корсетов. Её стиль — вневременная классика.',
    astroAdvice: 'Идеально для знаков Земли и Воздуха, ценящих лаконичность и качество.',
    legacy: 'Маленькое чёрное платье, твид, жемчуг — наследие Шанель до сих пор вдохновляет минималистов.',
    zodiacMatch: ['Дева', 'Телец', 'Весы'],
  },
  {
    id: 2,
    name: 'Ив Сен-Лоран',
    brand: 'Yves Saint Laurent',
    years: '1936–2008',
    image: '🎩',
    description: 'Революционер моды, создатель женского смокинга. Сделал моду доступной и современной.',
    astroAdvice: 'Идеально для знаков Огня и Воды, любящих риск и элегантность.',
    legacy: 'Женский смокинг, сафари-стиль, прозрачные блузы.',
    zodiacMatch: ['Скорпион', 'Лев', 'Водолей'],
  },
  {
    id: 3,
    name: 'Александр Маккуин',
    brand: 'Alexander McQueen',
    years: '1969–2010',
    image: '🦋',
    description: 'Тёмный гений, мастер драмы и театральности. Его стиль — тёмный романтизм.',
    astroAdvice: 'Идеально для знаков Воды и Земли, ценящих драматизм и детали.',
    legacy: 'Платья-броня, черепа, невероятные конструкции.',
    zodiacMatch: ['Скорпион', 'Рак', 'Козерог'],
  },
  {
    id: 4,
    name: 'Джорджо Армани',
    brand: 'Armani',
    years: 'род. 1934',
    image: '🎯',
    description: 'Король сдержанной роскоши и безупречного кроя. Создал стиль "power dressing".',
    astroAdvice: 'Идеально для знаков Земли, стремящихся к статусу и качеству.',
    legacy: 'Мягкие пиджаки, струящиеся ткани, минимализм.',
    zodiacMatch: ['Козерог', 'Телец', 'Дева'],
  },
  {
    id: 5,
    name: 'Джанни Версаче',
    brand: 'Versace',
    years: '1946–1997',
    image: '👑',
    description: 'Икона гламура, сексуальности и ярких принтов. Создал культ роскоши.',
    astroAdvice: 'Идеально для знаков Огня, любящих яркость и внимание.',
    legacy: 'Медуза, золото, барокко — вечная эстетика гламура.',
    zodiacMatch: ['Лев', 'Овен', 'Стрелец'],
  },
  {
    id: 6,
    name: 'Вивьен Вествуд',
    brand: 'Vivienne Westwood',
    years: 'род. 1941',
    image: '🎸',
    description: 'Панк-королева, активистка и бунтарка. Сделала моду инструментом протеста.',
    astroAdvice: 'Идеально для знаков Воздуха, ценящих свободу и эпатаж.',
    legacy: 'Тартан, корсеты поверх футболок, провокационные надписи.',
    zodiacMatch: ['Водолей', 'Близнецы', 'Стрелец'],
  },
  {
    id: 7,
    name: 'Кристиан Диор',
    brand: 'Dior',
    years: '1905–1957',
    image: '🌸',
    description: 'Отец New Look, подаривший женщинам ультраженственные силуэты.',
    astroAdvice: 'Идеально для знаков Воды и Воздуха, ценящих романтику.',
    legacy: 'Пышные юбки, талии-осы, цветы в моде — вечная женственность.',
    zodiacMatch: ['Рак', 'Весы', 'Рыбы'],
  },
  {
    id: 8,
    name: 'Том Форд',
    brand: 'Tom Ford',
    years: 'род. 1961',
    image: '👔',
    description: 'Сексуальный минимализм, безупречный крой и голливудский шик.',
    astroAdvice: 'Идеально для знаков, ценящих чувственность и стиль.',
    legacy: 'Бархатные костюмы, чувственный гламур 21 века.',
    zodiacMatch: ['Скорпион', 'Лев', 'Телец'],
  },
]

export default function DesignersPage() {
  const [selectedDesigner, setSelectedDesigner] = useState<number | null>(null)

  useEffect(() => {
    const starsContainer = document.getElementById('starsCanvas')
    if (!starsContainer) return
    starsContainer.innerHTML = ''
    const starCount = 150
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div')
      star.classList.add('star')
      star.style.width = Math.random() * 3 + 1 + 'px'
      star.style.height = star.style.width
      star.style.left = Math.random() * 100 + '%'
      star.style.top = Math.random() * 100 + '%'
      star.style.animationDelay = Math.random() * 5 + 's'
      star.style.animationDuration = Math.random() * 2 + 1.5 + 's'
      starsContainer.appendChild(star)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-3" />
          <h1 className="text-4xl md:text-5xl font-playfair bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Именитые дизайнеры
          </h1>
          <p className="text-purple-300 max-w-2xl mx-auto mt-2">
            Легендарные кутюрье, изменившие мир моды. Узнайте, какой дизайнер резонирует с вашим знаком зодиака.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {designers.map((designer, idx) => (
            <motion.div
              key={designer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-purple-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-700/50 hover:border-pink-500/50 transition-all cursor-pointer hover:scale-105"
              onClick={() => setSelectedDesigner(selectedDesigner === designer.id ? null : designer.id)}
            >
              <div className="h-40 bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-7xl">{designer.image}</span>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-[#f7c35c]">{designer.name}</h2>
                <p className="text-purple-300 text-sm">{designer.brand} • {designer.years}</p>
                <p className="text-purple-200 text-sm mt-2 line-clamp-2">{designer.description}</p>
                
                {/* Подробности при раскрытии */}
                {selectedDesigner === designer.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-purple-700/50 space-y-3"
                  >
                    <div className="bg-purple-800/30 rounded-xl p-3">
                      <p className="text-xs text-pink-400 font-semibold mb-1">✨ Астрологический совет</p>
                      <p className="text-sm text-purple-200">{designer.astroAdvice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-yellow-400 font-semibold mb-1">💎 Наследие</p>
                      <p className="text-sm text-purple-200">{designer.legacy}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {designer.zodiacMatch.map(sign => (
                        <span key={sign} className="px-2 py-1 bg-pink-500/20 rounded-full text-xs text-pink-300">{sign}</span>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                <button className="mt-3 text-pink-400 text-sm hover:text-pink-300 transition">
                  {selectedDesigner === designer.id ? 'Скрыть ↑' : 'Подробнее ↓'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}