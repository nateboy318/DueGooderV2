import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { type EmailConfig } from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "./db/schema/user";
import onUserCreate from "./lib/users/onUserCreate";
import { render } from "@react-email/components";
import MagicLinkEmail from "./emails/MagicLinkEmail";
import sendMail from "./lib/email/sendMail";
import { appConfig } from "./lib/config";
import { decryptJson } from "./lib/encryption/edge-jwt";

// Overrides default session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      impersonatedBy?: string;
    };
    expires: string;
  }
}

interface ImpersonateToken {
  impersonateIntoId: string;
  impersonateIntoEmail: string;
  impersonator: string;
  expiry: string;
}

const emailProvider: EmailConfig = {
  id: "email",
  type: "email",
  name: "Email",
  async sendVerificationRequest(params) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `Magic link for ${params.identifier}: ${params.url} expires at ${params.expires}`
      );
    }
    const html = await render(
      MagicLinkEmail({ url: params.url, expiresAt: params.expires })
    );

    await sendMail(
      params.identifier,
      `Sign in to ${appConfig.projectName}`,
      html
    );
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
  session: {
    strategy: "jwt",
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
  callbacks: {
    async signIn() {
      return process.env.NEXT_PUBLIC_SIGNIN_ENABLED === "true";
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.email) {
        session.user.email = token.email;
      }
      if (token.impersonatedBy) {
        session.user.impersonatedBy = token.impersonatedBy as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      // If user object is available (after sign in), check if impersonation is happening
      if (user && "impersonatedBy" in user) {
        token.impersonatedBy = user.impersonatedBy;
      }
      
      // NOTE: Do not add anything else to the token, except for the sub
      // This avoids stale data problems, while increasing db roundtrips
      // which is acceptable while starting small.
      return {
        sub: token.sub,
        email: token.email,
        impersonatedBy: token.impersonatedBy,
        iat: token.iat,
        exp: token.exp,
        jti: token.jti,
      };
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    emailProvider,
    CredentialsProvider({
      name: "credentials",
      credentials: {
        signedToken: {
          label: "Signed Token",
          type: "text",
          placeholder: "Signed Token",
          required: true,
        },
      },
      async authorize(credentials) {
        if (!credentials?.signedToken) {
          return null;
        }

        try {
          // The token is already URL encoded, decryptJson handles the decoding
          const impersonationToken = await decryptJson<ImpersonateToken>(
            credentials.signedToken as string
          );
          
          // Validate token expiry
          if (new Date(impersonationToken.expiry) < new Date()) {
            throw new Error("Impersonation token expired");
          }
          
          // Trust the decrypted token without additional database validations
          return {
            id: impersonationToken.impersonateIntoId,
            email: impersonationToken.impersonateIntoEmail,
            impersonatedBy: impersonationToken.impersonator,
          };
        } catch (error) {
          console.error("Error during impersonation:", error);
          return null;
        }
      },
    }),
    // TIP: Add more providers here as needed like Apple, Facebook, etc.
  ],
});
