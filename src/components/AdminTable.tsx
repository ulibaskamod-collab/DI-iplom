'use client'

import { useEffect, useState } from 'react'

interface Column {
  key: string
  label: string
  render?: (value: any, item: any) => React.ReactNode
}

interface AdminTableProps {
  columns: Column[]
  data: any[]
  actions?: (item: any) => React.ReactNode
  onRowClick?: (item: any) => void
}

export function AdminTable({ columns, data, actions, onRowClick }: AdminTableProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // На мобильных показываем карточки
  useEffect(() => {
    const checkScreen = () => {
      setViewMode(window.innerWidth < 768 ? 'cards' : 'table')
    }
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  if (viewMode === 'cards') {
    return (
      <div className="admin-cards">
        {data.map((item, idx) => (
          <div 
            key={idx} 
            className="admin-card"
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((col) => (
              <div key={col.key} className="card-row">
                <span className="card-label">{col.label}</span>
                <span className="card-value">
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </span>
              </div>
            ))}
            {actions && (
              <div className="card-row mt-2 pt-2 border-t border-white/10">
                <span className="card-label">Действия</span>
                <span className="card-value flex gap-2 justify-end">
                  {actions(item)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="admin-table-wrapper">
      <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="admin-table w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-4 text-left text-white font-semibold">
                    {col.label}
                  </th>
                ))}
                {actions && (
                  <th className="px-6 py-4 text-center text-white font-semibold">Действия</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr 
                  key={idx} 
                  className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-white/80">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-center actions-cell">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}