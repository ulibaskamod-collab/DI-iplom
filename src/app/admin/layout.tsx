'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, Home, Star, Shirt, Palette, Users, Heart, LogOut } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.email) {
      fetch(`/api/user/role?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.role === 'admin') {
            setIsAdmin(true)
          } else {
            router.push('/')
          }
        })
        .catch(() => router.push('/'))
        .finally(() => setChecking(false))
    }
  }, [session, status, router])

  const menuItems = [
    { href: '/admin', label: 'Главная', icon: Home },
    { href: '/admin/zodiac', label: 'Знаки зодиака', icon: Star },
    { href: '/admin/clothing', label: 'Одежда', icon: Shirt },
    { href: '/admin/designers', label: 'Дизайнеры', icon: Palette },
    { href: '/admin/users', label: 'Пользователи', icon: Users },
    { href: '/admin/favorites', label: 'Избранное', icon: Heart },
  ]

  if (status === 'loading' || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="text-6xl mb-4">⛔</div>
          <h1 className="text-2xl font-bold text-white mb-2">Доступ запрещён</h1>
          <p className="text-gray-400 mb-4">У вас нет прав администратора</p>
          <Link href="/" className="text-pink-400 hover:text-pink-300">
            ← Вернуться на сайт
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-black/30 backdrop-blur-md border-r border-white/10 z-50">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2 text-xl font-bold text-white mb-8">
            <Shield className="w-6 h-6 text-pink-400" />
            Admin Panel
          </Link>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="border-t border-white/10 pt-4">
              <div className="text-white/50 text-sm mb-2 truncate">
                {session?.user?.email}
              </div>
              <Link
                href="/"
                className="flex items-center gap-2 text-white/50 hover:text-white transition"
              >
                <LogOut className="w-4 h-4" />
                На сайт
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  )
}