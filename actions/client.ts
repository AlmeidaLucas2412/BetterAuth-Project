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

    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const updatedClient = await upsertClient({
      ...data,
      userId: userId,
    });

    // Revalidate to ensure cached data is updated
    revalidatePath("/clients");

    return {
      success: true,
      client: updatedClient,
    };
  } catch (error) {
    console.error("Failed to save client:", error);
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

  // Set cache control headers for better client-side caching
  const headersList = headers();
  const response = NextResponse.next();

  // If we're searching, don't cache
  if (name) {
    response.headers.set("Cache-Control", "no-cache, private");
  } else {
    // Cache for 2 minutes, but validate on every request
    response.headers.set("Cache-Control", "max-age=120, private");
  }

  return await getClientsByUserId(userId, page, pageSize, name);
};
