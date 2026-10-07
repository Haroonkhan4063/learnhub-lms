import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import connectDB from "./db";
import { User } from "@/models";

export const authOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(c) {
        if (!c?.email || !c?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: c.email.toLowerCase() });
        if (!user) return null;
        const ok = await bcrypt.compare(c.password, user.password);
        if (!ok) return null;
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};

export const getSession = () => getServerSession(authOptions);
