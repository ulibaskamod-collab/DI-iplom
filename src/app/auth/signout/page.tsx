'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function SignOutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="max-w-md w-full bg-purple-900/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-700/50 text-center">
        <div className="text-6xl mb-4">👋</div>
        <h1 className="text-2xl font-bold text-white mb-2">Выход из аккаунта</h1>
        <p className="text-purple-300 text-sm mb-6">Вы уверены, что хотите выйти?</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Выход...' : 'Выйти'}
          </button>
          <Link
            href="/"
            className="flex-1 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
          >
            Остаться
          </Link>
        </div>
      </div>
    </div>
  )
}