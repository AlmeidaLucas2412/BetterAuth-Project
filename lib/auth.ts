import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/db";
import { authAccount, authSession, authUser, verification } from "@/db/schema";

export const auth = betterAuth({
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        input: true,
        unique: true,
        defaultValue: null,
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: authUser,
      session: authSession,
      account: authAccount,
      verification: verification,
    },
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
