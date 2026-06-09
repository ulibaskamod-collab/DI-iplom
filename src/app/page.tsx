import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">StellarFit</h1>
        <p className="text-purple-300 text-xl mb-8">Астрология души и нарядов</p>
        <div className="flex gap-4 justify-center">
          <Link href="/zodiac" className="px-6 py-3 bg-pink-500 rounded-full text-white font-semibold hover:bg-pink-600 transition">
            Все знаки зодиака
          </Link>
          <Link href="/auth/signin" className="px-6 py-3 bg-white/10 rounded-full text-white font-semibold hover:bg-white/20 transition">
            Войти
          </Link>
        </div>
      </div>
    </div>
  )
}