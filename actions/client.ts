"use server";

import { getClientsByUserId, upsertClient } from "@/db/queries";
import { InsertClient, SelectClient } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const saveClient = async (
  data: InsertClient
): Promise<{
  success: boolean;
  client?: SelectClient;
  error?: string;
}> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user.id;

    if (!userId) return { success: false, error: "Usuário não encontrado" };

    const updatedClient = await upsertClient({ ...data, userId });

    revalidatePath("/clients");

    return {
      success: true,
      client: updatedClient,
    };
  } catch (error) {
    console.error("Falha ao adicionar cliente", error);
    return {
      success: false,
      error: "Falha ao adicionar cliente",
    };
  }
};

export const listClients = async (
  page = 1,
  pageSize = 10,
  name?: string
): Promise<{ clients: SelectClient[]; total: number } | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const response = NextResponse.next();

  if (name) {
    response.headers.set("Cache-Control", "no-cache, private");
  } else {
    response.headers.set("Cache-Control", "max-age=120, private");
  }

  return await getClientsByUserId(userId, page, pageSize, name);
};
