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
  const [{ id }] = await db
    .insert(users)
    .values(userData)
    .onConflictDoUpdate({
      target: users.id,
      set: userData,
    })
    .returning({ id: users.id });

  return id;
};

export const upsertClient = async (
  clientData: InsertClient
): Promise<SelectClient> => {
  const result = await db
    .insert(clients)
    .values(clientData)
    .onConflictDoUpdate({
      target: clients.email,
      set: clientData,
    })
    .returning();

  if (!result || result.length === 0) {
    throw new Error("Falha ao inserir ou atualizar cliente");
  }

  return result[0];
};

export const getClientsByUserId = async (
  userId: string,
  page = 1,
  pageSize = 10,
  name?: string
) => {
  const cacheKey = `clients:${userId}:${page}:${pageSize}:${name || ""}`;
  const result = await db.query.clients.findMany({
    orderBy: (client, { asc }) => asc(client.name),
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
    cacheKey,
  };
};
