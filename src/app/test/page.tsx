'use client'

import { useSession } from 'next-auth/react'

export default function TestPage() {
  const { data: session } = useSession()
  
  return (
    <div className="p-8">
      <h1>Тестовая страница</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}