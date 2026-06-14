'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5F0] to-[#FFE8E0] dark:from-[#0a0a1a] dark:to-[#0d0d25] py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] dark:from-[#FF1493] dark:to-[#FF69B4] rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">StellarFit</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Войдите в свой аккаунт</p>
        </div>

        <div className="bg-white dark:bg-[#141428] rounded-3xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a35] rounded-xl focus:outline-none focus:border-[#FF6B6B] dark:focus:border-[#FF1493] transition text-gray-800 dark:text-white"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a35] rounded-xl focus:outline-none focus:border-[#FF6B6B] dark:focus:border-[#FF1493] transition text-gray-800 dark:text-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] dark:from-[#FF1493] dark:to-[#FF69B4] text-white font-semibold rounded-xl hover:from-[#FF5252] hover:to-[#FF7575] dark:hover:from-[#FF1493]/80 dark:hover:to-[#FF69B4]/80 transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Нет аккаунта?{' '}
              <Link href="/auth/register" className="text-[#FF6B6B] dark:text-[#FF69B4] font-medium hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="flex justify-center gap-2">
            <Star className="w-4 h-4 text-[#FFB347] fill-[#FFB347]" />
            <Star className="w-4 h-4 text-[#FFB347] fill-[#FFB347]" />
            <Star className="w-4 h-4 text-[#FFB347] fill-[#FFB347]" />
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-3">
            Пусть звёзды ведут тебя ✨
          </p>
        </div>
      </div>
    </div>
  )
} 