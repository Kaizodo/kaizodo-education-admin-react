import { formatDate, formatTime } from "@/lib/utils";
import { ReactNode } from "react";
import { IconType } from "react-icons/lib";

export function TrackingHistoryItem({
    icon: Icon,
    title,
    subtitle,
    datetime,
    show_line = true,
    active = false,
    children
}: {
    icon: IconType,
    title: string,
    subtitle: string,
    datetime?: string,
    show_line?: boolean,
    active?: boolean,
    children?: ReactNode
}) {
    return (
        <div className="relative pb-8">
            {!!show_line && (
                <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-green-200"></div>
            )}

            <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                    {active && (
                        <span className="absolute inset-0 w-10 h-10 rounded-full animate-ping bg-green-400 opacity-30"></span>
                    )}

                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center relative 
                        ${active ? "bg-green-600" : "bg-green-400"} text-white`}
                    >
                        <Icon
                            className={`w-5 h-5 ${active ? "text-white" : "text-white"
                                }`}
                        />
                    </div>
                </div>

                <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between gap-4 mb-1">
                        <div className='w-full'>
                            <p className="font-semibold text-gray-900">{title}</p>
                            <p className="text-sm text-gray-600 my-1">{subtitle}</p>
                            {children}
                        </div>

                        {!!datetime && <div className="text-right flex-shrink-0">
                            <p className="text-sm text-gray-500">
                                {formatDate(datetime)}
                            </p>
                            <p className="text-sm text-gray-500">

                                {formatTime(datetime, 'Y-MM-DD HH:mm:ss')}
                            </p>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
}