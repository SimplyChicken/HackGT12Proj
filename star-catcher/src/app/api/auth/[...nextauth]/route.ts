import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import mongoose from "mongoose";
import User from "@/models/User";

// Force Node.js runtime to avoid Edge runtime issues with MongoDB/Mongoose
export const runtime = 'nodejs';

const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  // Add NEXTAUTH_URL for proper callback handling
  ...(process.env.NEXTAUTH_URL && { url: process.env.NEXTAUTH_URL }),
  pages: {
    signIn: '/accounts',
    error: '/accounts', // Add error page
  },
  session: {
    strategy: 'jwt' as const,
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    // Upsert user into MongoDB on sign in
    async signIn({ user }: any) {
      try {
        if (!user?.email) return true; // allow sign in if no email (provider may not provide)
        
        // Check if MongoDB URI is available
        const uri = process.env.MONGODB_URI;
        if (!uri) {
          console.log("MONGODB_URI not set; skipping user upsert.");
          return true;
        }

        // Ensure mongoose is connected (avoid reconnecting if already connected)
        if (mongoose.connection.readyState !== 1) {
          try {
            await mongoose.connect(uri, {
              maxPoolSize: 10,
              serverSelectionTimeoutMS: 5000,
              socketTimeoutMS: 45000,
            });
            console.log("Connected to MongoDB for user upsert");
          } catch (connectErr) {
            console.error("Failed to connect to MongoDB:", connectErr);
            return true; // Don't block auth flow
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
        console.log(`User upserted successfully: ${user.email}`);
      } catch (err) {
        // Non-fatal for auth flow; log for debugging
        console.error("Failed to upsert user on signIn:", err);
      }
      return true;
    },
    // Session callback to include user data
    async session({ session, user }: any) {
      if (session?.user) {
        session.user.id = user?.id || user?.email;
      }
      return session;
    },
    // JWT callback to handle token
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

// NextAuth requires both GET and POST for all endpoints
// This catch-all route handles: /api/auth/session, /api/auth/csrf, /api/auth/providers, /api/auth/signin, /api/auth/signout, /api/auth/callback, /api/auth/error, etc.
export { handler as GET, handler as POST };