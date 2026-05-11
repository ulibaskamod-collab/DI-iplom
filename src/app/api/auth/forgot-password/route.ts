import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email обязателен' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ message: 'Если пользователь существует, инструкция отправлена' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 час

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    console.log(`Ссылка для сброса пароля: http://localhost:3000/auth/reset-password?token=${token}`)

    return NextResponse.json({ message: 'Инструкция отправлена на email' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}