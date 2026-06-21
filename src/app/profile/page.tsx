
'use client'
export const dynamic = 'force-dynamic'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Heart, 
  Settings, 
  LogOut, 
  Star, 
  Calendar, 
  Venus, 
  Mars,
  ShoppingBag,
  Trash2,
  Sparkles,
  Mail,
  Cake,
  Shield,
  Edit2,
  Check,
  X
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  birth_date: string
  gender: string
  zodiac_sign: string
}

interface FavoriteItem {
  id: string
  clothing_item_id: number
  title?: string
  description?: string
  image_url?: string
  season?: string
  gender?: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    birthDate: '',
    gender: '',
  })
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites'>('profile')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      // Загружаем профиль
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          setProfile(data)
          setEditForm({
            name: data.name || '',
            birthDate: data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : '',
            gender: data.gender || '',
          })
        })
        .catch(console.error)

      // Загружаем избранное
      fetch('/api/user/favorites')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const normalized = data.map((item: any) => ({
              id: item.id,
              clothing_item_id: item.clothing_item_id || item.clothingItemId,
              title: item.title || item.clothingItem?.title || `Товар #${item.clothing_item_id}`,
              description: item.description || item.clothingItem?.description || '',
              image_url: item.image_url || item.clothingItem?.image_url || '',
              season: item.season || item.clothingItem?.season || '',
              gender: item.gender || item.clothingItem?.gender || '',
            }))
            setFavorites(normalized)
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [session])

 const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setMessage(null)
  setLoading(true)

  try {
    console.log('Sending update:', {
      name: editForm.name,
      birthDate: editForm.birthDate,
      gender: editForm.gender,
    })

    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editForm.name,
        birthDate: editForm.birthDate,
        gender: editForm.gender,
      }),
    })

    const data = await res.json()
    console.log('Response:', data)

    if (res.ok && data.success) {
      setProfile(data.user)
      setEditing(false)
      setMessage({ text: '✅ Профиль успешно обновлен!', type: 'success' })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ text: data.error || '❌ Ошибка при обновлении', type: 'error' })
    }
  } catch (error) {
    console.error('Update error:', error)
    setMessage({ text: '❌ Ошибка соединения с сервером', type: 'error' })
  } finally {
    setLoading(false)
  }
}
const updateZodiac = async () => {
  const res = await fetch('/api/user/update-zodiac', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ birthDate: editForm.birthDate })
  })
  const data = await res.json()
  if (data.success) {
    console.log('Знак обновлен:', data.zodiac_sign)
  }
}
  const removeFavorite = async (itemId: number) => {
    try {
      const res = await fetch(`/api/user/favorites?clothingItemId=${itemId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setFavorites(prev => prev.filter(f => f.clothing_item_id !== itemId))
        setMessage({ text: '✅ Товар удален из избранного', type: 'success' })
        setTimeout(() => setMessage(null), 2000)
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const getZodiacEmoji = (sign: string) => {
    const emojis: Record<string, string> = {
      'Овен': '♈', 'Телец': '♉', 'Близнецы': '♊', 'Рак': '♋',
      'Лев': '♌', 'Дева': '♍', 'Весы': '♎', 'Скорпион': '♏',
      'Стрелец': '♐', 'Козерог': '♑', 'Водолей': '♒', 'Рыбы': '♓'
    }
    return emojis[sign] || '✨'
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white/50">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Декоративный фон */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Верхняя часть с аватаром */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Аватар */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
                  <span className="text-4xl font-bold text-white">
                    {profile?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Информация */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {profile?.name || 'Пользователь'}
                </h1>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {profile?.zodiac_sign && (
                    <span className="px-3 py-1 bg-purple-500/30 rounded-full text-purple-300 text-sm flex items-center gap-1">
                      <span>{getZodiacEmoji(profile.zodiac_sign)}</span>
                      {profile.zodiac_sign}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-white/10 rounded-full text-white/60 text-sm flex items-center gap-1">
                    <Mail size={14} />
                    {profile?.email}
                  </span>
                </div>
              </div>

              {/* Кнопка выхода */}
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 transition flex items-center gap-2"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">Выйти</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Сообщения */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl ${
                message.type === 'success' 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-400'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Вкладки */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-white/10 text-pink-400 border-b-2 border-pink-400'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <User size={18} />
            Профиль
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'favorites'
                ? 'bg-white/10 text-pink-400 border-b-2 border-pink-400'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Heart size={18} />
            Избранное
            {favorites.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-pink-500/30 rounded-full text-xs text-pink-400">
                {favorites.length}
              </span>
            )}
          </button>
        </div>

        {/* Содержимое вкладок */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
            >
              {editing ? (
                <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                  <div>
                    <label className="block text-white/70 text-sm mb-2 flex items-center gap-2">
                      <User size={16} />
                      Имя
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-pink-500 transition"
                      placeholder="Ваше имя"
                    />
                  </div>

                 // В компоненте ProfilePage, в секции редактирования профиля:

<div>
  <label className="block text-white/70 text-sm mb-2 flex items-center gap-2">
    <Cake size={16} />
    Дата рождения
  </label>
  <div className="relative">
    <input
      type="date"
      value={editForm.birthDate}
      onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
      className="w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/10 focus:outline-none focus:border-pink-500 transition [color-scheme:dark]"
      min="1900-01-01"
      max="2100-12-31"
    />
    <Star className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
  </div>
  <p className="text-white/30 text-xs mt-1">✨ Выберите дату рождения</p>
</div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2 flex items-center gap-2">
                      <Shield size={16} />
                      Пол
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={editForm.gender === 'female'}
                          onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                          className="accent-pink-500"
                        />
                        <Venus size={16} className="text-pink-400" />
                        <span className="text-white">Женский</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={editForm.gender === 'male'}
                          onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                          className="accent-blue-500"
                        />
                        <Mars size={16} className="text-blue-400" />
                        <span className="text-white">Мужской</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition flex items-center justify-center gap-2"
                    >
                      <Check size={18} />
                      Сохранить
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false)
                        setEditForm({
                          name: profile?.name || '',
                          birthDate: profile?.birth_date?.split('T')[0] || '',
                          gender: profile?.gender || '',
                        })
                      }}
                      className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition flex items-center gap-2"
                    >
                      <X size={18} />
                      Отмена
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                        <User size={20} className="text-pink-400 mt-0.5" />
                        <div>
                          <p className="text-white/50 text-sm">Имя</p>
                          <p className="text-white font-medium">{profile?.name || 'Не указано'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                        <Mail size={20} className="text-pink-400 mt-0.5" />
                        <div>
                          <p className="text-white/50 text-sm">Email</p>
                          <p className="text-white font-medium">{profile?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                        <Cake size={20} className="text-pink-400 mt-0.5" />
                        <div>
                          <p className="text-white/50 text-sm">Дата рождения</p>
                          <p className="text-white font-medium">
                            {profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString('ru-RU') : 'Не указано'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                        <Shield size={20} className="text-pink-400 mt-0.5" />
                        <div>
                          <p className="text-white/50 text-sm">Пол</p>
                          <p className="text-white font-medium">
                            {profile?.gender === 'female' ? 'Женский' : profile?.gender === 'male' ? 'Мужской' : 'Не указан'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {profile?.zodiac_sign && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{getZodiacEmoji(profile.zodiac_sign)}</div>
                        <div>
                          <p className="text-white/50 text-sm flex items-center gap-1">
                            <Sparkles size={14} />
                            Ваш знак зодиака
                          </p>
                          <p className="text-xl font-bold text-white">{profile.zodiac_sign}</p>
                        </div>
                        <Link
                          href={`/zodiac/${profile.zodiac_sign === 'Овен' ? 'oven' : profile.zodiac_sign === 'Телец' ? 'telec' : profile.zodiac_sign === 'Близнецы' ? 'bliznetsy' : profile.zodiac_sign === 'Рак' ? 'rak' : profile.zodiac_sign === 'Лев' ? 'lev' : profile.zodiac_sign === 'Дева' ? 'deva' : profile.zodiac_sign === 'Весы' ? 'vesy' : profile.zodiac_sign === 'Скорпион' ? 'skorpion' : profile.zodiac_sign === 'Стрелец' ? 'strelets' : profile.zodiac_sign === 'Козерог' ? 'kozerog' : profile.zodiac_sign === 'Водолей' ? 'vodoley' : 'ryby'}`}
                          className="ml-auto px-4 py-2 bg-white/10 rounded-lg text-sm text-purple-300 hover:bg-white/20 transition"
                        >
                          Подробнее →
                        </Link>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setEditing(true)}
                    className="mt-6 w-full py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />
                    Редактировать профиль
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 rounded-2xl border border-white/10 p-6"
            >
              {favorites.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart size={32} className="text-white/20" />
                  </div>
                  <p className="text-white/40 text-lg mb-2">У вас пока нет избранных товаров</p>
                  <p className="text-white/25 text-sm mb-6">Добавляйте понравившиеся образы, нажимая на сердечко ❤️</p>
                  <Link
                    href="/zodiac"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-medium hover:from-pink-600 hover:to-purple-600 transition"
                  >
                    <Sparkles size={18} />
                    Подобрать стиль
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Heart size={20} className="text-pink-400" />
                      Мои желания
                      <span className="text-sm text-white/40">({favorites.length})</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -4 }}
                        className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-pink-500/30 transition-all"
                      >
                        <div className="aspect-square bg-gradient-to-br from-white/5 to-white/10 relative">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag size={40} className="text-white/20" />
                            </div>
                          )}
                          <button
                            onClick={() => removeFavorite(item.clothing_item_id)}
                            className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} className="text-white" />
                          </button>
                          {item.season && (
                            <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white/80">
                              {item.season === 'winter' && '❄️ Зима'}
                              {item.season === 'spring' && '🌸 Весна'}
                              {item.season === 'summer' && '☀️ Лето'}
                              {item.season === 'autumn' && '🍂 Осень'}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-white font-medium truncate">{item.title}</h3>
                          {item.description && (
                            <p className="text-white/40 text-sm mt-1 line-clamp-2">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                            <span className="text-white/30 text-xs">ID: {item.clothing_item_id}</span>
                            <button
                              onClick={() => removeFavorite(item.clothing_item_id)}
                              className="text-white/30 hover:text-red-400 text-xs transition"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

}