// 'use client'

// import Link from 'next/link'

// interface ZodiacCardProps {
//   sign: {
//     id: number
//     name: string
//     slug: string
//     element: string
//     start_date: string
//     end_date: string
//   }
// }

// export default function ZodiacCard({ sign }: ZodiacCardProps) {
//   const zodiacEmojis: Record<string, string> = {
//     'Овен': '🐏',
//     'Телец': '🐂',
//     'Близнецы': '👥',
//     'Рак': '🦀',
//     'Лев': '🦁',
//     'Дева': '👧',
//     'Весы': '⚖️',
//     'Скорпион': '🦂',
//     'Стрелец': '🏹',
//     'Козерог': '🐐',
//     'Водолей': '💧',
//     'Рыбы': '🐟',
//   }

//   const elementBg: Record<string, string> = {
//     fire: 'from-red-100 to-orange-100',
//     earth: 'from-green-100 to-emerald-100',
//     air: 'from-blue-100 to-cyan-100',
//     water: 'from-indigo-100 to-purple-100',
//   }

//   return (
//     <Link href={`/zodiac/${sign.slug}`}>
//       <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100">
//         <div className={`aspect-square bg-gradient-to-br ${elementBg[sign.element as keyof typeof elementBg] || 'from-gray-100 to-gray-200'} flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300`}>
//           {zodiacEmojis[sign.name] || '⭐'}
//         </div>
//         <div className="p-4 text-center">
//           <h3 className="font-bold text-gray-800 group-hover:text-pink-500 transition">{sign.name}</h3>
//           <p className="text-xs text-gray-400 mt-1">{sign.start_date} — {sign.end_date}</p>
//         </div>
//       </div>
//     </Link>
//   )
// }