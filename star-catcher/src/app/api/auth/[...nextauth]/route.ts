import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import mongoose from "mongoose";
import User from "../../../../models/User";

const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    // Upsert user into MongoDB on sign in
    async signIn({ user }: any) {
      try {
        if (!user?.email) return true; // allow sign in if no email (provider may not provide)
        // Ensure mongoose is connected (avoid reconnecting if already connected)
        if (mongoose.connection.readyState !== 1) {
          const uri = process.env.MONGODB_URI;
          if (uri) {
            await mongoose.connect(uri);
          } else {
            console.error("MONGODB_URI not set; skipping user upsert.");
            return true;
          }
        }

        // Upsert user by email
        await User.findOneAndUpdate(
          { email: user.email },
          {
            $set: {
              name: user.name ?? undefined,
              // store other available fields if you want (e.g., image)
              // image: user.image,
            },
            $setOnInsert: {
              createdAt: new Date(),
            },
          },
          { upsert: true, setDefaultsOnInsert: true }
        );
      } catch (err) {
        // Non-fatal for auth flow; log for debugging
        console.error("Failed to upsert user on signIn:", err);
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };