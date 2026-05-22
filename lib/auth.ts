import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Database from "better-sqlite3";
import { randomUUID } from "crypto";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "craftloop-dev-secret",
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const sqlite = new Database(process.env.DATABASE_URL ?? "./craftloop.db");

        let user = sqlite.prepare("SELECT * FROM users WHERE email = ?").get(credentials.email) as
          | { id: string; email: string; name: string } | undefined;

        if (!user) {
          const id = randomUUID();
          const name = credentials.email.split("@")[0];
          sqlite.prepare(
            "INSERT OR IGNORE INTO users (id, email, name, points, level, badges) VALUES (?, ?, ?, 50, 1, '[]')"
          ).run(id, credentials.email, name);
          user = sqlite.prepare("SELECT * FROM users WHERE email = ?").get(credentials.email) as
            { id: string; email: string; name: string };
        }

        sqlite.close();
        if (!user) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
};
