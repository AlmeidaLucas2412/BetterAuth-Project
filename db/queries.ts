import { and, count, eq, ilike } from "drizzle-orm";
import db from ".";
import { clients, InsertClient, InsertUser, users } from "./schema";

export const upsertUser = async (userData: InsertUser) => {
  await db.insert(users).values(userData).onConflictDoUpdate({
    target: users.id,
    set: userData,
  });
};

export const upsertClient = async (clientData: InsertClient) => {
  await db.insert(clients).values(clientData).onConflictDoUpdate({
    target: clients.email,
    set: clientData,
  });
};

export const getClientsByUserId = async (
  userId: string,
  page = 1,
  pageSize = 10,
  name?: string
) => {
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
  };
};
