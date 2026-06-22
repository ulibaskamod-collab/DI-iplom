'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Shield, Home, Star, Shirt, Palette, Users, Heart,
  LogOut, Menu, X, ChevronRight, Sparkles, Globe,
  Upload
} from 'lucide-react'
import { AdminButton } from '@/src/components/AdminButton'

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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
  { href: '/admin', label: 'Главная', icon: Home, color: 'text-blue-400' },
  { href: '/admin/zodiac', label: 'Знаки зодиака', icon: Star, color: 'text-yellow-400' },
  { href: '/admin/clothing', label: 'Одежда', icon: Shirt, color: 'text-green-400' },
  { href: '/admin/designers', label: 'Дизайнеры', icon: Palette, color: 'text-purple-400' },
  { href: '/admin/bulk-upload', label: 'Массовая загрузка', icon: Upload, color: 'text-orange-400' }, 
  { href: '/admin/users', label: 'Пользователи', icon: Users, color: 'text-cyan-400' },
  { href: '/admin/favorites', label: 'Избранное', icon: Heart, color: 'text-red-400' },
]

  if (status === 'loading' || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
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
    <div className="admin-page min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Верхняя панель для мобильных */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-sm">Admin Panel</span>
          </Link>
          
          <AdminButton
            variant="ghost"
            size="sm"
            icon={sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu" children={undefined}          />
        </div>
      </header>

      {/* Затемнение */}
      {sidebarOpen && isMobile && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Сайдбар */}
      <div className={`
        fixed top-0 left-0 h-full w-[280px] bg-gray-900/95 backdrop-blur-xl border-r border-white/10 z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        flex flex-col
      `}>
        {/* Логотип */}
        <div className="p-5 border-b border-white/10">
          <Link
            href="/admin"
            className="flex items-center gap-3"
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white block">Admin Panel</span>
              <span className="text-xs text-white/40">StellarFit</span>
            </div>
          </Link>
        </div>

        {/* Меню */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 admin-sidebar">
          {/* Ссылка на главную страницу сайта */}
          <Link
            href="/"
            onClick={() => isMobile && setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-green-500/20 transition-all duration-200 group border border-white/5 hover:border-green-500/30"
          >
            <Globe className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">На сайт</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-white/30" />
          </Link>

          {/* Разделитель */}
          <div className="h-px bg-white/10 my-2" />

          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 group"
            >
              <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium">{item.label}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-white/30" />
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {session?.user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-sm truncate font-medium">
                {session?.user?.email}
              </p>
              <p className="text-white/30 text-xs">Администратор</p>
            </div>
          </div>
          
          {/* Кнопка "На сайт" в футере (дубль для удобства) */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 mt-3 text-white/40 hover:text-white/60 transition-colors text-sm px-3 py-2 rounded-xl hover:bg-white/5"
          >
            <Globe className="w-4 h-4" />
            Перейти на сайт
          </Link>
        </div>
      </div>

      {/* Основной контент */}
      <div className="lg:ml-[280px] min-h-screen">
        <div className="lg:hidden h-[64px]" />
        <div className="p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}