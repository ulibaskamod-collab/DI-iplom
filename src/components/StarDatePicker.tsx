'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

interface StarDatePickerProps {
  value: string
  onChange: (date: string) => void
  className?: string
  placeholder?: string
}

export function StarDatePicker({ 
  value, 
  onChange, 
  className = '', 
  placeholder = 'ДД.ММ.ГГГГ' 
}: StarDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  const monthsFull = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  // Проверка на существующую дату
  const isValidDate = (year: number, month: number, day: number) => {
    const testDate = new Date(year, month, day)
    return testDate.getFullYear() === year && 
           testDate.getMonth() === month && 
           testDate.getDate() === day
  }

  // Проверка, что дата не в будущем
  const isDateInFuture = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date > today
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysArray: (Date | null)[] = []
    
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    for (let i = 0; i < startDay; i++) {
      daysArray.push(null)
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      if (isValidDate(year, month, i)) {
        const dateObj = new Date(year, month, i)
        // Добавляем только если дата не в будущем
        if (!isDateInFuture(dateObj)) {
          daysArray.push(dateObj)
        } else {
          daysArray.push(null)
        }
      } else {
        daysArray.push(null)
      }
    }
    
    return daysArray
  }

  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    setSelectedDate(date)
    onChange(dateString)
    setIsOpen(false)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear()
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const goToday = () => {
    const today = new Date()
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return placeholder
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return placeholder
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  return (
    <div className="relative" ref={pickerRef}>
      <div 
        className={`w-full px-4 py-3 bg-white/5 rounded-xl text-white border border-white/10 focus-within:border-pink-500 cursor-pointer flex items-center justify-between transition-all duration-200 hover:bg-white/10 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-white' : 'text-white/30'}>
          {formatDisplayDate(value)}
        </span>
        <Calendar className="w-4 h-4 text-white/30" />
      </div>

      {isOpen && (
        <div className="absolute mt-2 p-4 bg-[#1a0a2a] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 w-full min-w-[280px] animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/50 hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">
                {monthsFull[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={goToday}
                className="text-xs text-pink-400 hover:text-pink-300 transition px-2.5 py-1 rounded-full bg-pink-500/20 hover:bg-pink-500/30"
              >
                Сегодня
              </button>
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/50 hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-white/30 text-xs font-medium py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(viewDate).map((date, index) => (
              <div key={index} className="aspect-square">
                {date ? (
                  <button
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    className={`
                      w-full h-full rounded-xl text-sm font-medium transition-all duration-200
                      ${isSelected(date) 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25 scale-95' 
                        : isToday(date)
                          ? 'bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border border-pink-500/20'
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                      }
                      hover:scale-105 active:scale-95
                    `}
                  >
                    {date.getDate()}
                    {isToday(date) && (
                      <Sparkles className="w-2.5 h-2.5 text-pink-400 mx-auto mt-0.5" />
                    )}
                  </button>
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-white/30">
            <span className="flex items-center gap-1">
              <Star size={10} className="text-white/20" />
              звезды ведут тебя
            </span>
            <span>✨ выбери дату</span>
          </div>
        </div>
      )}
    </div>
  )
}