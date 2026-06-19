export const dynamic = 'force-dynamic'

'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2, Shield, User, Edit2, X, Check, Plus, RefreshCw } from 'lucide-react'

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
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', user_role: '' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', user_role: 'user' })
  const [adding, setAdding] = useState(false)

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
      setError('Не удалось загрузить пользователей')
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (id: string, name: string, user_role: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, user_role }),
      })
      
      if (res.ok) {
        await fetchUsers()
        setEditingUserId(null)
      } else {
        alert('Ошибка при обновлении')
      }
    } catch (error) {
      alert('Ошибка соединения')
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
          await fetchUsers()
        } else {
          alert('Ошибка при удалении')
        }
      } catch (error) {
        alert('Ошибка соединения')
      }
    }
  }

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        alert('Пользователь успешно добавлен!')
        setShowAddModal(false)
        setAddForm({ name: '', email: '', password: '', user_role: 'user' })
        await fetchUsers()
      } else {
        alert('Ошибка: ' + (data.error || 'Не удалось добавить пользователя'))
      }
    } catch (error) {
      alert('Ошибка соединения')
    } finally {
      setAdding(false)
    }
  }

  const startEdit = (user: User) => {
    setEditingUserId(user.id)
    setEditForm({ name: user.name || '', user_role: user.user_role })
  }

  const cancelEdit = () => {
    setEditingUserId(null)
    setEditForm({ name: '', user_role: '' })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Пользователи</h1>
          <p className="text-white/50 text-sm mt-1">Управление пользователями и их ролями</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 rounded-xl text-white hover:bg-green-600 transition"
        >
          <Plus size={18} />
          Добавить пользователя
        </button>
      </div>

      {/* Статистика */}
      <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-white/50 text-sm">Всего пользователей</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
          <button
            onClick={fetchUsers}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            title="Обновить"
          >
            <RefreshCw size={16} className="text-white/60" />
          </button>
        </div>
      </div>

      {/* Таблица пользователей */}
      {users.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl">
          <User className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">Пользователи не найдены</p>
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
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="px-2 py-1 bg-white/10 rounded text-white border border-white/20 focus:outline-none focus:border-pink-500"
                        />
                      ) : (
                        <span className="text-white font-medium">{user.name || 'Без имени'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/60">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <select
                          value={editForm.user_role}
                          onChange={(e) => setEditForm({ ...editForm, user_role: e.target.value })}
                          className="px-2 py-1 bg-white/10 rounded text-white border border-white/20 focus:outline-none focus:border-pink-500"
                        >
                          <option value="user">👤 Пользователь</option>
                          <option value="admin">👑 Администратор</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.user_role === 'admin' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {user.user_role === 'admin' ? '👑 Админ' : '👤 Пользователь'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white/40 text-sm">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '—'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {editingUserId === user.id ? (
                          <>
                            <button
                              onClick={() => updateUserRole(user.id, editForm.name, editForm.user_role)}
                              className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/40 transition"
                              title="Сохранить"
                            >
                              <Check size={16} className="text-green-400" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 rounded-lg bg-gray-500/20 hover:bg-gray-500/40 transition"
                              title="Отмена"
                            >
                              <X size={16} className="text-gray-400" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(user)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/20 transition"
                              title="Редактировать"
                            >
                              <Edit2 size={16} className="text-yellow-400" />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id, user.email)}
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition"
                              title="Удалить"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Модальное окно добавления пользователя */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Добавить пользователя</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X size={20} className="text-white/60" />
              </button>
            </div>
            
            <form onSubmit={addUser} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Имя</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-pink-500"
                  placeholder="Имя пользователя"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-pink-500"
                  placeholder="user@example.com"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-1">Пароль *</label>
                <input
                  type="password"
                  required
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-pink-500"
                  placeholder="Минимум 6 символов"
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm mb-1">Роль</label>
                <select
                  value={addForm.user_role}
                  onChange={(e) => setAddForm({ ...addForm, user_role: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-white border border-white/10 focus:outline-none focus:border-pink-500"
                >
                  <option value="user">👤 Пользователь</option>
                  <option value="admin">👑 Администратор</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 py-2 bg-green-500 rounded-xl text-white font-semibold hover:bg-green-600 transition disabled:opacity-50"
                >
                  {adding ? 'Добавление...' : 'Добавить'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}