'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Calendar, Sparkles, Venus, Mars } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: 'female',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Отправка формы регистрации...')

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          birthDate: formData.birthDate,
          gender: formData.gender,
        }),
      })

      const data = await response.json()
      console.log('Ответ сервера:', { status: response.status, data })

      if (response.ok) {
        router.push('/auth/signin?registered=true')
      } else {
        setError(data.error || 'Ошибка регистрации')
      }
    } catch (err) {
      console.error('Ошибка при запросе:', err)
      setError('Ошибка подключения к серверу. Проверьте, запущен ли сервер.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-purple-900/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-700/50"
      >
        <div className="text-center mb-6">
          <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-3" />
          <h1 className="text-3xl font-playfair bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Создать аккаунт
          </h1>
          <p className="text-purple-300 text-sm mt-2">Присоединяйтесь к звёздному сообществу</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 text-red-300 text-sm text-center mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-purple-300">Имя</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="auth-input pl-12"
                  placeholder="Ваше имя"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-purple-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="auth-input pl-12"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-purple-300">Дата рождения</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="auth-input pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-purple-300">Пол</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    className="accent-pink-500"
                  />
                  <Venus size={16} className="text-pink-400" />
                  Женский
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    className="accent-blue-500"
                  />
                  <Mars size={16} className="text-blue-400" />
                  Мужской
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-purple-300">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="auth-input pl-12"
                  placeholder="минимум 8 символов"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-purple-300">Подтвердите пароль</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="auth-input pl-12"
                  placeholder="повторите пароль"
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-btn w-full mt-6">
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center mt-6 text-purple-300 text-sm">
          Уже есть аккаунт?{' '}
          <Link href="/auth/signin" className="text-pink-400 hover:text-pink-300 font-semibold">
            Войти
          </Link>
        </p>
      </motion.div>
    </div>
  )
}