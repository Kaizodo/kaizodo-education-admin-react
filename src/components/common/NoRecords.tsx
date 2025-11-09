import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { FaBoxOpen } from "react-icons/fa6";
import { IconType } from "react-icons/lib";

type Props = {
    icon?: IconType,
    title?: string,
    subtitle?: string,
    action?: React.ReactNode,
    className?: ClassValue
}

export default function NoRecords({
    icon: Icon = FaBoxOpen,
    title = 'No Records Found',
    subtitle = 'Try adjusting your filters or add new data.',
    className,
    action
}: Props) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center h-64 text-primary",
            className
        )}>
            <Icon className="text-6xl mb-4" />
            <p className="text-xl font-medium">{title}</p>
            <p className="text-sm mt-1 mb-4">{subtitle}</p>
            {action}
        </div>
    )
}
