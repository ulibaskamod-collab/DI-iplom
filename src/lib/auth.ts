import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'zadiac',
  user: 'postgres',
  password: '1234',
})

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔍 Поиск пользователя:', credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const result = await pool.query(
            'SELECT id, name, email, password FROM users WHERE email = $1',
            [credentials.email]
          )

          const user = result.rows[0]

          console.log(' Пользователь найден:', user ? 'да' : 'нет')

          if (!user) {
            return null
          }

          const isValid = credentials.password === user.password

          console.log(' Пароль верен:', isValid)

          if (!isValid) {
            return null
          }

          console.log(' Авторизация успешна!')

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error(' Ошибка:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}