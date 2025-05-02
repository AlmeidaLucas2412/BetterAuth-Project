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
