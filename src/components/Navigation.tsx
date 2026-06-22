'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Menu, X, Sparkles, User, LogOut, Shield, 
  Home, Star, Palette, ChevronRight, Heart,
  Shirt, Users, Upload, Globe
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
    { href: '/', label: 'Главная',  color: 'text-blue-400' },
    { href: '/zodiac', label: 'Все знаки',  color: 'text-yellow-400' },
    { href: '/designers', label: 'Дизайнеры',color: 'text-purple-400' },
  ]

  const adminItems = [
    { href: '/admin', label: 'Главная', icon: Home, color: 'text-blue-400' },
    { href: '/admin/zodiac', label: 'Знаки зодиака', icon: Star, color: 'text-yellow-400' },
    { href: '/admin/clothing', label: 'Одежда', icon: Shirt, color: 'text-green-400' },
    { href: '/admin/designers', label: 'Дизайнеры', icon: Palette, color: 'text-purple-400' },
    { href: '/admin/users', label: 'Пользователи', icon: Users, color: 'text-cyan-400' },
    { href: '/admin/favorites', label: 'Избранное', icon: Heart, color: 'text-red-400' },
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
        {/* Заголовок */}
        <div className="mobile-menu-header">
          <div className="mobile-menu-logo">
            <div className="mobile-logo-icon">
              <Shield className="w-5 h-5 text-white" />
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
                {isAdmin ? 'Администратор' : 'Пользователь'}
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
              <span>{item.label}</span>
              <ChevronRight size={16} className="mobile-menu-arrow" />
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              href="/profile"
              className="mobile-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <User size={20} className="text-pink-400" />
              <span>Профиль</span>
              <ChevronRight size={16} className="mobile-menu-arrow" />
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/"
              className="mobile-menu-item mobile-menu-site"
              onClick={() => setIsOpen(false)}
            >
              <Globe size={20} className="text-green-400" />
              <span>На сайт</span>
              <ChevronRight size={16} className="mobile-menu-arrow" />
            </Link>
          )}

          {isAdmin && (
            <>
              <div className="mobile-menu-divider-light" />
              <div className="mobile-menu-admin-label">
                <span>Админ панель</span>
              </div>
            </>
          )}

          {isAdmin && adminItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={20} className={item.color} />
              <span>{item.label}</span>
              <ChevronRight size={16} className="mobile-menu-arrow" />
            </Link>
          ))}

          <div className="mobile-menu-divider-light" />
          
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
                <LogOut size={20} className="text-green-400" />
                <span>Войти</span>
              </Link>
              <Link
                href="/auth/register"
                className="mobile-menu-item mobile-menu-register"
                onClick={() => setIsOpen(false)}
              >
                <span className="ml-9">Регистрация</span>
              </Link>
            </>
          )}
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

        .mobile-menu-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
          margin: 0.5rem 1.5rem;
          flex-shrink: 0;
        }

        .mobile-menu-divider-light {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent);
          margin: 0.25rem 1.5rem;
          flex-shrink: 0;
        }

        .mobile-menu-admin-label {
          padding: 0.5rem 1.5rem 0.25rem;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.15);
          font-weight: 600;
        }

        .mobile-menu-items {
          display: flex;
          flex-direction: column;
          padding: 0.25rem 0;
          flex: 1;
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.25s ease;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          font-size: 0.95rem;
          border-radius: 0;
        }

        .mobile-menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
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

        .mobile-menu-site {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 0.25rem;
        }

        .mobile-menu-site span {
          color: rgba(255, 255, 255, 0.6);
        }

        .mobile-menu-logout span {
          color: rgba(255, 107, 107, 0.7);
        }

        .mobile-menu-logout:hover {
          background: rgba(255, 107, 107, 0.08) !important;
        }

        .mobile-menu-logout:hover span {
          color: #ff6b6b;
        }

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
            padding: 0.65rem 1.25rem;
            font-size: 0.9rem;
          }
          
          .mobile-menu-admin-label {
            padding: 0.4rem 1.25rem 0.2rem;
            font-size: 0.55rem;
          }
          
          .mobile-menu-divider {
            margin: 0.4rem 1.25rem;
          }
          
          .mobile-menu-divider-light {
            margin: 0.2rem 1.25rem;
          }
        }
      `}</style>
    </>
  )
}