'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Menu, X, Sparkles, User, LogOut, Shield, 
  Home, Star, Palette, Heart, Crown, ChevronRight 
} from 'lucide-react'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Блокируем скролл при открытом меню
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

  // Меню для авторизованных пользователей
  const userMenuItems = [
    { href: '/', label: 'Главная', icon: Home },
    { href: '/zodiac', label: 'Все знаки', icon: Star },
    { href: '/designers', label: 'Дизайнеры', icon: Palette },
    { href: '/profile', label: 'Профиль', icon: User },
  ]

  // Меню для неавторизованных
  const guestMenuItems = [
    { href: '/', label: 'Главная', icon: Home },
    { href: '/zodiac', label: 'Все знаки', icon: Star },
    { href: '/designers', label: 'Дизайнеры', icon: Palette },
  ]

  // Если сессия еще загружается, показываем упрощенную навигацию
  if (status === 'loading' || !mounted) {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span>StellarFit</span>
          </Link>
        </div>
      </nav>
    )
  }

  const isAuthenticated = status === 'authenticated'
  const menuItems = isAuthenticated ? userMenuItems : guestMenuItems

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <Sparkles className="w-5 h-5 text-pink-400" />
          <span>StellarFit</span>
        </Link>

        <button 
          className="menu-btn" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Десктопное меню */}
        <div className="nav-links-desktop">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              <item.icon size={16} className="inline mr-1" />
              {item.label}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="text-pink-400 hover:text-pink-300">
                  <Shield size={16} className="inline mr-1" />
                  Админ панель
                </Link>
              )}
              <button onClick={() => signOut()} className="nav-auth-btn">
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

        {/* ===== МОБИЛЬНОЕ МЕНЮ (как у админки) ===== */}
        <div className={`nav-links-mobile ${isOpen ? 'open' : ''}`}>
          {/* Заголовок меню */}
          <div className="mobile-menu-header">
            <div className="mobile-menu-logo">
              <Sparkles className="w-6 h-6 text-pink-400" />
              <span>StellarFit</span>
            </div>
            <button 
              className="mobile-menu-close"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Информация о пользователе */}
          {isAuthenticated && session?.user && (
            <div className="mobile-user-info">
              <div className="mobile-user-avatar">
                {session.user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="mobile-user-details">
                <p className="mobile-user-email">{session.user.email}</p>
                <p className="mobile-user-role">
                  {isAdmin ? '👑 Администратор' : '👤 Пользователь'}
                </p>
              </div>
            </div>
          )}

          {/* Разделитель */}
          <div className="mobile-menu-divider" />

          {/* Пункты меню */}
          <div className="mobile-menu-items">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-menu-item"
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                <ChevronRight size={16} className="ml-auto text-white/20" />
              </Link>
            ))}
          </div>

          {/* Разделитель для админки */}
          {isAdmin && (
            <>
              <div className="mobile-menu-divider" />
              <Link
                href="/admin"
                className="mobile-menu-item mobile-menu-admin"
                onClick={() => setIsOpen(false)}
              >
                <Shield size={20} className="text-pink-400" />
                <span className="text-pink-400">Админ панель</span>
                <ChevronRight size={16} className="ml-auto text-pink-400/30" />
              </Link>
            </>
          )}

          {/* Кнопка выхода/входа */}
          <div className="mobile-menu-divider" />
          
          {isAuthenticated ? (
            <button 
              onClick={() => {
                signOut()
                setIsOpen(false)
              }} 
              className="mobile-menu-item mobile-menu-logout"
            >
              <LogOut size={20} className="text-red-400" />
              <span className="text-red-400">Выйти</span>
            </button>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="mobile-menu-item mobile-menu-auth"
                onClick={() => setIsOpen(false)}
              >
                <LogOut size={20} />
                <span>Войти</span>
              </Link>
              <Link
                href="/auth/register"
                className="mobile-menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="ml-7">Регистрация</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Стили для мобильного меню */}
      <style jsx>{`
        .nav-links-mobile {
          position: fixed;
          top: 0;
          right: -320px;
          bottom: 0;
          width: 320px;
          max-width: 85vw;
          background: linear-gradient(180deg, #1a0a2a 0%, #0d0d25 100%);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.6);
          z-index: 100;
          transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow-y: auto;
        }

        .nav-links-mobile.open {
          right: 0;
        }

        /* Заголовок меню */
        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-menu-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: bold;
          color: white;
        }

        .mobile-menu-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: background 0.3s ease;
        }

        .mobile-menu-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Информация о пользователе */
        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1rem;
          color: white;
          flex-shrink: 0;
        }

        .mobile-user-details {
          flex: 1;
          min-width: 0;
        }

        .mobile-user-email {
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          truncate: true;
        }

        .mobile-user-role {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.75rem;
          margin-top: 0.1rem;
        }

        /* Разделитель */
        .mobile-menu-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin: 0.25rem 1.5rem;
        }

        /* Пункты меню */
        .mobile-menu-items {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 0;
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-size: 0.95rem;
        }

        .mobile-menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .mobile-menu-item svg {
          flex-shrink: 0;
        }

        .mobile-menu-admin {
          color: #f0c8a0 !important;
        }

        .mobile-menu-admin:hover {
          background: rgba(240, 200, 160, 0.08) !important;
        }

        .mobile-menu-logout {
          color: rgba(255, 107, 107, 0.7) !important;
        }

        .mobile-menu-logout:hover {
          background: rgba(255, 107, 107, 0.08) !important;
          color: #ff6b6b !important;
        }

        .mobile-menu-auth {
          color: rgba(255, 255, 255, 0.8) !important;
        }

        /* Затемнение фона */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .mobile-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        /* Скрываем мобильное меню на десктопе */
        @media (min-width: 769px) {
          .nav-links-mobile {
            display: none !important;
          }
        }

        /* Показываем только на мобильных */
        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none !important;
          }
        }
      `}</style>

      {/* Затемнение */}
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />
    </nav>
  )
}