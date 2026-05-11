// 'use client'

// import Link from 'next/link'

// // Хардкод данных (символы не зависят от API)
// const zodiacSigns = [
//   { id: 1, name: 'Овен', slug: 'oven', symbol: '♈', start_date: '21.03', end_date: '19.04' },
//   { id: 2, name: 'Телец', slug: 'telec', symbol: '♉', start_date: '20.04', end_date: '20.05' },
//   { id: 3, name: 'Близнецы', slug: 'bliznetsy', symbol: '♊', start_date: '21.05', end_date: '20.06' },
//   { id: 4, name: 'Рак', slug: 'rak', symbol: '♋', start_date: '21.06', end_date: '22.07' },
//   { id: 5, name: 'Лев', slug: 'lev', symbol: '♌', start_date: '23.07', end_date: '22.08' },
//   { id: 6, name: 'Дева', slug: 'deva', symbol: '♍', start_date: '23.08', end_date: '22.09' },
//   { id: 7, name: 'Весы', slug: 'vesy', symbol: '♎', start_date: '23.09', end_date: '22.10' },
//   { id: 8, name: 'Скорпион', slug: 'skorpion', symbol: '♏', start_date: '23.10', end_date: '21.11' },
//   { id: 9, name: 'Стрелец', slug: 'strelets', symbol: '♐', start_date: '22.11', end_date: '21.12' },
//   { id: 10, name: 'Козерог', slug: 'kozerog', symbol: '♑', start_date: '22.12', end_date: '19.01' },
//   { id: 11, name: 'Водолей', slug: 'vodoley', symbol: '♒', start_date: '20.01', end_date: '18.02' },
//   { id: 12, name: 'Рыбы', slug: 'ryby', symbol: '♓', start_date: '19.02', end_date: '20.03' },
// ]

// export default function ZodiacPage() {
//   return (
//     <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0d0d25 50%, #0a0a1a 100%)' }}>
      
//       {/* Заголовок */}
//       <div className="text-center py-12 pt-20">
//         <h1 className="text-7xl md:text-8xl font-bold tracking-wider" style={{
//           background: 'linear-gradient(135deg, #FF1493, #FF69B4, #DA70D6, #9370DB)',
//           WebkitBackgroundClip: 'text',
//           backgroundClip: 'text',
//           color: 'transparent',
//           textShadow: '0 0 30px rgba(255,20,147,0.5)'
//         }}>
//           Aempodlul
//         </h1>
//         <p className="text-pink-400 text-xl mt-3 font-light tracking-wide">YY C21 wapma- 19 anpens.</p>
//         <p className="text-purple-300 text-sm mt-2 tracking-wider">O6eH | TaabHaa | AusaxHepbl | Acmponozus</p>
//       </div>

//       {/* Сетка знаков зодиака */}
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
//           {zodiacSigns.map((sign: any) => (
//             <Link href={`/zodiac/${sign.slug}`} key={sign.id}>
//               <div className="group relative bg-purple-900/20 backdrop-blur-sm rounded-2xl p-5 text-center border border-purple-700/30 hover:border-pink-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-purple-900/40">
//                 <div className="text-6xl mb-3 drop-shadow-lg group-hover:drop-shadow-xl transition-all">
//                   {sign.symbol}
//                 </div>
//                 <div className="text-white text-lg font-semibold group-hover:text-pink-400 transition">
//                   {sign.name}
//                 </div>
//                 <div className="text-purple-400 text-xs mt-1 opacity-70 group-hover:opacity-100">
//                   {sign.start_date} - {sign.end_date}
//                 </div>
//                 <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <div className="w-8 h-0.5 bg-pink-500 rounded-full"></div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

      
//     </div>
//   )
// }