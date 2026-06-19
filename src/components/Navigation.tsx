'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Sparkles, Stars, User, LogOut, Shield } from 'lucide-react'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Проверяем, является ли пользователь администратором
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/user/role?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          setIsAdmin(data.role === 'admin')
        })
        .catch(() => setIsAdmin(false))
    }
  }, [session])

  // Создаем звезды на фоне
  useEffect(() => {
    const createStars = () => {
      const starsContainer = document.getElementById('starsCanvas')
      if (!starsContainer) return
      starsContainer.innerHTML = ''
      for (let i = 0; i < 200; i++) {
        const star = document.createElement('div')
        star.classList.add('star')
        star.style.width = Math.random() * 3 + 1 + 'px'
        star.style.height = star.style.width
        star.style.left = Math.random() * 100 + '%'
        star.style.top = Math.random() * 100 + '%'
        star.style.animationDelay = Math.random() * 5 + 's'
        star.style.animationDuration = Math.random() * 2 + 1.5 + 's'
        starsContainer.appendChild(star)
      }
    }
    createStars()
  }, [])

  // Закрываем меню при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isOpen && !target.closest('.navbar') && !target.closest('.menu-btn')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  // Если сессия еще загружается, показываем упрощенную навигацию
  if (status === 'loading') {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            StellarFit
          </Link>
        </div>
      </nav>
    )
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <Sparkles className="w-5 h-5 text-pink-400" />
          StellarFit
        </Link>

        <button 
          className="menu-btn md:hidden block p-2 rounded-lg hover:bg-white/10 transition" 
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`
          nav-links 
          ${isOpen ? 'flex flex-col absolute top-full left-0 right-0 bg-purple-900/95 backdrop-blur-xl p-4 gap-3 border-b border-white/10 shadow-2xl' : 'hidden'}
          md:flex md:relative md:bg-transparent md:p-0 md:gap-6 md:border-none md:shadow-none
        `}>
          <Link href="/" onClick={() => setIsOpen(false)}>
            Главная
          </Link>

          <Link href="/zodiac" onClick={() => setIsOpen(false)}>
            Все знаки
          </Link>

          <Link href="/designers" onClick={() => setIsOpen(false)}>
            Дизайнеры
          </Link>

          {status === 'authenticated' ? (
            <>
              {/* Ссылка на админ-панель (только для администраторов) */}
              {isAdmin && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center gap-1 text-pink-400 hover:text-pink-300"
                >
                  <Shield size={16} className="inline mr-1" />
                  Админ панель
                </Link>
              )}
              <Link href="/profile" onClick={() => setIsOpen(false)}>
                <User size={16} className="inline mr-1" />
                Профиль
              </Link>
              <button 
                onClick={() => signOut()} 
                className="nav-auth-btn flex items-center gap-1"
              >
                <LogOut size={16} />
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="nav-auth-btn" onClick={() => setIsOpen(false)}>
                Войти
              </Link>
              <Link href="/auth/register" className="text-purple-300 hover:text-pink-400" onClick={() => setIsOpen(false)}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}