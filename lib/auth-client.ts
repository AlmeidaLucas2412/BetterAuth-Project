import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

export const signIn = async () => {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: "/welcome",
  });
};

export const signOut = async () => {
  await authClient.signOut();
};
