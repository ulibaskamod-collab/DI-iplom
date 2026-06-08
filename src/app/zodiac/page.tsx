'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const zodiacList = [
  { name: 'Овен', slug: 'oven', symbol: '♈', dates: '21.03 - 19.04', color: '#FF4500', element: 'Огонь' },
  { name: 'Телец', slug: 'telec', symbol: '♉', dates: '20.04 - 20.05', color: '#2ECC71', element: 'Земля' },
  { name: 'Близнецы', slug: 'bliznetsy', symbol: '♊', dates: '21.05 - 20.06', color: '#FFD700', element: 'Воздух' },
  { name: 'Рак', slug: 'rak', symbol: '♋', dates: '21.06 - 22.07', color: '#6C5CE7', element: 'Вода' },
  { name: 'Лев', slug: 'lev', symbol: '♌', dates: '23.07 - 22.08', color: '#FFA500', element: 'Огонь' },
  { name: 'Дева', slug: 'deva', symbol: '♍', dates: '23.08 - 22.09', color: '#95A5A6', element: 'Земля' },
  { name: 'Весы', slug: 'vesy', symbol: '♎', dates: '23.09 - 22.10', color: '#FFB6C1', element: 'Воздух' },
  { name: 'Скорпион', slug: 'skorpion', symbol: '♏', dates: '23.10 - 21.11', color: '#FF6B6B', element: 'Вода' },
  { name: 'Стрелец', slug: 'strelets', symbol: '♐', dates: '22.11 - 21.12', color: '#8A2BE2', element: 'Огонь' },
  { name: 'Козерог', slug: 'kozerog', symbol: '♑', dates: '22.12 - 19.01', color: '#708090', element: 'Земля' },
  { name: 'Водолей', slug: 'vodoley', symbol: '♒', dates: '20.01 - 18.02', color: '#00FFFF', element: 'Воздух' },
  { name: 'Рыбы', slug: 'ryby', symbol: '♓', dates: '19.02 - 20.03', color: '#48D1CC', element: 'Вода' },
]

export default function ZodiacCatalogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        <div className="text-center mb-12">
          <Sparkles className="w-16 h-16 text-pink-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white mb-4">Выберите знак зодиака</h1>
          <p className="text-purple-300 text-lg max-w-2xl mx-auto">
            Нажмите на любой знак, чтобы узнать его стиль и подборку одежды
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {zodiacList.map((zodiac, idx) => (
            <motion.div
              key={zodiac.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={`/zodiac/${zodiac.slug}`}>
                <div className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="text-6xl text-center mb-4">{zodiac.symbol}</div>
                  <h2 className="text-2xl font-bold text-white text-center mb-2" style={{ color: zodiac.color }}>
                    {zodiac.name}
                  </h2>
                  <p className="text-white/40 text-center text-sm">{zodiac.dates}</p>
                  <p className="text-white/30 text-center text-xs mt-2">{zodiac.element}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <footer className="text-center py-8 mt-16 border-t border-white/10">
          <p className="text-white/30 text-xs">© 2026 StellarFit. Пусть звёзды ведут тебя ✨</p>
        </footer>
      </div>
    </div>
  )
}