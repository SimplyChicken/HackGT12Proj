import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    // Credentials provider if you’re using it…
  ],
  secret: process.env.AUTH_SECRET,
});

export const { GET, POST } = handlers; // <- optional, can re-export here
