const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Начинаем восстановление базы данных...')

  // 1. Очищаем все таблицы
  console.log('🗑️ Очищаем таблицы...')
  await prisma.$executeRaw`TRUNCATE TABLE favorites CASCADE;`
  await prisma.$executeRaw`TRUNCATE TABLE designer_works CASCADE;`
  await prisma.$executeRaw`TRUNCATE TABLE clothing_items CASCADE;`
  await prisma.$executeRaw`TRUNCATE TABLE designers CASCADE;`
  await prisma.$executeRaw`TRUNCATE TABLE zodiac_signs CASCADE;`
  await prisma.$executeRaw`TRUNCATE TABLE users CASCADE;`
  console.log('✅ Таблицы очищены')

  // 2. Добавляем знаки зодиака
  console.log('⭐ Добавляем знаки зодиака...')
  const zodiacSigns = await prisma.ZodiacSign.createMany({
    data: [
      { name: 'Овен', slug: 'oven', element: 'fire', start_date: '21.03', end_date: '19.04' },
      { name: 'Телец', slug: 'telec', element: 'earth', start_date: '20.04', end_date: '20.05' },
      { name: 'Близнецы', slug: 'bliznetsy', element: 'air', start_date: '21.05', end_date: '20.06' },
      { name: 'Рак', slug: 'rak', element: 'water', start_date: '21.06', end_date: '22.07' },
      { name: 'Лев', slug: 'lev', element: 'fire', start_date: '23.07', end_date: '22.08' },
      { name: 'Дева', slug: 'deva', element: 'earth', start_date: '23.08', end_date: '22.09' },
      { name: 'Весы', slug: 'vesy', element: 'air', start_date: '23.09', end_date: '22.10' },
      { name: 'Скорпион', slug: 'skorpion', element: 'water', start_date: '23.10', end_date: '21.11' },
      { name: 'Стрелец', slug: 'strelets', element: 'fire', start_date: '22.11', end_date: '21.12' },
      { name: 'Козерог', slug: 'kozerog', element: 'earth', start_date: '22.12', end_date: '19.01' },
      { name: 'Водолей', slug: 'vodoley', element: 'air', start_date: '20.01', end_date: '18.02' },
      { name: 'Рыбы', slug: 'ryby', element: 'water', start_date: '19.02', end_date: '20.03' },
    ]
  })
  console.log(`✅ Добавлено ${zodiacSigns.count} знаков зодиака`)

  // 3. Добавляем администратора
  console.log('👑 Добавляем администратора...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.users.create({
    data: {
      email: 'admin@stellarfit.ru',
      name: 'Admin',
      password: hashedPassword,
      user_role: 'admin',
    }
  })
  console.log('✅ Администратор создан: admin@stellarfit.ru / admin123')

  // 4. Добавляем тестового пользователя
  console.log('👤 Добавляем тестового пользователя...')
  const userPassword = await bcrypt.hash('user123', 10)
  
  await prisma.users.create({
    data: {
      email: 'user@stellarfit.ru',
      name: 'User',
      password: userPassword,
      user_role: 'user',
      birth_date: new Date('2000-08-09'),
      gender: 'female',
      zodiac_sign: 'Лев',
    }
  })
  console.log('✅ Тестовый пользователь создан: user@stellarfit.ru / user123')

  // 5. Добавляем дизайнеров (без фото)
  console.log('🎨 Добавляем дизайнеров...')
  const designers = await prisma.designers.createMany({
    data: [
      { 
        designer_name: 'Коко Шанель', 
        bio: 'Икона элегантности, освободившая женщин от корсетов. Габриэль Бонёр Шанель произвела революцию в мире моды, подарив женщинам удобную и элегантную одежду. Её знаменитое маленькое чёрное платье, твидовые костюмы и духи Chanel No.5 навсегда изменили представление о стиле.',
        designer_image: '',
        social_links: { instagram: 'https://instagram.com/chanelofficial' }
      },
      { 
        designer_name: 'Ив Сен-Лоран', 
        bio: 'Революционер моды, создатель женского смокинга Le Smoking. Ив Анри Донатьё Матьё Сен-Лоран показал миру, что женщины могут быть одновременно элегантными, сильными и сексуальными.',
        designer_image: '',
        social_links: { instagram: 'https://instagram.com/ysl' }
      },
      { 
        designer_name: 'Александр Маккуин', 
        bio: 'Тёмный гений британской моды, мастер драмы и театральности. Ли Александр Маккуин превращал показы в захватывающие шоу, а одежду — в произведения искусства.',
        designer_image: '',
        social_links: { instagram: 'https://instagram.com/alexandermcqueen' }
      },
      { 
        designer_name: 'Джорджо Армани', 
        bio: 'Король сдержанной роскоши и безупречного кроя. Джорджо Армани создал эстетику расслабленной элегантности, сделав одежду невероятно комфортной.',
        designer_image: '',
        social_links: { instagram: 'https://instagram.com/giorgioarmani' }
      },
      { 
        designer_name: 'Кристиан Диор', 
        bio: 'Создатель стиля New Look, вернувший женственность в послевоенную моду. Кристиан Диор напомнил миру о роскоши и красоте после Второй мировой войны.',
        designer_image: '',
        social_links: { instagram: 'https://instagram.com/dior' }
      },
    ]
  })
  console.log(`✅ Добавлено ${designers.count} дизайнеров`)

  // 6. Добавляем тестовую одежду для каждого знака
  console.log('👕 Добавляем тестовую одежду...')
  
  // Получаем ID знаков
  const signs = await prisma.ZodiacSign.findMany()
  const signMap = {}
  signs.forEach(s => { signMap[s.name] = s.id })

  // ⚡ ИСПРАВЛЕНО: используем ClothingItem (с большой буквы)
  const clothingItemsData = [
    // Овен
    { title: 'Кожаная куртка-косуха', description: 'Классическая черная кожаная куртка с металлическими заклепками', season: 'autumn', gender: 'unisex', zodiac_sign_id: signMap['Овен'] },
    { title: 'Спортивный костюм', description: 'Яркий красный спортивный костюм для активных тренировок', season: 'summer', gender: 'unisex', zodiac_sign_id: signMap['Овен'] },
    // Телец
    { title: 'Кашемировый свитер', description: 'Мягкий кашемировый свитер нежно-зеленого цвета', season: 'winter', gender: 'unisex', zodiac_sign_id: signMap['Телец'] },
    { title: 'Классические брюки', description: 'Брюки из натуральной ткани идеального кроя', season: 'spring', gender: 'female', zodiac_sign_id: signMap['Телец'] },
    // Близнецы
    { title: 'Джинсы с вышивкой', description: 'Модные джинсы с яркой вышивкой и потертостями', season: 'summer', gender: 'unisex', zodiac_sign_id: signMap['Близнецы'] },
    { title: 'Свитшот с принтом', description: 'Уютный свитшот с абстрактным принтом', season: 'autumn', gender: 'unisex', zodiac_sign_id: signMap['Близнецы'] },
    // Рак
    { title: 'Шелковое платье', description: 'Нежное шелковое платье пастельного оттенка', season: 'summer', gender: 'female', zodiac_sign_id: signMap['Рак'] },
    { title: 'Уютный кардиган', description: 'Мягкий кардиган крупной вязки для домашнего уюта', season: 'winter', gender: 'female', zodiac_sign_id: signMap['Рак'] },
    // Лев
    { title: 'Золотое платье с пайетками', description: 'Роскошное платье с золотыми пайетками для особых мероприятий', season: 'summer', gender: 'female', zodiac_sign_id: signMap['Лев'] },
    { title: 'Бархатный блейзер', description: 'Элегантный блейзер из мягкого бархата', season: 'autumn', gender: 'unisex', zodiac_sign_id: signMap['Лев'] },
    // Дева
    { title: 'Белая рубашка', description: 'Классическая белая рубашка идеального кроя', season: 'spring', gender: 'unisex', zodiac_sign_id: signMap['Дева'] },
    { title: 'Платье-футляр', description: 'Элегантное платье-футляр из натурального шелка', season: 'summer', gender: 'female', zodiac_sign_id: signMap['Дева'] },
    // Весы
    { title: 'Розовое платье', description: 'Нежное платье пудрово-розового цвета с кружевными вставками', season: 'summer', gender: 'female', zodiac_sign_id: signMap['Весы'] },
    { title: 'Жакет с пайетками', description: 'Изысканный жакет с пайетками для особых случаев', season: 'autumn', gender: 'female', zodiac_sign_id: signMap['Весы'] },
    // Скорпион
    { title: 'Черная кожаная юбка', description: 'Стильная кожаная юбка темного оттенка', season: 'autumn', gender: 'female', zodiac_sign_id: signMap['Скорпион'] },
    { title: 'Платье-комбинация', description: 'Элегантное платье-комбинация из черного шелка', season: 'summer', gender: 'female', zodiac_sign_id: signMap['Скорпион'] },
    // Стрелец
    { title: 'Кожаная куртка с бахромой', description: 'Стильная кожаная куртка с бахромой в этническом стиле', season: 'autumn', gender: 'unisex', zodiac_sign_id: signMap['Стрелец'] },
    { title: 'Свободный комбинезон', description: 'Удобный комбинезон свободного кроя', season: 'summer', gender: 'unisex', zodiac_sign_id: signMap['Стрелец'] },
    // Козерог
    { title: 'Классический костюм', description: 'Идеальный классический костюм из качественной ткани', season: 'spring', gender: 'unisex', zodiac_sign_id: signMap['Козерог'] },
    { title: 'Кашемировое пальто', description: 'Элегантное кашемировое пальто классического фасона', season: 'winter', gender: 'unisex', zodiac_sign_id: signMap['Козерог'] },
    // Водолей
    { title: 'Неоновый свитшот', description: 'Яркий свитшот с неоновым принтом', season: 'spring', gender: 'unisex', zodiac_sign_id: signMap['Водолей'] },
    { title: 'Асимметричное платье', description: 'Платье необычного кроя с асимметричными элементами', season: 'summer', gender: 'female', zodiac_sign_id: signMap['Водолей'] },
    // Рыбы
    { title: 'Шифоновое платье', description: 'Невесомое шифоновое платье с морским принтом', season: 'summer', gender: 'female', zodiac_sign_id: signMap['Рыбы'] },
    { title: 'Перламутровая блуза', description: 'Изысканная блуза с перламутровым отливом', season: 'spring', gender: 'female', zodiac_sign_id: signMap['Рыбы'] },
  ]

  // ⚡ ИСПОЛЬЗУЕМ ClothingItem (модель с большой буквы)
  const result = await prisma.ClothingItem.createMany({
    data: clothingItemsData
  })
  console.log(`✅ Добавлено ${result.count} предметов одежды`)

  console.log('\n🎉 БАЗА ДАННЫХ ВОССТАНОВЛЕНА!')
  console.log('📊 Итог:')
  console.log(`   - ${zodiacSigns.count} знаков зодиака`)
  console.log(`   - 2 пользователя (админ + тестовый)`)
  console.log(`   - ${designers.count} дизайнеров`)
  console.log(`   - ${result.count} предметов одежды`)
  console.log('\n🔑 Вход в админку: admin@stellarfit.ru / admin123')
  console.log('👤 Вход для пользователя: user@stellarfit.ru / user123')
}

main()
  .catch((error) => {
    console.error('❌ Ошибка:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())