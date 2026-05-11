// 'use client'

// interface SeasonSelectorProps {
//   value: string
//   onChange: (season: string) => void
// }

// const seasons = [
//   { id: 'winter', label: 'Зима', emoji: '❄️' },
//   { id: 'spring', label: 'Весна', emoji: '🌸' },
//   { id: 'summer', label: 'Лето', emoji: '☀️' },
//   { id: 'autumn', label: 'Осень', emoji: '🍂' },
// ]

// export default function SeasonSelector({ value, onChange }: SeasonSelectorProps) {
//   return (
//     <div className="flex gap-2">
//       {seasons.map((season) => (
//         <button
//           key={season.id}
//           onClick={() => onChange(season.id)}
//           className={`px-4 py-2 rounded-lg font-medium transition ${
//             value === season.id
//               ? 'bg-pink-500 text-white shadow-md'
//               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//           }`}
//         >
//           <span className="mr-1">{season.emoji}</span>
//           {season.label}
//         </button>
//       ))}
//     </div>
//   )
// }