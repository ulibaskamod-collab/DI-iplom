'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Sparkles, User, LogOut, Shield, Home, Star, Palette } from 'lucide-react'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Закрываем меню при нажатии Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  if (status === 'loading') {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
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
        <Link href="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <Sparkles className="w-5 h-5 text-pink-400" />
          StellarFit
        </Link>

        <button 
          className="menu-btn" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Home size={18} className="inline mr-2" />
            Главная
          </Link>

          <Link href="/zodiac" onClick={() => setIsOpen(false)}>
            <Star size={18} className="inline mr-2" />
            Все знаки
          </Link>

          <Link href="/designers" onClick={() => setIsOpen(false)}>
            <Palette size={18} className="inline mr-2" />
            Дизайнеры
          </Link>

          {status === 'authenticated' ? (
            <>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsOpen(false)} 
                  className="text-pink-400 hover:text-pink-300"
                >
                  <Shield size={18} className="inline mr-2" />
                  Админ панель
                </Link>
              )}
              <Link href="/profile" onClick={() => setIsOpen(false)}>
                <User size={18} className="inline mr-2" />
                Профиль
              </Link>
              <button 
                onClick={() => {
                  signOut()
                  setIsOpen(false)
                }} 
                className="nav-auth-btn"
              >
                <LogOut size={18} />
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
  )
}