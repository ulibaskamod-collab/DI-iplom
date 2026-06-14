'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, Sparkles, Mail, Lock, User, Calendar, Venus, Mars, Eye, EyeOff } from 'lucide-react'

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

    if (formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов')
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5F0] to-[#FFE8E0] dark:from-[#0a0a1a] dark:to-[#0d0d25] py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] dark:from-[#FF1493] dark:to-[#FF69B4] rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">StellarFit</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Создайте новый аккаунт</p>
        </div>

        <div className="bg-white dark:bg-[#141428] rounded-3xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Имя
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a35] rounded-xl focus:outline-none focus:border-[#FF6B6B] dark:focus:border-[#FF1493] transition text-gray-800 dark:text-white"
                  placeholder="Ваше имя"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a35] rounded-xl focus:outline-none focus:border-[#FF6B6B] dark:focus:border-[#FF1493] transition text-gray-800 dark:text-white"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Дата рождения
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a35] rounded-xl focus:outline-none focus:border-[#FF6B6B] dark:focus:border-[#FF1493] transition text-gray-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Пол
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 accent-[#FF6B6B] dark:accent-[#FF1493]"
                  />
                  <Venus className="w-4 h-4 text-[#FF6B6B] dark:text-[#FF1493]" />
                  <span className="text-gray-700 dark:text-gray-300">Женский</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 accent-[#4A90D9]"
                  />
                  <Mars className="w-4 h-4 text-[#4A90D9]" />
                  <span className="text-gray-700 dark:text-gray-300">Мужской</span>
                </label>
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a35] rounded-xl focus:outline-none focus:border-[#FF6B6B] dark:focus:border-[#FF1493] transition text-gray-800 dark:text-white"
                  placeholder="Минимум 6 символов"
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

            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a35] rounded-xl focus:outline-none focus:border-[#FF6B6B] dark:focus:border-[#FF1493] transition text-gray-800 dark:text-white"
                  placeholder="Повторите пароль"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] dark:from-[#FF1493] dark:to-[#FF69B4] text-white font-semibold rounded-xl hover:from-[#FF5252] hover:to-[#FF7575] dark:hover:from-[#FF1493]/80 dark:hover:to-[#FF69B4]/80 transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Уже есть аккаунт?{' '}
              <Link href="/auth/signin" className="text-[#FF6B6B] dark:text-[#FF69B4] font-medium hover:underline">
                Войти
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
            Регистрируясь, вы соглашаетесь с условиями использования
          </p>
        </div>
      </div>
    </div>
  )
}