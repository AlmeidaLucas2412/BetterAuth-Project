import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://better-auth-project.vercel.app",
});

const { signIn, signOut, getSession } = authClient;

const customSignIn = () =>
  signIn.social({
    provider: "github",
    callbackURL: "/welcome",
  });

export { signIn, signOut, getSession, customSignIn };
