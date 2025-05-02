import { Header } from "@/components/header";
import { UserForm } from "@/components/user-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function WelcomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isFirstAccess = !session?.user.username;

  return (
    <>
      <Header />
      <main className="flex flex-col items-center">
        {isFirstAccess ? (
          <UserForm />
        ) : (
          <h1>Bem vindo, {session?.user.username}!</h1>
        )}
      </main>
    </>
  );
}
