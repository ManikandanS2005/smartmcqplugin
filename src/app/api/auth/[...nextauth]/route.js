import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // Secret used to encrypt tokens, sessions, etc.
  secret: process.env.NEXTAUTH_SECRET,

  // Optional: Customize the session object returned to the client
  callbacks: {
    async session({ session, token, user }) {
      // You can add extra data here if you want
      session.user.id = token.sub;
      return session;
    },
  },

  // Optional: Debug mode for development
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
