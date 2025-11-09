import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import clsx from "clsx";
import { nameLetter } from "@/lib/utils";
import { getRelationName, Relation } from "@/data/user";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  relation:Relation;
  image?: string;
  checked: boolean;
}

interface UserCheckBoxChipProps {
  users: User[];
  onToggle?: (updatedUsers: User[]) => void;
}

export default function UserCheckBoxChip({ users, onToggle }: UserCheckBoxChipProps) {
  const [userList, setUserList] = useState(users);

  const handleToggle = (id: number) => {
    const updated = userList.map((user) =>
      user.id === id ? { ...user, checked: !user.checked } : user
    );
    setUserList(updated);
    onToggle?.(updated); // optional callback
  };

  return (
    <div className="flex flex-wrap gap-2">
      {userList.map((user) => {
     
        return (
          <div
            key={user.id}
            onClick={() => handleToggle(user.id)}
            className={clsx(
              "flex items-center space-x-3 px-3 py-1 rounded-full border shadow-sm cursor-pointer transition-colors w-fit",
              user.checked
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-foreground"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image} alt={user.first_name} />
              <AvatarFallback>{nameLetter(user.first_name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium">{user.first_name}</span>
              <span className="text-xs text-muted-foreground">{ getRelationName( user.relation)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
