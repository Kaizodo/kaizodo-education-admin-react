import { UserOrderIssueType } from "@/data/order";
import { OrderIssueDialogProps } from "./OrderIssueDialog";
import { IconBaseProps, IconType } from "react-icons/lib";
import { CheckCircle } from "lucide-react";
import { LuBan, LuCircle, LuCircleCheck, LuRefreshCw, LuUndo2 } from "react-icons/lu";



const IssueCard = ({
    icon: Icon,
    name,
    selected,
    onClick,
    className
}: { icon: IconType, name: string; selected: boolean; onClick: () => void, className: string }) => {


    return (
        <div
            className={`border rounded-lg p-3 flex flex-row items-center gap-3 ${selected ? 'bg-sky-50 border-sky-300' : 'bg-white'}`}
            onClick={onClick}
        >
            <span className={className}><Icon className={`w-6 h-6`} /></span>
            <h3 className="font-semibold text-sm text-gray-800 flex-1">{name}</h3>
            {selected && <LuCircleCheck className="w-5 h-5 text-indigo-500 ml-auto" />}
            {!selected && <LuCircle className="w-5 h-5 text-indigo-500 ml-auto" />}
        </div>
    );
};

export default function OrderIssueDialogStep1({ form, setValue }: OrderIssueDialogProps) {




    return (
        <>

            <h3 className="text-md font-semibold text-gray-800 mb-3">Issue Type</h3>
            <div className="space-y-3 p-3">
                <IssueCard className='text-red-500' icon={LuBan} name={"Cancel Order"} selected={form.status == UserOrderIssueType.Cancellation} onClick={() => setValue('status')(UserOrderIssueType.Cancellation)} className={""} />
                <IssueCard className='text-orange-500' icon={LuRefreshCw} name={"Replace Item"} selected={form.status == UserOrderIssueType.Replacement} onClick={() => setValue('status')(UserOrderIssueType.Replacement)} className={""} />
                <IssueCard className='text-blue-500' icon={LuUndo2} name={"Customer Return"} selected={form.status == UserOrderIssueType.Return} onClick={() => setValue('status')(UserOrderIssueType.Return)} className={""} />
            </div>


        </>
    );
};