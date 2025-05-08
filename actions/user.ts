"use server";

import { upsertUser } from "@/db/queries";
import { InsertUser } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const saveUser = async (
  data: InsertUser
): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> => {
  const session = await auth.api.getSession({ headers: await headers() });
  const authUserId = session?.user.id || "";

  const userData: InsertUser = {
    id: authUserId,
    name: data.name,
    username: data.username,
    email: data.email,
    authUserId: authUserId,
  };

  try {
    const id = await upsertUser(userData);
    await auth.api.updateUser({
      body: { username: data.username },
      headers: await headers(),
    });
    return {
      success: true,
      id,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Falha ao salvar usuário",
    };
  }
};
