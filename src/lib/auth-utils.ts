import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function getZodiacSign(birthDate: string): string {
  const date = new Date(birthDate)
  const month = date.getMonth() + 1
  const day = date.getDate()

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Овен'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Телец'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Близнецы'
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Рак'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Лев'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Дева'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Весы'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Скорпион'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Стрелец'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Козерог'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Водолей'
  return 'Рыбы'
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors = []

  if (password.length < 8) {
    errors.push('Пароль должен содержать минимум 8 символов')
  }
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну строчную букву')
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву')
  }
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну цифру')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}