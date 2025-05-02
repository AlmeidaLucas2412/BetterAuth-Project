import { upsertClient } from "@/db/queries";
import { InsertClient } from "@/db/schema";

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
