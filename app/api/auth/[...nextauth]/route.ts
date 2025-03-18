import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import axios from "axios";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const userGet = await axios.post(
            "http://localhost:5091/api/User/token",
            { username: credentials?.username, password: credentials?.password }
          );
          if (!userGet.data) {
            return null;
          }

          const user = {
            id: userGet.data.id,
            name: userGet.data.userName,
            token: userGet.data.token,
            email: userGet.data.email,
            roles: userGet.data.roles,
          };
          return user;
        } catch (e) {
          console.log(e);
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy, // ✅ Explicitly define as SessionStrategy
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.accessToken = user.token;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken;
      session.roles = token.roles;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
