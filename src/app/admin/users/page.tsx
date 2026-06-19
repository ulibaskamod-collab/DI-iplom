'use client'

export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2, User, Edit2, X, Check, Plus, RefreshCw } from 'lucide-react'
import { AdminButton } from '@/src/components/AdminButton'

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    )
  }

  return (
    <div>
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-white/5">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <User className="w-7 h-7 text-cyan-400" />
              Пользователи
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              Управление пользователями и их ролями
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AdminButton
            variant="ghost"
            size="sm"
            icon={<RefreshCw size={16} />}
            onClick={fetchUsers}
            title="Обновить" children={undefined}          />
          <AdminButton
            variant="success"
            size="md"
            icon={<Plus size={18} />}
            onClick={() => setShowAddModal(true)}
          >
            Добавить пользователя
          </AdminButton>
        </div>
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
        </div>
      </div>

      {/* Список пользователей */}
      {users.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <User className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/40">Пользователи не найдены</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
          {/* Десктопная таблица */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">Имя</th>
                  <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">Роль</th>
                  <th className="px-6 py-4 text-left text-white text-xs font-medium uppercase tracking-wider">Дата</th>
                  <th className="px-6 py-4 text-center text-white text-xs font-medium uppercase tracking-wider">Действия</th>
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
                    <td className="px-6 py-4 text-white/60 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <select
                          value={editForm.user_role}
                          onChange={(e) => setEditForm({ ...editForm, user_role: e.target.value })}
                          className="px-2 py-1 bg-white/10 rounded text-white border border-white/20 focus:outline-none focus:border-pink-500"
                        >
                          <option value="user" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>👤 Пользователь</option>
                          <option value="admin" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>👑 Администратор</option>
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
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '---'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {editingUserId === user.id ? (
                          <>
                            <AdminButton
                              variant="success"
                              size="sm"
                              icon={<Check size={16} className="text-green-400" />}
                              onClick={() => updateUserRole(user.id, editForm.name, editForm.user_role)}
                              title="Сохранить" children={undefined}                            />
                            <AdminButton
                              variant="ghost"
                              size="sm"
                              icon={<X size={16} className="text-gray-400" />}
                              onClick={cancelEdit}
                              title="Отмена" children={undefined}                            />
                          </>
                        ) : (
                          <>
                            <AdminButton
                                variant="ghost"
                                size="sm"
                                icon={<Edit2 size={16} className="text-yellow-400" />}
                                onClick={() => startEdit(user)}
                                title="Редактировать" children={undefined}                            />
                            <AdminButton
                                variant="danger"
                                size="sm"
                                icon={<Trash2 size={16} className="text-red-400" />}
                                onClick={() => deleteUser(user.id, user.email)}
                                title="Удалить" children={undefined}                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Мобильные карточки */}
          <div className="md:hidden divide-y divide-white/5">
            {users.map((user) => (
              <div key={user.id} className="p-4 hover:bg-white/5 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium truncate">{user.name || 'Без имени'}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        user.user_role === 'admin'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {user.user_role === 'admin' ? '👑' : '👤'}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm truncate">{user.email}</p>
                    <p className="text-white/30 text-xs mt-1">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '---'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      icon={<Edit2 size={15} className="text-yellow-400" />}
                      onClick={() => startEdit(user)} children={undefined}                    />
                    <AdminButton
                      variant="danger"
                      size="sm"
                      icon={<Trash2 size={15} className="text-red-400" />}
                      onClick={() => deleteUser(user.id, user.email)} children={undefined}                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Модальное окно добавления пользователя */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-white/10 max-h-[90vh] overflow-y-auto">
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
                  <option value="user" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>👤 Пользователь</option>
                  <option value="admin" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>👑 Администратор</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <AdminButton
                  type="submit"
                  variant="success"
                  fullWidth
                  disabled={adding}
                >
                  {adding ? 'Добавление...' : 'Добавить'}
                </AdminButton>
                <AdminButton
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  Отмена
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}