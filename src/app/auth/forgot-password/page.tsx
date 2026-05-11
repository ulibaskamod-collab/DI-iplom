'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Что-то пошло не так')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="text-green-500 text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold mb-2">Проверьте почту</h2>
          <p className="text-gray-600 mb-4">
            Мы отправили инструкцию по восстановлению пароля на {email}
          </p>
          <Link href="/auth/signin" className="text-pink-500 hover:text-pink-600">
            Вернуться ко входу
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Восстановление пароля</h2>
        <p className="text-gray-600 text-center mb-6">
          Введите email, указанный при регистрации, и мы отправим ссылку для сброса пароля
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center mb-4">
              {error}
            </div>
          )}
          
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-pink-500 focus:border-pink-500"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
          
          <Link href="/auth/signin" className="block text-center mt-4 text-sm text-gray-500 hover:text-gray-700">
            Вернуться ко входу
          </Link>
        </form>
      </div>
    </div>
  )
}