import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Chat App",
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const response = await fetch("http://localhost:5000/api/user/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }

        if (result?.data) {
          return result.data;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    jwt: async ({ token, user, session, trigger }) => {
      let updatedData = {};

      if (trigger === "update" && session) {
        updatedData = { ...session };
      }

      return { ...token, ...user, ...updatedData };
    },
    session: async ({ session, token }) => {
      const { sub, iat, exp, jti, ...rest } = token;
      session.user = rest;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };
