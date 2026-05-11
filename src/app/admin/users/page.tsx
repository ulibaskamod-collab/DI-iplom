'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, Trash2, Shield } from 'lucide-react'

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.email) {
      fetch(`/api/user/role?email=${session.user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.role !== 'admin') {
            router.push('/')
          }
        })
        .catch(() => router.push('/'))
    }
  }, [session, status, router])

  // Загрузка пользователей
  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const deleteUser = async (id: string) => {
    if (confirm('Удалить пользователя?')) {
      await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
      setUsers(users.filter(u => u.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Заголовок */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-white">Пользователи</h1>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
            {users.length}
          </span>
        </div>

        {/* Таблица */}
        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
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
                  <td className="px-6 py-4 text-white">{user.name || 'Без имени'}</td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.user_role === 'admin' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {user.user_role === 'admin' ? '👑 Админ' : '👤 Пользователь'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => deleteUser(user.id)}
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
    </div>
  )
}