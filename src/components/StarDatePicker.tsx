'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, Star, ChevronLeft, ChevronRight, Sparkles, ChevronDown } from 'lucide-react'

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
  const [showYearPicker, setShowYearPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  const monthsFull = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const years = Array.from({ length: 100 }, (_, i) => {
    const currentYear = new Date().getFullYear()
    return currentYear - i
  })

  const isValidDate = (year: number, month: number, day: number) => {
    const testDate = new Date(year, month, day)
    return testDate.getFullYear() === year && 
           testDate.getMonth() === month && 
           testDate.getDate() === day
  }

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
    setShowYearPicker(false)
  }

  const handleYearSelect = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1))
    setShowYearPicker(false)
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
        setShowYearPicker(false)
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
    <div className="relative w-full" ref={pickerRef}>
      <div 
        className={`w-full px-4 py-3 bg-white/10 rounded-xl text-white border border-white/10 focus-within:border-pink-500 cursor-pointer flex items-center justify-between transition-all duration-200 hover:bg-white/15 ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-white' : 'text-white/40'}>
          {formatDisplayDate(value)}
        </span>
        <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
      </div>

      {isOpen && (
        <>
          {/* Прозрачный фон для затемнения */}
          <div 
            className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm"
            onClick={() => {
              setIsOpen(false)
              setShowYearPicker(false)
            }}
          />
          
          {/* Календарь - теперь поверх всего */}
          <div 
            ref={calendarRef}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-gradient-to-b from-purple-900/95 to-[#0d0d25]/95 backdrop-blur-xl rounded-2xl border border-purple-700/50 shadow-2xl z-[9999] w-[340px] max-w-[calc(100vw-2rem)]"
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 hover:bg-white/10 rounded-lg transition text-purple-300 hover:text-white flex-shrink-0"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-2 flex-1 justify-center">
                <button
                  type="button"
                  onClick={() => setShowYearPicker(!showYearPicker)}
                  className="text-white font-medium hover:text-pink-400 transition flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 text-sm whitespace-nowrap"
                >
                  {monthsFull[viewDate.getMonth()]} {viewDate.getFullYear()}
                  <ChevronDown size={14} className="text-white/40 flex-shrink-0" />
                </button>
              </div>
              
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 hover:bg-white/10 rounded-lg transition text-purple-300 hover:text-white flex-shrink-0"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Выбор года */}
            {showYearPicker && (
              <div className="mb-3 p-2 bg-white/5 rounded-xl max-h-40 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-4 gap-1">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      className={`px-2 py-1.5 rounded-lg text-sm transition ${
                        year === viewDate.getFullYear()
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Дни недели */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map((day) => (
                <div key={day} className="text-center text-purple-400/40 text-xs font-medium py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Дни месяца */}
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
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }
                        hover:scale-105 active:scale-95
                      `}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
              ))}
            </div>

            {/* Футер */}
            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-purple-400/50">
              <span className="flex items-center gap-1">
                <Star size={10} className="text-purple-400/30" />
                звезды ведут тебя
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  setShowYearPicker(false)
                }}
                className="text-pink-400 hover:text-pink-300 transition px-3 py-1 rounded-full bg-pink-500/20 hover:bg-pink-500/30"
              >
                Закрыть
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}