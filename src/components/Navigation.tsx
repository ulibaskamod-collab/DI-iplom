'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Sparkles, Stars, User, LogOut, Shield } from 'lucide-react'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/user/role?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => setIsAdmin(data.role === 'admin'))
        .catch(() => setIsAdmin(false))
    }
  }, [session])

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

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <Sparkles className="w-5 h-5 text-pink-400" />
          StellarFit
        </Link>

        <button className="menu-btn max-md:block hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link href="/" onClick={() => setIsOpen(false)}>Главная</Link>
          <Link href="/zodiac" onClick={() => setIsOpen(false)}>Все знаки</Link>
          <Link href="/designers" onClick={() => setIsOpen(false)}>Дизайнеры</Link>

          {status === 'authenticated' ? (
            <>
              {isAdmin && <Link href="/admin" onClick={() => setIsOpen(false)}>Админ панель</Link>}
              <Link href="/profile" onClick={() => setIsOpen(false)}>Профиль</Link>
              <button onClick={() => signOut()} className="nav-auth-btn">Выйти</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="nav-auth-btn">Войти</Link>
              <Link href="/auth/register" className="text-purple-300 hover:text-pink-400">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}