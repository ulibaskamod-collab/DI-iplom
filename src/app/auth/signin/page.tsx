'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Неверный email или пароль')
      setLoading(false)
    } else {
      // Обновляем сессию и редиректим
      router.refresh()
      setTimeout(() => {
        router.push('/')
      }, 100)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="max-w-md w-full bg-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-700/50">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Вход</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-300 text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-purple-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-purple-800/50 border border-purple-600 focus:outline-none focus:border-pink-500 text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-purple-300 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-purple-800/50 border border-purple-600 focus:outline-none focus:border-pink-500 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-pink-500 rounded-lg text-white font-semibold hover:bg-pink-600 transition disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="text-center mt-6 text-purple-300 text-sm">
          Нет аккаунта?{' '}
          <Link href="/auth/register" className="text-pink-400 hover:text-pink-300">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}