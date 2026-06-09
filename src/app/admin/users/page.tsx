'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2, Shield, User } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  user_role: string
  created_at: string
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.email) {
      fetchUsers()
    }
  }, [session])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Не удалось загрузить пользователей. Проверьте подключение к базе данных.')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: string, email: string) => {
    if (email === session?.user?.email) {
      alert('Нельзя удалить самого себя!')
      return
    }
    
    if (confirm(`Удалить пользователя ${email}?`)) {
      try {
        const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
        if (res.ok) {
          setUsers(users.filter(u => u.id !== id))
        } else {
          alert('Ошибка при удалении')
        }
      } catch (error) {
        alert('Ошибка соединения')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
        <button 
          onClick={fetchUsers}
          className="px-4 py-2 bg-pink-500 rounded-lg text-white hover:bg-pink-600"
        >
          Повторить попытку
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Пользователи</h1>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
          Всего: {users.length}
        </span>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl">
          <User className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">Пользователи не найдены</p>
          <p className="text-white/25 text-sm mt-2">Возможно, в базе данных нет пользователей</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white">Имя</th>
                  <th className="px-6 py-4 text-left text-white">Email</th>
                  <th className="px-6 py-4 text-left text-white">Роль</th>
                  <th className="px-6 py-4 text-left text-white">Дата</th>
                  <th className="px-6 py-4 text-center text-white">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-white font-medium">
                      {user.name || 'Без имени'}
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.user_role === 'admin' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {user.user_role === 'admin' ? '👑 Админ' : '👤 Пользователь'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/40 text-sm">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '—'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => deleteUser(user.id, user.email)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition"
                        title="Удалить"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}