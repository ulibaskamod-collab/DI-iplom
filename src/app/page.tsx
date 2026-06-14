'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">StellarFit</h1>
        <p className="text-purple-300 text-lg mb-8">Астрология души и нарядов</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          {!session ? (
            <>
              <Link href="/auth/signin" className="px-6 py-2 bg-pink-500 rounded-full text-white">Войти</Link>
              <Link href="/auth/register" className="px-6 py-2 bg-purple-500 rounded-full text-white">Регистрация</Link>
            </>
          ) : (
            <Link href="/profile" className="px-6 py-2 bg-pink-500 rounded-full text-white">Мой профиль</Link>
          )}
        </div>
      </div>
    </div>
  )
}