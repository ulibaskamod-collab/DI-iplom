'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AdminOnlyPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="p-8 text-white">Загрузка...</div>
  }

  if (!session) {
    return (
      <div className="p-8 text-white">
        <p>Вы не авторизованы. <Link href="/auth/signin" className="text-pink-400">Войти</Link></p>
      </div>
    )
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
      <p>Вы вошли как: <strong className="text-pink-400">{session.user.email}</strong></p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Link href="/admin/zodiac" className="bg-white/10 p-4 rounded-xl hover:bg-white/20">
          ⭐ Знаки зодиака
        </Link>
        <Link href="/admin/clothing" className="bg-white/10 p-4 rounded-xl hover:bg-white/20">
          👕 Одежда
        </Link>
        <Link href="/admin/designers" className="bg-white/10 p-4 rounded-xl hover:bg-white/20">
          🎨 Дизайнеры
        </Link>
        <Link href="/admin/users" className="bg-white/10 p-4 rounded-xl hover:bg-white/20">
          👥 Пользователи
        </Link>
        <Link href="/admin/favorites" className="bg-white/10 p-4 rounded-xl hover:bg-white/20">
          ❤️ Избранное
        </Link>
      </div>
    </div>
  )
}