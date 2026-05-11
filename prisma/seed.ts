import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Знаки зодиака
  await prisma.zodiacSign.createMany({
    data: [
      { name: 'Овен', slug: 'oven', element: 'fire', start_date: '21.03', end_date: '19.04', description: 'Пионер и воин. Первый знак зодиака.', style_desc: 'Авангард и динамика.', colors: ['Красный', 'Оранжевый'] },
      { name: 'Телец', slug: 'telec', element: 'earth', start_date: '20.04', end_date: '20.05', description: 'Чувственность и любовь к роскоши.', style_desc: 'Натуральные ткани.', colors: ['Зеленый', 'Коричневый'] },
      { name: 'Близнецы', slug: 'bliznetsy', element: 'air', start_date: '21.05', end_date: '20.06', description: 'Коммуникабельность и жажда перемен.', style_desc: 'Смешение стилей.', colors: ['Желтый', 'Голубой'] },
      { name: 'Рак', slug: 'rak', element: 'water', start_date: '21.06', end_date: '22.07', description: 'Эмпатия и любовь к дому.', style_desc: 'Мягкие драпировки.', colors: ['Белый', 'Серебряный'] },
      { name: 'Лев', slug: 'lev', element: 'fire', start_date: '23.07', end_date: '22.08', description: 'Величественный и страстный.', style_desc: 'Роскошь и блеск.', colors: ['Золотой', 'Оранжевый'] },
      { name: 'Дева', slug: 'deva', element: 'earth', start_date: '23.08', end_date: '22.09', description: 'Элегантность и порядок.', style_desc: 'Минимализм.', colors: ['Серый', 'Бежевый'] },
      { name: 'Весы', slug: 'vesy', element: 'air', start_date: '23.09', end_date: '22.10', description: 'Гармония и эстетика.', style_desc: 'Изысканность.', colors: ['Розовый', 'Голубой'] },
      { name: 'Скорпион', slug: 'skorpion', element: 'water', start_date: '23.10', end_date: '21.11', description: 'Страсть и магнетизм.', style_desc: 'Темная элегантность.', colors: ['Черный', 'Бордовый'] },
      { name: 'Стрелец', slug: 'strelets', element: 'fire', start_date: '22.11', end_date: '21.12', description: 'Свобода и оптимизм.', style_desc: 'Этнические мотивы.', colors: ['Синий', 'Коричневый'] },
      { name: 'Козерог', slug: 'kozerog', element: 'earth', start_date: '22.12', end_date: '19.01', description: 'Дисциплина и амбиции.', style_desc: 'Классика.', colors: ['Серый', 'Изумрудный'] },
      { name: 'Водолей', slug: 'vodoley', element: 'air', start_date: '20.01', end_date: '18.02', description: 'Инновации и свобода.', style_desc: 'Авангард.', colors: ['Синий', 'Серебряный'] },
      { name: 'Рыбы', slug: 'ryby', element: 'water', start_date: '19.02', end_date: '20.03', description: 'Интуиция и творчество.', style_desc: 'Романтика.', colors: ['Бирюзовый', 'Фиолетовый'] },
    ],
  })

  console.log('✅ Знаки зодиака добавлены!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())