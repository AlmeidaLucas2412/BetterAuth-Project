"use server";

import { getClientsByUserId, upsertClient } from "@/db/queries";
import { InsertClient, SelectClient } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const saveClient = async (
  data: InsertClient
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await upsertClient(data);
    return { success: true };
  } catch {
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

  return await getClientsByUserId(userId, page, pageSize, name);
};
