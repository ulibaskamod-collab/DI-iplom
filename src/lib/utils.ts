import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'  // ← ПРАВИЛЬНО: tailwind-merge

/**
 * Объединяет классы Tailwind с поддержкой условных классов
 * Использование: cn('bg-red-500', isActive && 'bg-blue-500', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Форматирует дату в читаемый формат
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Обрезает текст до указанной длины
 */
export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Генерирует slug из строки
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s]/g, '')
    .replace(/\s+/g, '-')
}

/**
 * Проверяет, является ли значение пустым
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Безопасно получает вложенное значение из объекта
 */
export function getNestedValue(obj: any, path: string, defaultValue: any = undefined): any {
  const keys = path.split('.')
  let result = obj
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue
    result = result[key]
  }
  return result === undefined ? defaultValue : result
}

/**
 * Копирует текст в буфер обмена
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * Получает цветовую схему для знака зодиака
 */
export function getZodiacColor(sign: string): string {
  const colors: Record<string, string> = {
    'Овен': '#FF4500',
    'Телец': '#2ECC71',
    'Близнецы': '#FFD700',
    'Рак': '#6C5CE7',
    'Лев': '#FFD700',
    'Дева': '#95A5A6',
    'Весы': '#FFB6C1',
    'Скорпион': '#FF6B6B',
    'Стрелец': '#8A2BE2',
    'Козерог': '#708090',
    'Водолей': '#00FFFF',
    'Рыбы': '#48D1CC',
  }
  return colors[sign] || '#FFFFFF'
}

/**
 * Получает эмодзи для знака зодиака
 */
export function getZodiacEmoji(sign: string): string {
  const emojis: Record<string, string> = {
    'Овен': '♈',
    'Телец': '♉',
    'Близнецы': '♊',
    'Рак': '♋',
    'Лев': '♌',
    'Дева': '♍',
    'Весы': '♎',
    'Скорпион': '♏',
    'Стрелец': '♐',
    'Козерог': '♑',
    'Водолей': '♒',
    'Рыбы': '♓',
  }
  return emojis[sign] || '⭐'
}

/**
 * Получает slug для знака зодиака
 */
export function getZodiacSlug(sign: string): string {
  const slugs: Record<string, string> = {
    'Овен': 'oven',
    'Телец': 'telec',
    'Близнецы': 'bliznetsy',
    'Рак': 'rak',
    'Лев': 'lev',
    'Дева': 'deva',
    'Весы': 'vesy',
    'Скорпион': 'skorpion',
    'Стрелец': 'strelets',
    'Козерог': 'kozerog',
    'Водолей': 'vodoley',
    'Рыбы': 'ryby',
  }
  return slugs[sign] || ''
}

/**
 * Проверяет, является ли пользователь администратором
 */
export function isAdmin(role: string | null | undefined): boolean {
  return role === 'admin'
}

/**
 * Безопасно парсит JSON
 */
export function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}