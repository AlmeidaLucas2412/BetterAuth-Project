import { UserForm } from "@/components/user-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function WelcomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isFirstAccess = !session?.user.username;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {isFirstAccess ? (
        <UserForm />
      ) : (
        <h1>Bem vindo, {session?.user.username}!</h1>
      )}
    </main>
  );
}
