import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/nodemailer";

import { db } from "./db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "./db/schema/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      id: "email",
      server: {
        host: process.env.EMAIL_SERVER_HOST || "localhost",
        port: process.env.EMAIL_SERVER_PORT || 1025,
        auth: {
          user: process.env.EMAIL_SERVER_USER || "user",
          pass: process.env.EMAIL_SERVER_PASSWORD || "pass",
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest(params) {
        if (process.env.NODE_ENV === "development") {
          console.log("Sending email: ", JSON.stringify(params, null, 2));
        }
      },
    }),
    // TODO: Add more providers here as needed
  ],
});
