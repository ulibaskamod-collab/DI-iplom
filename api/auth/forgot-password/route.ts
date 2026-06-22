import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email обязателен' }, { status: 400 })
    }

    const user = await prisma.users.findUnique({ where: { email } })

    // Для безопасности не сообщаем, существует пользователь или нет
    if (!user) {
      // Просто возвращаем успешный ответ, даже если пользователь не найден
      return NextResponse.json({ message: 'Если пользователь существует, инструкция отправлена' })
    }

    // TODO: Здесь нужно отправить email со ссылкой для сброса пароля
    // Пока просто логируем
    console.log(`Сброс пароля для: ${email}`)

    return NextResponse.json({ message: 'Инструкция отправлена на email' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
