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
      // Проверяем, что дата существует (для високосных годов и т.д.)
      if (isValidDate(year, month, i)) {
        daysArray.push(new Date(year, month, i))
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
    // Проверяем, что дата корректна
    if (isNaN(date.getTime())) return placeholder
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  return (
    <div className="relative" ref={pickerRef}>
      <div 
        className={`w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/10 focus-within:border-pink-500 cursor-pointer flex items-center justify-between transition-all duration-200 hover:bg-white/15 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-white' : 'text-white/40'}>
          {formatDisplayDate(value)}
        </span>
        <Calendar className="w-4 h-4 text-purple-400" />
      </div>

      {isOpen && (
        <div className="absolute mt-2 p-4 bg-gradient-to-b from-purple-900/95 to-[#0d0d25]/95 backdrop-blur-xl rounded-2xl border border-purple-700/50 shadow-2xl z-50 w-full min-w-[280px] animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 hover:bg-white/10 rounded-lg transition text-purple-300 hover:text-white"
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
                className="text-xs text-purple-400 hover:text-purple-300 transition px-2.5 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/30"
              >
                Сегодня
              </button>
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 hover:bg-white/10 rounded-lg transition text-purple-300 hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div key={day} className="text-center text-purple-400/40 text-xs font-medium py-1">
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
                          ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/20'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }
                      hover:scale-105 active:scale-95
                    `}
                  >
                    {date.getDate()}
                    {isToday(date) && (
                      <Sparkles className="w-2.5 h-2.5 text-purple-400 mx-auto mt-0.5" />
                    )}
                  </button>
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-purple-400/50">
            <span className="flex items-center gap-1">
              <Star size={10} className="text-purple-400/30" />
              звезды ведут тебя
            </span>
            <span>✨ выбери дату</span>
          </div>
        </div>
      )}
    </div>
  )
}