// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Adjust this import to your actual model path
import User from "../../../../models/User";

const connectMongo = async () => {
  if (mongoose.connection.readyState !== 1) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not set");
    await mongoose.connect(uri);
  }
};

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
        register: { label: "Register", type: "text" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials.password) return null;

        await connectMongo();

        const isRegister =
          credentials.register === true || credentials.register === "true";

        if (isRegister) {
          const existing = await User.findOne({ email: credentials.email });
          if (existing) return null;

          const hashed = await bcrypt.hash(credentials.password, 10);
          const created = await User.create({
            email: credentials.email,
            password: hashed,
            name: credentials.email.split("@")[0],
          });

          return {
            id: created._id.toString(),
            email: created.email,
            name: created.name,
          };
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  session: { strategy: "jwt" as const },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ user }: any) {
      try {
        if (!user?.email) return true;
        await connectMongo();
        await User.findOneAndUpdate(
          { email: user.email },
          {
            $set: { name: user.name ?? undefined },
            $setOnInsert: { createdAt: new Date() },
          },
          { upsert: true, setDefaultsOnInsert: true }
        );
      } catch (err) {
        console.error("Error upserting user on signIn:", err);
      }
      return true;
    },
  },
};

// ✅ Correct v5 handler exports
export const {
  handlers: { GET, POST },
  auth,    // optional
  signIn,  // optional
  signOut, // optional
} = NextAuth(authOptions);
