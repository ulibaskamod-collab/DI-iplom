import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        key: '7cdabd1c1afcb0e51e4e8094e8b90000',
        image: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // 1x1 пиксель
        name: 'test.png',
      }),
    })
    const data = await response.json()
    return NextResponse.json({ 
      success: data.success,
      url: data.data?.url,
      error: data.error
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}