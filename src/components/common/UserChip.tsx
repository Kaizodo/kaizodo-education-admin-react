import { getRelationName, getUserTypeName, User, UserType } from "@/data/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, nameLetter } from "@/lib/utils";
import { LuLoader, LuX } from "react-icons/lu";
import { useState } from "react";
export default function UserChip({ user, onRemove }: { user: User; onRemove: (user: User) => Promise<boolean> }) {
    const [removing, setRemoving] = useState(false);
    const [removed, setRemoved] = useState(false);

    if (removed) {
        return null;
    }

    return (
        <div onClick={async () => {
            setRemoving(true);
            var r = await onRemove(user);
            if (r) {
                setRemoved(true);
            }
            setRemoving(false);
        }} className={cn(
            "group cursor-pointer flex items-center  gap-2 p-1 text-gray-700 bg-white border text-sm rounded-full hover:border-primary hover:text-primary",
            removing && "cursor-    "
        )}>
            <Avatar className="h-8 w-8">
                <AvatarImage src={user.image} alt={user.first_name} />
                <AvatarFallback>{nameLetter(user.first_name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
                <span className="text-sm font-medium">{user.first_name} {user.last_name}</span>
                {user.user_type == UserType.Parent && <span className="text-xs text-inherit">{getRelationName(user.relation)}</span>}
                {user.user_type == UserType.Student && <span className="text-xs text-inherit">RN: {user.roll_no} | {user.class_name}{user.section_name ? ' | ' + user.section_name : ''}</span>}
                {user.user_type !== UserType.Student && user.user_type !== UserType.Parent && <span className="text-xs text-inherit">E: {user.code} | {user.designation_name ?? getUserTypeName(user.user_type)}</span>}
            </div>
            {!removing && <LuX className="text-xl text-gray-500 me-1 group-hover:text-primary" />}
            {removing && <LuLoader className="text-xl text-gray-500 me-1 group-hover:text-primary animate-spin" />}
        </div>
    );
}
