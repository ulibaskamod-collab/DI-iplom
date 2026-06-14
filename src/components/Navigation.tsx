'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Sparkles, User, LogOut, Star, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/src/context/ThemeContext'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const createStars = () => {
      const starsContainer = document.getElementById('starsCanvas')
      if (!starsContainer) return
      starsContainer.innerHTML = ''
      for (let i = 0; i < 150; i++) {
        const star = document.createElement('div')
        star.classList.add('star')
        star.style.width = Math.random() * 3 + 1 + 'px'
        star.style.height = star.style.width
        star.style.left = Math.random() * 100 + '%'
        star.style.top = Math.random() * 100 + '%'
        star.style.animationDelay = Math.random() * 5 + 's'
        star.style.animationDuration = Math.random() * 3 + 2 + 's'
        starsContainer.appendChild(star)
      }
    }
    createStars()
  }, [])

  return (
    <>
      <div id="starsCanvas" className="stars-container" />
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Sparkles className="w-5 h-5" />
            StellarFit
          </Link>

          <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`nav-links ${isOpen ? 'open' : ''}`}>
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Sparkles size={16} className="inline mr-1" />
              Главная
            </Link>
            
            <Link href="/zodiac" onClick={() => setIsOpen(false)}>
              <Star size={16} className="inline mr-1" />
              Все знаки
            </Link>
            
            <Link href="/designers" onClick={() => setIsOpen(false)}>
              Дизайнеры
            </Link>

            {/* Кнопка переключения темы */}
            <button 
              onClick={toggleTheme} 
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition"
            >
              {theme === 'light' ? (
                <>
                  <Moon size={18} />
                  <span>Тёмная тема</span>
                </>
              ) : (
                <>
                  <Sun size={18} />
                  <span>Светлая тема</span>
                </>
              )}
            </button>

            {status === 'authenticated' ? (
              <>
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <User size={16} className="inline mr-1" />
                  Профиль
                </Link>
                <button onClick={() => signOut()} className="nav-auth-btn flex items-center gap-1">
                  <LogOut size={16} />
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="nav-auth-btn" onClick={() => setIsOpen(false)}>
                  Войти
                </Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}