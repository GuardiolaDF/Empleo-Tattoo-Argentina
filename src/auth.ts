import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClient";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales incompletas");
        }

        const client = await clientPromise;
        const db = client.db();
        
        const user = await db.collection("users").findOne({ email: credentials.email });
        
        if (!user || !user.password) {
          throw new Error("Usuario no encontrado o método de inicio de sesión incorrecto");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const adminEmails = (process.env.ADMIN_EMAILS || "empleotattooargentina@gmail.com")
          .split(",")
          .map((e) => e.trim().toLowerCase());

        const userEmail = (user.email || "").toLowerCase();
        if (adminEmails.includes(userEmail)) {
          token.role = "admin";
        } else {
          const client = await clientPromise;
          const db = client.db();
          const dbUser = await db.collection("users").findOne({ email: user.email });
          token.role = dbUser?.role || "user";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string;
        session.user.role = (token.role as string) || "user";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});

