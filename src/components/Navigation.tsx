'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Menu, X, Sparkles, User, LogOut, Shield, 
  Home, Star, Palette, ChevronRight, Heart,
  Shirt, Users, Upload, Globe, Settings
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
    { href: '/', label: 'Главная', icon: Home, color: '#60a5fa' },
    { href: '/zodiac', label: 'Все знаки', icon: Star, color: '#fbbf24' },
    { href: '/designers', label: 'Дизайнеры', icon: Palette, color: '#a78bfa' },
  ]

  const userItems = [
    { href: '/profile', label: 'Профиль', icon: User, color: '#f472b6' },
  ]

  const adminItems = [
    { href: '/admin', label: 'Главная', icon: Home, color: '#60a5fa' },
    { href: '/admin/zodiac', label: 'Знаки зодиака', icon: Star, color: '#fbbf24' },
    { href: '/admin/clothing', label: 'Одежда', icon: Shirt, color: '#34d399' },
    { href: '/admin/designers', label: 'Дизайнеры', icon: Palette, color: '#a78bfa' },
    { href: '/admin/bulk-upload', label: 'Массовая загрузка', icon: Upload, color: '#f472b6' },
    { href: '/admin/users', label: 'Пользователи', icon: Users, color: '#22d3ee' },
    { href: '/admin/favorites', label: 'Избранное', icon: Heart, color: '#fb7185' },
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
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />
      
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        {/* Верхняя часть с логотипом и закрытием */}
        <div className="mobile-header">
          <div className="mobile-brand">
            <div className="mobile-brand-icon">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="mobile-brand-text">StellarFit</span>
          </div>
          <button className="mobile-close" onClick={() => setIsOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Профиль пользователя */}
        {isAuthenticated && session?.user && (
          <div className="mobile-profile">
            <div className="mobile-avatar">
              {session.user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="mobile-profile-info">
              <p className="mobile-profile-email">{session.user.email}</p>
              <p className="mobile-profile-role">
                {isAdmin ? '👑 Администратор' : '👤 Пользователь'}
              </p>
            </div>
          </div>
        )}

        {/* Основные пункты меню */}
        <div className="mobile-section">
          <div className="mobile-section-label">Меню</div>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-link"
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={20} style={{ color: item.color }} />
              <span>{item.label}</span>
              <ChevronRight size={16} className="mobile-arrow" />
            </Link>
          ))}
          {isAuthenticated && userItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-link"
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={20} style={{ color: item.color }} />
              <span>{item.label}</span>
              <ChevronRight size={16} className="mobile-arrow" />
            </Link>
          ))}
        </div>

        {/* Админ-панель */}
        {isAdmin && (
          <div className="mobile-section">
            <div className="mobile-section-label admin-label">
              <Shield size={14} className="inline mr-2" />
              Администрирование
            </div>
            <Link
              href="/"
              className="mobile-link mobile-link-site"
              onClick={() => setIsOpen(false)}
            >
              <Globe size={20} className="text-green-400" />
              <span>На сайт</span>
              <ChevronRight size={16} className="mobile-arrow" />
            </Link>
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mobile-link"
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} style={{ color: item.color }} />
                <span>{item.label}</span>
                <ChevronRight size={16} className="mobile-arrow" />
              </Link>
            ))}
          </div>
        )}

        {/* Нижняя часть */}
        <div className="mobile-footer">
          <div className="mobile-divider" />
          {isAuthenticated ? (
            <button 
              onClick={() => {
                signOut()
                setIsOpen(false)
              }} 
              className="mobile-logout"
            >
              <LogOut size={20} className="text-red-400" />
              <span className="text-red-400">Выйти</span>
            </button>
          ) : (
            <div className="mobile-auth">
              <Link href="/auth/signin" className="mobile-auth-link" onClick={() => setIsOpen(false)}>
                <LogOut size={20} className="text-green-400" />
                <span>Войти</span>
              </Link>
              <Link href="/auth/register" className="mobile-auth-link register" onClick={() => setIsOpen(false)}>
                <span>Регистрация</span>
              </Link>
            </div>
          )}
          <p className="mobile-magic">✨ Пусть звёзды ведут тебя ✨</p>
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
          background: linear-gradient(160deg, #0a0a1a 0%, #0d0d25 40%, #0a0a1a 100%);
          backdrop-filter: blur(24px);
          z-index: 100;
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 0;
        }

        .mobile-menu.open {
          transform: translateX(0);
        }

        /* Затемнение */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 99;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }

        .mobile-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        /* ===== ВЕРХНЯЯ ЧАСТЬ ===== */
        .mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          flex-shrink: 0;
        }

        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .mobile-brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(236, 72, 153, 0.25);
        }

        .mobile-brand-text {
          background: linear-gradient(135deg, #f0c8a0, #e8b8a0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .mobile-close {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .mobile-close:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        /* ===== ПРОФИЛЬ ===== */
        .mobile-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          flex-shrink: 0;
        }

        .mobile-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
          color: white;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(236, 72, 153, 0.25);
        }

        .mobile-profile-info {
          flex: 1;
          min-width: 0;
        }

        .mobile-profile-email {
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mobile-profile-role {
          color: rgba(255, 255, 255, 0.35);
          font-size: 0.7rem;
          margin-top: 0.1rem;
        }

        /* ===== СЕКЦИИ ===== */
        .mobile-section {
          padding: 0.25rem 0;
          flex-shrink: 0;
        }

        .mobile-section-label {
          padding: 0.75rem 1.5rem 0.5rem;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.12);
          font-weight: 600;
        }

        .admin-label {
          color: rgba(236, 72, 153, 0.3);
          padding-top: 0.25rem;
        }

        /* ===== ССЫЛКИ ===== */
        .mobile-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.6rem 1.5rem;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-size: 0.9rem;
          border-radius: 0;
        }

        .mobile-link:hover {
          background: rgba(255, 255, 255, 0.04);
          color: white;
        }

        .mobile-link:active {
          transform: scale(0.97);
        }

        .mobile-arrow {
          margin-left: auto;
          color: rgba(255, 255, 255, 0.06);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .mobile-link:hover .mobile-arrow {
          transform: translateX(4px);
          color: rgba(255, 255, 255, 0.2);
        }

        .mobile-link-site {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          margin-bottom: 0.25rem;
        }

        .mobile-link-site span {
          color: rgba(255, 255, 255, 0.5);
        }

        /* ===== ФУТЕР ===== */
        .mobile-footer {
          margin-top: auto;
          padding: 1rem 1.5rem 1.5rem;
          flex-shrink: 0;
        }

        .mobile-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          margin-bottom: 1rem;
        }

        .mobile-logout {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.6rem 0;
          color: rgba(255, 107, 107, 0.6);
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
        }

        .mobile-logout:hover {
          background: rgba(255, 107, 107, 0.06);
          color: #ff6b6b;
        }

        .mobile-auth {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .mobile-auth-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.6rem 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.2s ease;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .mobile-auth-link:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .mobile-auth-link.register {
          padding-left: 2.75rem;
          color: rgba(255, 255, 255, 0.35);
          font-size: 0.85rem;
        }

        .mobile-magic {
          text-align: center;
          color: rgba(255, 255, 255, 0.06);
          font-size: 0.7rem;
          letter-spacing: 3px;
          font-family: 'Georgia', serif;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.02);
        }

        /* ===== СКРОЛЛБАР ===== */
        .mobile-menu::-webkit-scrollbar {
          width: 3px;
        }

        .mobile-menu::-webkit-scrollbar-track {
          background: transparent;
        }

        .mobile-menu::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        /* ===== АДАПТИВНОСТЬ ===== */
        @media (min-width: 769px) {
          .mobile-menu,
          .mobile-overlay {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-header {
            padding: 1rem 1.25rem 0.75rem;
          }
          
          .mobile-brand-text {
            font-size: 1rem;
          }
          
          .mobile-brand-icon {
            width: 32px;
            height: 32px;
          }
          
          .mobile-profile {
            padding: 1rem 1.25rem;
          }
          
          .mobile-avatar {
            width: 38px;
            height: 38px;
            font-size: 0.9rem;
          }
          
          .mobile-profile-email {
            font-size: 0.8rem;
          }
          
          .mobile-link {
            padding: 0.5rem 1.25rem;
            font-size: 0.85rem;
            gap: 0.75rem;
          }
          
          .mobile-section-label {
            padding: 0.5rem 1.25rem 0.35rem;
            font-size: 0.55rem;
          }
          
          .mobile-footer {
            padding: 0.75rem 1.25rem 1.25rem;
          }
          
          .mobile-magic {
            font-size: 0.6rem;
          }
        }
      `}</style>
    </>
  )
}