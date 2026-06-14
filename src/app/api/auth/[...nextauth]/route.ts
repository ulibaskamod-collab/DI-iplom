import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Пароль', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        try {
          const result = await pool.query(
            'SELECT id, name, email, password, user_role FROM users WHERE email = $1',
            [credentials.email]
          )
          const user = result.rows[0]
          if (!user) return null
          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) return null
          return { id: user.id, email: user.email, name: user.name, role: user.user_role }
        } catch (error) {
          return null
        }
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/signin' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role }
      return token
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = token.id as string; session.user.role = token.role as string }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }