'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Mail, Lock, User, Calendar, Venus, Mars, Eye, EyeOff, Star } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        birthDate: formData.birthDate,
        gender: formData.gender,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      router.push('/auth/signin?registered=true')
    } else {
      setError(data.error || 'Ошибка регистрации')
      setLoading(false)
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
          <p className="auth-subtitle">Создайте новый аккаунт</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-300 text-sm mb-2">Имя</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="auth-input pl-10"
                placeholder="Ваше имя"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-300 text-sm mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="auth-input pl-10"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-300 text-sm mb-2">Дата рождения</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="auth-input pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-300 text-sm mb-2">Пол</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-4 h-4 accent-purple-500"
                />
                <Venus className="w-4 h-4 text-pink-400" />
                <span className="text-purple-300">Женский</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-4 h-4 accent-purple-500"
                />
                <Mars className="w-4 h-4 text-blue-400" />
                <span className="text-purple-300">Мужской</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-purple-300 text-sm mb-2">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="auth-input pl-10 pr-10"
                placeholder="Минимум 6 символов"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-purple-300 text-sm mb-2">Подтвердите пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="auth-input pl-10"
                placeholder="Повторите пароль"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-btn mt-6"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-purple-300 text-sm">
            Уже есть аккаунт?{' '}
            <Link href="/auth/signin" className="auth-link">
              Войти
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