import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await pool.query(
            "SELECT id, name, email, password, user_role FROM users WHERE email = $1",
            [credentials.email]
          );

          const user = result.rows[0];

          if (!user) {
            return null;
          }

          // ВРЕМЕННО: прямое сравнение (потом замените на bcrypt)
          const isValid = credentials.password === user.password;

          if (!isValid) {
            return null;
          }

          // ВОЗВРАЩАЕМ ПОЛЬЗОВАТЕЛЯ С РОЛЬЮ
          return {
            id: user.id,
            email: user.email,
            name: user.name || "",
            role: user.user_role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        (token as any).role = (user as any).role; // Используем as any
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = (token as any).role; // Используем as any
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
};