import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { env, getRequiredEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const providers = env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
  ? [
      Google({
        clientId: env.AUTH_GOOGLE_ID,
        clientSecret: env.AUTH_GOOGLE_SECRET
      })
    ]
  : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database"
  },
  secret: getRequiredEnv("AUTH_SECRET"),
  providers,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      return session;
    }
  },
  pages: {
    signIn: "/sign-in"
  }
});
