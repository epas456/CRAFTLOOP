import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Auto-detect URL for Vercel deployments
export function getBaseUrl() {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const DEMO_USERS = [
  { id: "user1", email: "demo@craftloop.app",  name: "Demo User",    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=demo"   },
  { id: "user2", email: "maria@craftloop.app", name: "María García", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=maria"  },
  { id: "user3", email: "eric@craftloop.app",  name: "Eric",         image: "https://api.dicebear.com/9.x/avataaars/svg?seed=eric"   },
];

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "craftloop-dev-secret-2026",
  session: { strategy: "jwt" },
  pages:   { signIn: "/login" },

  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email:    { label: "Email",      type: "email"    },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Match a known demo user, or auto-create one for any email (prototype mode)
        const known = DEMO_USERS.find(
          u => u.email.toLowerCase() === credentials.email.toLowerCase()
        );
        if (known) return known;

        const name = credentials.email.split("@")[0];
        return {
          id:    `u_${name}`,
          email: credentials.email,
          name:  name.charAt(0).toUpperCase() + name.slice(1),
          image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${name}`,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id    = user.id;
        token.image = (user as { image?: string }).image ?? token.image;
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
