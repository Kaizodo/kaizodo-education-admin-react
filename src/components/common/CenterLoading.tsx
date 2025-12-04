import { cn } from "@/lib/utils";
import type { ClassValue } from "clsx";
import { LuLoader } from "react-icons/lu";

type Props = {
    className?: ClassValue
}

export default function CenterLoading({ className }: Props) {
    return (
        <div className={cn("fixed inset-0 z-[9999] flex justify-center items-center bg-white/70 text-primary", className)}>
            <LuLoader className="animate-spin text-4xl " />
        </div>
    )
}
