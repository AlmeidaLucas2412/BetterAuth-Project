import db from ".";
import { InsertUser, users } from "./schema";

export const upsertUser = async (userData: InsertUser) => {
  await db.insert(users).values(userData).onConflictDoUpdate({
    target: users.id,
    set: userData,
  });
};
