import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import User from "../../../../models/User"; // your Mongoose User model
import bcrypt from "bcrypt";

const connectMongo = async () => {
  if (mongoose.connection.readyState !== 1) {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
    await mongoose.connect(process.env.MONGODB_URI);
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
        // optional flag passed from client to indicate registration
        register: { label: "Register", type: "text" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials.password) return null;

        await connectMongo();

        const isRegister = credentials.register === true || credentials.register === "true";

        if (isRegister) {
          // Register new user if none exists
          const existing = await User.findOne({ email: credentials.email });
          if (existing) return null; // don't allow duplicate registration

          const hashed = await bcrypt.hash(credentials.password, 10);
          const created = await User.create({
            email: credentials.email,
            password: hashed,
            name: credentials.email.split("@")[0],
          });

          return { id: created._id.toString(), email: created.email, name: created.name };
        }

        // Login flow
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],

  session: { strategy: "jwt" as const },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ user }: any) {
      try {
        if (!user?.email) return true; // some providers may not supply an email
        await connectMongo();
        await User.findOneAndUpdate(
          { email: user.email },
          { $set: { name: user.name ?? undefined }, $setOnInsert: { createdAt: new Date() } },
          { upsert: true, setDefaultsOnInsert: true }
        );
      } catch (err) {
        console.error("Error upserting user on signIn:", err);
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
