"use server";

import { upsertUser } from "@/db/queries";
import { InsertUser } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const saveUser = async (data: InsertUser) => {
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
    await upsertUser(userData);
    await auth.api.updateUser({
      body: { username: data.username },
      headers: await headers(),
    });
  } catch (error) {
    console.error(error);
  }
};
