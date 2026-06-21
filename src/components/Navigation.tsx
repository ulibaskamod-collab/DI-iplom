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

  // Блокируем скролл при открытом меню на мобильных
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

  // Если сессия еще загружается, показываем упрощенную навигацию
  if (status === 'loading') {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span className="logo-text">StellarFit</span>
          </Link>
        </div>
      </nav>
    )
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <Sparkles className="w-5 h-5 text-pink-400 logo-sparkle" />
          <span className="logo-text">StellarFit</span>
        </Link>

        <button 
          className="menu-btn md:hidden block p-2 rounded-lg hover:bg-white/10 transition z-50" 
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </button>

        <div className={`
          nav-links 
          ${isOpen ? 'flex flex-col fixed top-0 left-0 right-0 bottom-0 bg-purple-900/95 backdrop-blur-xl p-8 gap-4 z-40 justify-center items-center' : 'hidden'}
          md:flex md:relative md:bg-transparent md:p-0 md:gap-6 md:flex-row md:justify-end md:items-center md:static md:backdrop-blur-none
        `}>
          <Link href="/" onClick={() => setIsOpen(false)} className="nav-link text-lg md:text-base">
            Главная
          </Link>

          <Link href="/zodiac" onClick={() => setIsOpen(false)} className="nav-link text-lg md:text-base">
            Все знаки
          </Link>

          <Link href="/designers" onClick={() => setIsOpen(false)} className="nav-link text-lg md:text-base">
            Дизайнеры
          </Link>

          {status === 'authenticated' ? (
            <>
              {/* Ссылка на админ-панель (только для администраторов) */}
              {isAdmin && (
                <Link 
                  href="/admin" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center gap-1 text-pink-400 hover:text-pink-300 nav-link text-lg md:text-base"
                >
                  <Shield size={16} className="inline mr-1" />
                  Админ панель
                </Link>
              )}
              <Link href="/profile" onClick={() => setIsOpen(false)} className="nav-link text-lg md:text-base">
                <User size={16} className="inline mr-1" />
                Профиль
              </Link>
              <button 
                onClick={() => signOut()} 
                className="nav-auth-btn flex items-center gap-1 text-lg md:text-base"
              >
                <LogOut size={16} />
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="nav-auth-btn text-lg md:text-base" onClick={() => setIsOpen(false)}>
                Войти
              </Link>
              <Link href="/auth/register" className="text-purple-300 hover:text-pink-400 nav-link text-lg md:text-base" onClick={() => setIsOpen(false)}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Стили для логотипа */}
      <style jsx>{`
        .logo-text {
          font-size: 1.5rem;
          font-weight: bold;
          background: linear-gradient(135deg, #f0c8a0 0%, #f5d4b0 20%, #e8b8a0 40%, #f0c8a0 60%, #e8b8a0 80%, #f0c8a0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 1px;
          font-family: 'Georgia', serif;
          text-shadow: 0 0 30px rgba(240, 200, 160, 0.1);
        }

        .logo-sparkle {
          color: #f0c8a0;
          filter: drop-shadow(0 0 8px rgba(240, 200, 160, 0.3));
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.3s ease;
          font-weight: 400;
        }

        .nav-link:hover {
          color: #f0c8a0;
        }

        /* Адаптивность для мобильных */
        @media (max-width: 768px) {
          .logo-text {
            font-size: 1.2rem;
          }
          
          .nav-links {
            gap: 1.5rem;
          }
          
          .nav-link {
            font-size: 1.2rem !important;
          }
          
          .nav-auth-btn {
            font-size: 1.2rem !important;
            padding: 0.75rem 2rem !important;
          }
        }

        @media (max-width: 480px) {
          .logo-text {
            font-size: 1rem;
          }
          
          .nav-link {
            font-size: 1rem !important;
          }
          
          .nav-auth-btn {
            font-size: 1rem !important;
            padding: 0.6rem 1.5rem !important;
          }
        }
      `}</style>
    </nav>
  )
}