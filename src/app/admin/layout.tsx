'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, Home, Star, Shirt, Palette, Users, Heart, LogOut, Menu, X } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  // Закрываем sidebar при клике вне его на мобильных
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (window.innerWidth < 768) {
        const target = e.target as HTMLElement
        if (!target.closest('.admin-sidebar') && !target.closest('.menu-toggle')) {
          setSidebarOpen(false)
        }
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

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
        <div className="text-center px-4">
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
    <div className="admin-page min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Мобильная кнопка меню */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="menu-toggle p-2 bg-purple-900/80 backdrop-blur-sm rounded-xl text-white border border-white/10 hover:bg-purple-800/80 transition"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Затемнение для мобильного меню */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar fixed left-0 top-0 h-full w-64 bg-black/30 backdrop-blur-md border-r border-white/10 z-50 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 h-full flex flex-col">
          <Link href="/admin" className="flex items-center gap-2 text-xl font-bold text-white mb-8" onClick={() => setSidebarOpen(false)}>
            <Shield className="w-6 h-6 text-pink-400" />
            <span className="hidden sm:inline">Admin Panel</span>
            <span className="sm:hidden">Admin</span>
          </Link>
          
          <nav className="space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm sm:text-base"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/10 pt-4 mt-auto">
            <div className="text-white/50 text-sm mb-2 truncate px-2">
              {session?.user?.email}
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-white/50 hover:text-white transition px-2 py-2 rounded-lg hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">На сайт</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-64 p-4 sm:p-6 md:p-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}