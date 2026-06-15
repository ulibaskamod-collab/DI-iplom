// src/app/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/src/lib/auth';
import HomePageAllSigns from './(home)/page';
import UserZodiacPage from '../components/UserZodiacPage';

// Функция для получения slug знака по его названию
function getSlugByZodiacName(zodiacName: string): string | null {
  const map: Record<string, string> = {
    Овен: 'oven',
    Телец: 'telec',
    Близнецы: 'bliznetsy',
    Рак: 'rak',
    Лев: 'lev',
    Дева: 'deva',
    Весы: 'vesy',
    Скорпион: 'skorpion',
    Стрелец: 'strelets',
    Козерог: 'kozerog',
    Водолей: 'vodoley',
    Рыбы: 'ryby',
  };
  return map[zodiacName] || null;
}

export default async function HomePage() {
  // Получаем сессию на сервере
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  // Если пользователь не авторизован — показываем каталог всех знаков
  if (!userEmail) {
    return <HomePageAllSigns />;
  }

  // Если авторизован — идём в базу за его знаком
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    const result = await pool.query(
      'SELECT zodiac_sign FROM users WHERE email = $1',
      [userEmail]
    );
    await pool.end(); // закрываем соединение

    const zodiacSign = result.rows[0]?.zodiac_sign;
    const slug = zodiacSign ? getSlugByZodiacName(zodiacSign) : null;

    if (slug) {
      // Показываем страницу нужного знака прямо на главной
      return <UserZodiacPage slug={slug} />;
    }

    // Если знак не найден (например, нет даты рождения) — показываем каталог
    return <HomePageAllSigns />;
  } catch (error) {
    console.error('❌ Ошибка при определении знака пользователя:', error);
    // В случае ошибки показываем каталог как fallback
    return <HomePageAllSigns />;
  }
}