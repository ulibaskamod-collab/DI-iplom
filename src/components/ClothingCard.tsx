// 'use client'

// import FavoriteButton from './FavoriteButton'

// interface ClothingCardProps {
//   item: {
//     id: number
//     title: string
//     description: string
//     imageUrl: string
//     season: string
//     gender: string
//   }
// }

// export default function ClothingCard({ item }: ClothingCardProps) {
//   const seasonEmoji = {
//     winter: '❄️',
//     spring: '🌸',
//     summer: '☀️',
//     autumn: '🍂',
//   }

//   return (
//     <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
//       <div className="relative aspect-[3/4] bg-gray-100">
//         <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
//         <div className="absolute top-2 right-2">
//           <FavoriteButton itemId={item.id} />
//         </div>
//       </div>
//       <div className="p-4">
//         <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
//         <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
//         <div className="flex gap-2 mt-2 text-xs text-gray-400">
//           <span>{seasonEmoji[item.season as keyof typeof seasonEmoji]} {item.season}</span>
//           <span>•</span>
//           <span>{item.gender === 'female' ? '👩 Женский' : item.gender === 'male' ? '👨 Мужской' : '👥 Унисекс'}</span>
//         </div>
//       </div>
//     </div>
//   )
// }