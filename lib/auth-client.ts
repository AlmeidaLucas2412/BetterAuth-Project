import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

const { signIn, signOut, getSession } = authClient;

const customSignIn = () =>
  signIn.social({
    provider: "github",
    callbackURL: "/welcome",
  });

export { signIn, signOut, getSession, customSignIn };
