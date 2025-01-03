import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { type EmailConfig } from "next-auth/providers/email";
import { db } from "./db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "./db/schema/user";
import onUserCreate from "./lib/users/onUserCreate";

const emailProvider: EmailConfig = {
  id: "email",
  type: "email",
  name: "Email",
  async sendVerificationRequest(params) {
    if (process.env.NODE_ENV === "development") {
      console.log("Sending email: ", JSON.stringify(params, null, 2));
    }
    // TODO: Implement email provider
  },
};

const adapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
  },
  adapter: {
    ...adapter,
    createUser: async (user) => {
      if (!adapter.createUser) {
        throw new Error("Adapter is not initialized");
      }
      const newUser = await adapter.createUser(user);
      // Update the user with the default plan
      await onUserCreate(newUser);

      return newUser;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    emailProvider,
    // TIP: Add more providers here as needed like Apple, Facebook, etc.
  ],
});
