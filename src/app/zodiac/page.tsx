'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const zodiacData = [
  { name: 'Овен', dates: '21 мар - 19 апр', symbol: '♈', desc: 'Энергичный, смелый и страстный первопроходец', slug: 'aries', color: '#FF4500', bg: 'from-red-50 to-orange-50' },
  { name: 'Телец', dates: '20 апр - 20 мая', symbol: '♉', desc: 'Надёжный, терпеливый и чувственный ценитель красоты', slug: 'taurus', color: '#2ECC71', bg: 'from-green-50 to-emerald-50' },
  { name: 'Близнецы', dates: '21 мая - 20 июн', symbol: '♊', desc: 'Любознательный, коммуникабельный и многогранный', slug: 'gemini', color: '#FFD700', bg: 'from-yellow-50 to-amber-50' },
  { name: 'Рак', dates: '21 июн - 22 июл', symbol: '♋', desc: 'Заботливый, эмоциональный и семейственный', slug: 'cancer', color: '#6C5CE7', bg: 'from-blue-50 to-indigo-50' },
  { name: 'Лев', dates: '23 июл - 22 авг', symbol: '♌', desc: 'Величественный, щедрый и творческий лидер', slug: 'leo', color: '#FF8C00', bg: 'from-orange-50 to-amber-50' },
  { name: 'Дева', dates: '23 авг - 22 сен', symbol: '♍', desc: 'Аккуратный, аналитический и практичный перфекционист', slug: 'virgo', color: '#20B2AA', bg: 'from-teal-50 to-cyan-50' },
  { name: 'Весы', dates: '23 сен - 22 окт', symbol: '♎', desc: 'Гармоничный, дипломатичный и эстетичный', slug: 'libra', color: '#FF69B4', bg: 'from-pink-50 to-rose-50' },
  { name: 'Скорпион', dates: '23 окт - 21 ноя', symbol: '♏', desc: 'Страстный, загадочный и трансформирующийся', slug: 'scorpio', color: '#8B0000', bg: 'from-red-50 to-rose-50' },
  { name: 'Стрелец', dates: '22 ноя - 21 дек', symbol: '♐', desc: 'Оптимистичный, свободолюбивый и ищущий истину', slug: 'sagittarius', color: '#9B59B6', bg: 'from-purple-50 to-indigo-50' },
  { name: 'Козерог', dates: '22 дек - 19 янв', symbol: '♑', desc: 'Амбициозный, дисциплинированный и ответственный', slug: 'capricorn', color: '#2C3E50', bg: 'from-gray-50 to-slate-50' },
  { name: 'Водолей', dates: '20 янв - 18 фев', symbol: '♒', desc: 'Инновационный, независимый и гуманистичный', slug: 'aquarius', color: '#00CED1', bg: 'from-cyan-50 to-blue-50' },
  { name: 'Рыбы', dates: '19 фев - 20 мар', symbol: '♓', desc: 'Мечтательный, эмпатичный и интуитивный', slug: 'pisces', color: '#48D1CC', bg: 'from-teal-50 to-emerald-50' }
]

export default function AllZodiacPage() {
  return (
    <div>
      <div className="all-signs-header">
        <h1>Все знаки зодиака</h1>
        <p>Узнайте свой уникальный стиль, вдохновлённый звёздами ✨</p>
      </div>

      <div className="zodiac-grid-page">
        {zodiacData.map((zodiac, index) => (
          <motion.div
            key={zodiac.slug}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/zodiac/${zodiac.slug}`} className="zodiac-card-link">
              <div 
                className="zodiac-card"
                style={{ borderTop: `4px solid ${zodiac.color}` }}
              >
                <div className="zodiac-card-symbol">{zodiac.symbol}</div>
                <div className="zodiac-card-name" style={{ color: zodiac.color }}>
                  {zodiac.name}
                </div>
                <div className="zodiac-card-dates">{zodiac.dates}</div>
                <div className="zodiac-card-desc">{zodiac.desc}</div>
                <div className="mt-4 text-sm" style={{ color: zodiac.color }}>
                  Узнать подробнее →
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}