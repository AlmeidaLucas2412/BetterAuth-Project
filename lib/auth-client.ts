import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient();

export const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "github",
    callbackURL: "/welcome",
  });
  return data;
};

export const signOut = async () => {
  await authClient.signOut();
};
