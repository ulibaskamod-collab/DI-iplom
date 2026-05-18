'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, Users, Star, Shirt, Palette, Heart, Sparkles } from 'lucide-react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)
  const [stats, setStats] = useState({
    users: 0,
    zodiacSigns: 0,
    clothingItems: 0,
    designers: 0,
    favorites: 0,
  })

  useEffect(() => {
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
            fetch('/api/admin/stats')
              .then(res => res.json())
              .then(data => {
                // Защита от некорректных данных
                setStats({
                  users: typeof data?.users === 'number' ? data.users : 0,
                  zodiacSigns: typeof data?.zodiacSigns === 'number' ? data.zodiacSigns : 0,
                  clothingItems: typeof data?.clothingItems === 'number' ? data.clothingItems : 0,
                  designers: typeof data?.designers === 'number' ? data.designers : 0,
                  favorites: typeof data?.favorites === 'number' ? data.favorites : 0,
                })
              })
              .catch(console.error)
          } else {
            router.push('/')
          }
        })
        .catch(() => router.push('/'))
        .finally(() => setChecking(false))
    }
  }, [session, status, router])

  if (status === 'loading' || checking) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Доступ запрещён</h1>
          <p className="text-gray-400 mb-4">У вас нет прав администратора</p>
          <Link href="/" className="text-pink-400 hover:text-pink-300">
            ← Вернуться на сайт
          </Link>
        </div>
      </div>
    )
  }

  const menuItems = [
    {
      title: 'Знаки зодиака',
      description: 'Редактировать описания, стили, цвета',
      icon: Star,
      href: '/admin/zodiac',
      color: 'from-yellow-500 to-orange-500',
      count: stats.zodiacSigns,
    },
    {
      title: 'Одежда',
      description: 'Добавлять, удалять и редактировать предметы',
      icon: Shirt,
      href: '/admin/clothing',
      color: 'from-green-500 to-emerald-500',
      count: stats.clothingItems,
    },
    {
      title: 'Дизайнеры',
      description: 'Управление дизайнерами и их работами',
      icon: Palette,
      href: '/admin/designers',
      color: 'from-purple-500 to-pink-500',
      count: stats.designers,
    },
    {
      title: 'Пользователи',
      description: 'Список пользователей и управление ролями',
      icon: Users,
      href: '/admin/users',
      color: 'from-blue-500 to-cyan-500',
      count: stats.users,
    },
    {
      title: 'Избранное',
      description: 'Статистика избранных товаров',
      icon: Heart,
      href: '/admin/favorites',
      color: 'from-red-500 to-pink-500',
      count: stats.favorites,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-pink-500" />
            <h1 className="text-4xl font-bold text-white">Панель управления</h1>
          </div>
          <p className="text-gray-400">
            Вы вошли как: <span className="text-pink-400">{session?.user?.email}</span>
            <span className="mx-2">|</span>
            Роль: <span className="text-green-400">Администратор</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.zodiacSigns}</p>
            <p className="text-yellow-300 text-xs">Знаков</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-4 border border-green-500/30 text-center">
            <Shirt className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.clothingItems}</p>
            <p className="text-green-300 text-xs">Одежды</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-500/30 text-center">
            <Palette className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.designers}</p>
            <p className="text-purple-300 text-xs">Дизайнеров</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-4 border border-blue-500/30 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.users}</p>
            <p className="text-blue-300 text-xs">Пользователей</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl p-4 border border-red-500/30 text-center">
            <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.favorites}</p>
            <p className="text-red-300 text-xs">Избранных</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white group-hover:text-pink-400 transition">
                  {item.title}
                </h2>
                {item.count > 0 && (
                  <span className="px-2 py-1 rounded-full bg-white/10 text-white/60 text-xs">
                    {item.count}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-2">{item.description}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
          >
            <Sparkles size={18} />
            Перейти на сайт
          </Link>
        </div>

      </div>
    </div>
  )
} 