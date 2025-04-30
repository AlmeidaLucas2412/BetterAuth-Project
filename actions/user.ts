import { upsertUser } from "@/db/queries";
import { InsertUser } from "@/db/schema";

export const saveUser = async (data: InsertUser) => {
  const userData: InsertUser = {
    id: data.id,
    name: data.name,
    email: data.email,
    authUserId: data.authUserId,
  };

  try {
    await upsertUser(userData);
  } catch (error) {
    console.error(error);
  }
};
