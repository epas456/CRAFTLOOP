import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Demo users — no database needed, works on Vercel/serverless
const DEMO_USERS = [
  { id: "user1", email: "demo@craftloop.app", name: "Demo User", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=demo" },
  { id: "user2", email: "maria@craftloop.app", name: "María García", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=maria" },
  { id: "user3", email: "carlos@craftloop.app", name: "Carlos López", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=carlos" },
];

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "craftloop-dev-secret-2026",
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

        // Accept any valid email — this is a prototype/demo
        // In production, add real password validation here
        const existing = DEMO_USERS.find(u => u.email === credentials.email);
        if (existing) return existing;

        // Auto-create session for any email (demo mode)
        const name = credentials.email.split("@")[0];
        return {
          id: `user_${name}`,
          email: credentials.email,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${name}`,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.image = (user as { image?: string }).image;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        if (token.image) session.user.image = token.image as string;
      }
      return session;
    },
  },
};
