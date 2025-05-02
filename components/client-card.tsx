import { SelectClient } from "@/db/schema";
import { Mail, Phone, User } from "lucide-react";

type Props = {
  client: SelectClient;
};

export const ClientCard = ({ client }: Props) => {
  return (
    <div className="flex flex-col p-4 border border-foreground gap-y-2">
      <div className="border border-background flex gap-x-4 p-2 items-center">
        <User />
        <span>{client.name}</span>
      </div>
      <div className="border border-background flex gap-x-4 p-2 items-center">
        <Mail />
        <span>{client.email}</span>
      </div>
      <div className="border border-background flex gap-x-4 p-2 items-center">
        <Phone />
        <span>{client.phone}</span>
      </div>
    </div>
  );
};
