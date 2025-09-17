// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          // Needed for creating Google Forms + Drive access
          scope:
            "openid email profile https://www.googleapis.com/auth/forms.body https://www.googleapis.com/auth/drive.file",
          access_type: "offline", // get refresh_token
          prompt: "consent",
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Store tokens in JWT
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expires_at = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + 3600 * 1000; // fallback 1h
      }
      return token;
    },

    // Expose token on session
    async session({ session, token }) {
      session.user.id = token.sub;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
