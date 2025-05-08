import { and, count, eq, ilike } from "drizzle-orm";
import db from ".";
import {
  clients,
  InsertClient,
  InsertUser,
  SelectClient,
  users,
} from "./schema";

export const upsertUser = async (userData: InsertUser) => {
  await db.insert(users).values(userData).onConflictDoUpdate({
    target: users.id,
    set: userData,
  });
};

export const upsertClient = async (
  clientData: InsertClient
): Promise<SelectClient> => {
  // Use returning() to get the inserted/updated record directly
  const result = await db
    .insert(clients)
    .values(clientData)
    .onConflictDoUpdate({
      target: clients.email,
      set: clientData,
    })
    .returning();

  if (!result || result.length === 0) {
    throw new Error("Failed to insert or update client");
  }

  return result[0];
};

export const getClientsByUserId = async (
  userId: string,
  page = 1,
  pageSize = 10,
  name?: string
) => {
  // Add cache keys to help with cache invalidation/optimistic updates
  const cacheKey = `clients:${userId}:${page}:${pageSize}:${name || ""}`;

  const result = await db.query.clients.findMany({
    orderBy: (client, { desc, asc }) => [
      desc(client.createdAt), // Show newest clients first
      asc(client.name), // Then sort by name
    ],
    limit: pageSize,
    offset: (page - 1) * pageSize,
    where: name
      ? and(eq(clients.userId, userId), ilike(clients.name, `%${name}%`))
      : eq(clients.userId, userId),
  });

  const total = await db
    .select({ count: count() })
    .from(clients)
    .where(
      name
        ? and(eq(clients.userId, userId), ilike(clients.name, `%${name}%`))
        : eq(clients.userId, userId)
    );

  return {
    clients: result ?? [],
    total: total[0].count ?? 0,
    cacheKey, // Include cache key for better cache management
  };
};
