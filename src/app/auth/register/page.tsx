'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Calendar, Sparkles, Venus, Mars, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

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

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Валидация имени (только буквы, пробелы и дефис)
  const validateName = (name: string): boolean => {
    // Разрешены: буквы (русские и английские), пробелы, дефис, апостроф
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-']+$/
    return nameRegex.test(name)
  }

  // Валидация даты рождения
  const validateBirthDate = (date: string): { isValid: boolean; message?: string } => {
    if (!date) return { isValid: false, message: 'Дата рождения обязательна' }
    
    const selected = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Проверяем, что дата не в будущем
    if (selected > today) {
      return { isValid: false, message: 'Дата не может быть в будущем' }
    }
    
    // Проверяем, что пользователь старше 13 лет
    const minAge = new Date()
    minAge.setFullYear(minAge.getFullYear() - 13)
    if (selected > minAge) {
      return { isValid: false, message: 'Вам должно быть минимум 13 лет' }
    }
    
    // Проверяем, что пользователь не старше 120 лет
    const maxAge = new Date()
    maxAge.setFullYear(maxAge.getFullYear() - 120)
    if (selected < maxAge) {
      return { isValid: false, message: 'Пожалуйста, проверьте дату рождения' }
    }
    
    return { isValid: true }
  }

  // Валидация пароля
  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Минимум 8 символов')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Хотя бы одна строчная буква')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Хотя бы одна заглавная буква')
    }
    if (!/\d/.test(password)) {
      errors.push('Хотя бы одна цифра')
    }
    
    return { isValid: errors.length === 0, errors }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setTouched({ ...touched, [name]: true })
    
    // Очищаем ошибку при вводе
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched({ ...touched, [name]: true })
    
    // Валидация на blur
    if (name === 'name' && value && !validateName(value)) {
      setErrors({ ...errors, name: 'Имя должно содержать только буквы, пробелы и дефис' })
    }
    
    if (name === 'birthDate' && value) {
      const result = validateBirthDate(value)
      if (!result.isValid) {
        setErrors({ ...errors, birthDate: result.message || 'Некорректная дата' })
      }
    }
    
    if (name === 'password' && value) {
      const result = validatePassword(value)
      if (!result.isValid) {
        setErrors({ ...errors, password: result.errors.join(', ') })
      }
    }
    
    if (name === 'confirmPassword' && value) {
      if (value !== formData.password) {
        setErrors({ ...errors, confirmPassword: 'Пароли не совпадают' })
      } else {
        setErrors({ ...errors, confirmPassword: '' })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Полная валидация перед отправкой
    const newErrors: Record<string, string> = {}

    // Валидация имени
    if (!formData.name) {
      newErrors.name = 'Имя обязательно'
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Имя должно содержать только буквы, пробелы и дефис'
    }

    // Валидация email
    if (!formData.email) {
      newErrors.email = 'Email обязателен'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }

    // Валидация даты
    const birthResult = validateBirthDate(formData.birthDate)
    if (!birthResult.isValid) {
      newErrors.birthDate = birthResult.message || 'Некорректная дата'
    }

    // Валидация пароля
    const passwordResult = validatePassword(formData.password)
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.errors.join(', ')
    }

    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/register', {
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

      const data = await response.json()

      if (response.ok) {
        router.push('/auth/signin?registered=true')
      } else {
        setErrors({ submit: data.error || 'Ошибка регистрации' })
      }
    } catch (err) {
      setErrors({ submit: 'Ошибка подключения к серверу' })
    } finally {
      setLoading(false)
    }
  }

  // Получение максимальной даты (сегодня)
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() - 13)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  // Получение минимальной даты (120 лет назад)
  const minDate = new Date()
  minDate.setFullYear(minDate.getFullYear() - 120)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-purple-900/30 backdrop-blur-sm rounded-3xl p-8 border border-purple-700/50"
      >
        <div className="text-center mb-6">
          <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-3" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Создать аккаунт
          </h1>
          <p className="text-purple-300 text-sm mt-2">Присоединяйтесь к звёздному сообществу</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Ошибка отправки */}
          {errors.submit && (
            <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 text-red-300 text-sm text-center mb-4 flex items-center gap-2">
              <AlertCircle size={16} />
              {errors.submit}
            </div>
          )}

          <div className="space-y-4">
            {/* Имя */}
            <div>
              <label className="block text-sm mb-2 text-purple-300">
                Имя <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 bg-white/10 rounded-xl text-white border ${
                    errors.name && touched.name
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-pink-500'
                  } focus:outline-none pl-12 transition`}
                  placeholder="Ваше имя (только буквы)"
                  minLength={2}
                  maxLength={50}
                />
                {touched.name && !errors.name && formData.name && (
                  <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                )}
              </div>
              {errors.name && touched.name && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.name}
                </p>
              )}
              <p className="text-purple-400/50 text-xs mt-1">Только буквы, пробелы и дефис</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2 text-purple-300">
                Email <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 bg-white/10 rounded-xl text-white border ${
                    errors.email && touched.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-pink-500'
                  } focus:outline-none pl-12 transition`}
                  placeholder="your@email.com"
                />
                {touched.email && !errors.email && formData.email && (
                  <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                )}
              </div>
              {errors.email && touched.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Дата рождения с кастомным календарем */}
            <div>
              <label className="block text-sm mb-2 text-purple-300">
                Дата рождения <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 pointer-events-none" />
                <input
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  min={minDateStr}
                  max={maxDateStr}
                  className={`w-full px-4 py-3 bg-white/10 rounded-xl text-white border ${
                    errors.birthDate && touched.birthDate
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-pink-500'
                  } focus:outline-none pl-12 transition cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100`}
                  style={{
                    colorScheme: 'dark'
                  }}
                />
                {touched.birthDate && !errors.birthDate && formData.birthDate && (
                  <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                )}
              </div>
              {errors.birthDate && touched.birthDate && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.birthDate}
                </p>
              )}
              <p className="text-purple-400/50 text-xs mt-1">Минимальный возраст: 13 лет</p>
            </div>

            {/* Пол */}
            <div>
              <label className="block text-sm mb-2 text-purple-300">Пол</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    className="accent-pink-500 w-4 h-4"
                  />
                  <Venus size={16} className="text-pink-400 group-hover:scale-110 transition" />
                  <span className="text-white/70 group-hover:text-white transition">Женский</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    className="accent-blue-500 w-4 h-4"
                  />
                  <Mars size={16} className="text-blue-400 group-hover:scale-110 transition" />
                  <span className="text-white/70 group-hover:text-white transition">Мужской</span>
                </label>
              </div>
            </div>

            {/* Пароль */}
            <div>
              <label className="block text-sm mb-2 text-purple-300">
                Пароль <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  minLength={8}
                  className={`w-full px-4 py-3 bg-white/10 rounded-xl text-white border ${
                    errors.password && touched.password
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-pink-500'
                  } focus:outline-none pl-12 pr-12 transition`}
                  placeholder="Минимум 8 символов"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.password}
                </p>
              )}
              <div className="mt-1 flex flex-wrap gap-2">
                <span className={`text-[10px] ${formData.password.length >= 8 ? 'text-green-400' : 'text-purple-400/50'}`}>
                  {formData.password.length >= 8 ? '✅' : '⬜'} 8+ символов
                </span>
                <span className={`text-[10px] ${/[a-z]/.test(formData.password) ? 'text-green-400' : 'text-purple-400/50'}`}>
                  {/[a-z]/.test(formData.password) ? '✅' : '⬜'} a-z
                </span>
                <span className={`text-[10px] ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-purple-400/50'}`}>
                  {/[A-Z]/.test(formData.password) ? '✅' : '⬜'} A-Z
                </span>
                <span className={`text-[10px] ${/\d/.test(formData.password) ? 'text-green-400' : 'text-purple-400/50'}`}>
                  {/\d/.test(formData.password) ? '✅' : '⬜'} 0-9
                </span>
              </div>
            </div>

            {/* Подтверждение пароля */}
            <div>
              <label className="block text-sm mb-2 text-purple-300">
                Подтвердите пароль <span className="text-pink-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 bg-white/10 rounded-xl text-white border ${
                    errors.confirmPassword && touched.confirmPassword
                      ? 'border-red-500 focus:border-red-500'
                      : formData.confirmPassword && formData.confirmPassword === formData.password && !errors.confirmPassword
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-white/10 focus:border-pink-500'
                  } focus:outline-none pl-12 pr-12 transition`}
                  placeholder="Повторите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {touched.confirmPassword && formData.confirmPassword && !errors.confirmPassword && formData.confirmPassword === formData.password && (
                  <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                )}
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Регистрация...
              </>
            ) : (
              'Зарегистрироваться'
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-purple-300 text-sm">
          Уже есть аккаунт?{' '}
          <Link href="/auth/signin" className="text-pink-400 hover:text-pink-300 font-semibold transition">
            Войти
          </Link>
        </p>
      </motion.div>
    </div>
  )
}