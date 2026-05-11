'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Sparkles } from 'lucide-react'

export default function Navigation() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const createStars = () => {
      const starsContainer = document.getElementById('starsCanvas')
      if (!starsContainer) return
      starsContainer.innerHTML = ''
      const starCount = 200
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div')
        star.classList.add('star')
        const size = Math.random() * 3 + 1
        star.style.width = size + 'px'
        star.style.height = size + 'px'
        star.style.left = Math.random() * 100 + '%'
        star.style.top = Math.random() * 100 + '%'
        star.style.animationDelay = Math.random() * 5 + 's'
        star.style.animationDuration = Math.random() * 2 + 1.5 + 's'
        starsContainer.appendChild(star)
      }
      for (let i = 0; i < 10; i++) {
        const shooting = document.createElement('div')
        shooting.classList.add('shooting-star')
        shooting.style.left = Math.random() * 80 + 5 + '%'
        shooting.style.top = Math.random() * 40 + '%'
        shooting.style.animationDelay = Math.random() * 8 + 's'
        shooting.style.animationDuration = Math.random() * 4 + 4 + 's'
        starsContainer.appendChild(shooting)
      }
    }
    createStars()
    const handleResize = () => {
      const starsContainer = document.getElementById('starsCanvas')
      if (starsContainer) {
        starsContainer.innerHTML = ''
        createStars()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/designers', label: 'Дизайнеры' },
  ]

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <Sparkles className="w-5 h-5 text-pink-400" />
          StellarFit
        </Link>
        
        <button className="menu-btn hidden max-md:block" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className={`nav-links ${isOpen ? 'open max-md:flex max-md:flex-col max-md:absolute max-md:top-full max-md:left-0 max-md:right-0 max-md:bg-purple-900/95 max-md:p-4 max-md:gap-3' : 'max-md:hidden'}`}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
              {link.label}
            </Link>
          ))}
          
          {status === 'authenticated' ? (
            <>
              <Link href="/profile" onClick={() => setIsOpen(false)}>Профиль</Link>
              <Link href="/favorites" onClick={() => setIsOpen(false)}>Избранное</Link>
              <button onClick={() => signOut()} className="nav-auth-btn">
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