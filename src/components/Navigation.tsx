'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Sparkles, User, LogOut, Star } from 'lucide-react'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const createStars = () => {
      const starsContainer = document.getElementById('starsCanvas')
      if (!starsContainer) return
      starsContainer.innerHTML = ''
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div')
        star.classList.add('star')
        star.style.width = Math.random() * 2 + 1 + 'px'
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

  return (
    <>
      <div id="starsCanvas" className="stars-container" />
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Sparkles className="w-5 h-5" style={{ color: '#FF6B6B' }} />
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
                <Link href="/auth/register" className="text-gray-500 hover:text-[#FF6B6B]" onClick={() => setIsOpen(false)}>
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