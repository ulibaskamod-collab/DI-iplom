'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">StellarFit</h1>
        <p className="text-xl text-purple-300 mb-8">Астрология души и нарядов</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'].map((sign) => (
            <Link key={sign} href={`/zodiac/${sign === 'Овен' ? 'oven' : sign === 'Телец' ? 'telec' : sign === 'Близнецы' ? 'bliznetsy' : sign === 'Рак' ? 'rak' : sign === 'Лев' ? 'lev' : sign === 'Дева' ? 'deva' : sign === 'Весы' ? 'vesy' : sign === 'Скорпион' ? 'skorpion' : sign === 'Стрелец' ? 'strelets' : sign === 'Козерог' ? 'kozerog' : sign === 'Водолей' ? 'vodoley' : 'ryby'}`} className="bg-purple-800/50 p-4 rounded-lg hover:bg-purple-700 transition">
              <div className="text-3xl mb-2">
                {sign === 'Овен' && '♈'}
                {sign === 'Телец' && '♉'}
                {sign === 'Близнецы' && '♊'}
                {sign === 'Рак' && '♋'}
                {sign === 'Лев' && '♌'}
                {sign === 'Дева' && '♍'}
                {sign === 'Весы' && '♎'}
                {sign === 'Скорпион' && '♏'}
                {sign === 'Стрелец' && '♐'}
                {sign === 'Козерог' && '♑'}
                {sign === 'Водолей' && '♒'}
                {sign === 'Рыбы' && '♓'}
              </div>
              <div className="font-semibold">{sign}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}