import dynamic from 'next/dynamic'

const HomePageComponent = dynamic(() => import('./(home)/page'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    </div>
  ),
})

export const dynamic = 'force-dynamic'

export default function Page() {
  return <HomePageComponent />
}