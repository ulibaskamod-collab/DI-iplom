'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Mail, Lock, Eye, EyeOff, Star } from 'lucide-react'

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
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="auth-title">StellarFit</h1>
          <p className="auth-subtitle">Войдите в свой аккаунт</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-300 text-sm mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input pl-10"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-300 text-sm mb-2">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input pl-10 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-purple-400" />
                ) : (
                  <Eye className="w-5 h-5 text-purple-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-btn mt-6"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-purple-300 text-sm">
            Нет аккаунта?{' '}
            <Link href="/auth/register" className="auth-link">
              Зарегистрироваться
            </Link>
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
      </div>
    </div>
  )
}