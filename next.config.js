/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Разрешаем доступ к папке uploads
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ]
  },
}

module.exports = nextConfig