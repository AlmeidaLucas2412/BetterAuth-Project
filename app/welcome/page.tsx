import { ClientForm } from "@/components/client-form";
import { Header } from "@/components/header";
import { UserForm } from "@/components/user-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ClientCard } from "@/components/client-card";

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
        <div className="self-start flex flex-col p-4 gap-y-4 w-full">
          <ClientForm userId={session?.user.id || ""} />
          <ClientCard />
        </div>
      </main>
    </>
  );
}
