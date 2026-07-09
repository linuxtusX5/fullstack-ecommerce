import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existing = await db.user.findUnique({
          where: { email: user.email! },
        });
        if (!existing) {
          const newUser = await db.user.create({
            data: { name: user.name, email: user.email!, password: null },
          });
          user.id = newUser.id;
        } else {
          user.id = existing.id;
          (user as any).role = existing.role;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? "USER";
      }
      if (account?.provider === "google" && token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
        });
        if (dbUser) token.role = dbUser.role;
      }
      return token;
    },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //     token.role = (user as any).role ?? "USER";
    //   }
    //   return token;
    // },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: { strategy: "jwt" },

  secret: process.env.NEXTAUTH_SECRET,
};
