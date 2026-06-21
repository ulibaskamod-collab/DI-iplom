'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Menu, X, Sparkles, User, LogOut, Shield, 
  Home, Star, Palette, ChevronRight, Heart 
} from 'lucide-react'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

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
  const menuItems = [
    { href: '/', label: 'Главная', icon: Home, color: 'text-blue-400' },
    { href: '/zodiac', label: 'Все знаки', icon: Star, color: 'text-yellow-400' },
    { href: '/designers', label: 'Дизайнеры', icon: Palette, color: 'text-purple-400' },
  ]

  return (
    <>
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
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <User size={16} className="inline mr-1" />
                  Профиль
                </Link>
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
        </div>
      </nav>

      {/* ===== МОБИЛЬНОЕ МЕНЮ ===== */}
      <div className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />
      
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        {/* Заголовок с логотипом */}
        <div className="mobile-menu-header">
          <div className="mobile-menu-logo">
            <div className="mobile-logo-icon">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span>StellarFit</span>
          </div>
          <button className="mobile-menu-close" onClick={() => setIsOpen(false)}>
            <X size={22} />
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

        {/* Разделитель с декоративной линией */}
        <div className="mobile-menu-divider">
          <span className="divider-dots">✦ ✦ ✦</span>
        </div>

        {/* Пункты меню */}
        <div className="mobile-menu-items">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <span className={`mobile-item-icon ${item.color}`}>
                <item.icon size={20} />
              </span>
              <span className="mobile-item-label">{item.label}</span>
              <ChevronRight size={16} className="mobile-menu-arrow" />
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              href="/profile"
              className="mobile-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <span className="mobile-item-icon text-pink-400">
                <User size={20} />
              </span>
              <span className="mobile-item-label">Профиль</span>
              <ChevronRight size={16} className="mobile-menu-arrow" />
            </Link>
          )}

          {isAdmin && (
            <>
              <div className="mobile-menu-divider-light" />
              <Link
                href="/admin"
                className="mobile-menu-item mobile-menu-admin"
                onClick={() => setIsOpen(false)}
              >
                <span className="mobile-item-icon text-pink-400">
                  <Shield size={20} />
                </span>
                <span className="mobile-item-label">Админ панель</span>
                <ChevronRight size={16} className="mobile-menu-arrow text-pink-400/30" />
              </Link>
            </>
          )}

          <div className="mobile-menu-divider-light" />
          
          {isAuthenticated ? (
            <button 
              onClick={() => {
                signOut()
                setIsOpen(false)
              }} 
              className="mobile-menu-item mobile-menu-logout"
            >
              <span className="mobile-item-icon text-red-400">
                <LogOut size={20} />
              </span>
              <span className="mobile-item-label text-red-400">Выйти</span>
            </button>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="mobile-menu-item mobile-menu-auth"
                onClick={() => setIsOpen(false)}
              >
                <span className="mobile-item-icon text-green-400">
                  <LogOut size={20} />
                </span>
                <span className="mobile-item-label">Войти</span>
              </Link>
              <Link
                href="/auth/register"
                className="mobile-menu-item mobile-menu-register"
                onClick={() => setIsOpen(false)}
              >
                <span className="mobile-item-label ml-9">Регистрация</span>
              </Link>
            </>
          )}
        </div>

        {/* Нижняя часть с магической фразой */}
        <div className="mobile-menu-footer">
          <p className="mobile-footer-text">✨ Пусть звёзды ведут тебя ✨</p>
        </div>
      </div>

      <style jsx>{`
        /* ===== МОБИЛЬНОЕ МЕНЮ ===== */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, #0a0a1a 0%, #0d0d25 50%, #0a0a1a 100%);
          backdrop-filter: blur(20px);
          z-index: 100;
          transform: translateX(-100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 0;
        }

        .mobile-menu.open {
          transform: translateX(0);
        }

        /* Затемнение */
        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 99;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .mobile-menu-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        /* Заголовок */
        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .mobile-menu-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: bold;
        }

        .mobile-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-logo span {
          background: linear-gradient(135deg, #f0c8a0 0%, #e8b8a0 40%, #f0c8a0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mobile-menu-close {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 0.5rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        /* Информация о пользователе */
        .mobile-user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .mobile-user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
          color: white;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
        }

        .mobile-user-details {
          flex: 1;
          min-width: 0;
        }

        .mobile-user-email {
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mobile-user-role {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.75rem;
          margin-top: 0.1rem;
        }

        /* Разделители */
        .mobile-menu-divider {
          display: flex;
          justify-content: center;
          padding: 0.75rem 0;
          flex-shrink: 0;
        }

        .divider-dots {
          color: rgba(255, 255, 255, 0.08);
          font-size: 0.6rem;
          letter-spacing: 8px;
        }

        .mobile-menu-divider-light {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          margin: 0.25rem 1.5rem;
          flex-shrink: 0;
        }

        /* Пункты меню */
        .mobile-menu-items {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 0;
          flex: 1;
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1.5rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.25s ease;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-size: 1rem;
          border-radius: 0;
          position: relative;
        }

        .mobile-menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .mobile-menu-item:active {
          transform: scale(0.98);
        }

        .mobile-item-icon {
          width: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mobile-item-label {
          flex: 1;
        }

        .mobile-menu-arrow {
          margin-left: auto;
          color: rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .mobile-menu-item:hover .mobile-menu-arrow {
          transform: translateX(4px);
          color: rgba(255, 255, 255, 0.3);
        }

        .mobile-menu-admin {
          background: rgba(236, 72, 153, 0.05);
          border-top: 1px solid rgba(236, 72, 153, 0.1);
          border-bottom: 1px solid rgba(236, 72, 153, 0.1);
          margin: 0.25rem 0;
        }

        .mobile-menu-admin .mobile-item-label {
          color: #f0c8a0;
        }

        .mobile-menu-admin:hover {
          background: rgba(236, 72, 153, 0.1) !important;
        }

        .mobile-menu-logout .mobile-item-label {
          color: rgba(255, 107, 107, 0.7);
        }

        .mobile-menu-logout:hover {
          background: rgba(255, 107, 107, 0.08) !important;
        }

        .mobile-menu-logout:hover .mobile-item-label {
          color: #ff6b6b;
        }

        .mobile-menu-auth .mobile-item-label {
          color: rgba(255, 255, 255, 0.9);
        }

        .mobile-menu-register .mobile-item-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
        }

        /* Футер */
        .mobile-menu-footer {
          padding: 1.25rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          flex-shrink: 0;
          text-align: center;
        }

        .mobile-footer-text {
          color: rgba(255, 255, 255, 0.12);
          font-size: 0.75rem;
          letter-spacing: 2px;
          font-family: 'Georgia', serif;
        }

        /* Скрываем на десктопе */
        @media (min-width: 769px) {
          .mobile-menu,
          .mobile-menu-overlay {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-menu-header {
            padding: 1rem 1.25rem;
          }
          
          .mobile-user-info {
            padding: 1rem 1.25rem;
          }
          
          .mobile-user-avatar {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
          
          .mobile-user-email {
            font-size: 0.8rem;
          }
          
          .mobile-menu-item {
            padding: 0.7rem 1.25rem;
            font-size: 0.9rem;
          }
          
          .mobile-menu-footer {
            padding: 1rem 1.25rem;
          }
          
          .mobile-footer-text {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </>
  )
}