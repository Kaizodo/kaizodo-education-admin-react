import { ClassValue } from "clsx";
import PosNumpadWidget from "./PosNumpad";
import { cn } from "@/lib/Utils";
import cashPaymentIcon from '@/assets/icons/cash-payment.png';
import cardPaymentIcon from '@/assets/icons/card-payment.png';
import chequePaymentIcon from '@/assets/icons/cheque-payment.png';
import creditPaymentIcon from '@/assets/icons/customer-balance.png';


const PostAction = ({ image, title, subtitle, className }: { image: string, title: string, subtitle: string, badge?: number, className?: ClassValue }) => {
    return (<div className={cn("p-3 bg-white shadow-lg rounded-tr-sm rounded-br-sm border-t border-e border-b  flex flex-row items-center gap-2", className)}>
        <img src={image} className="h-[40px]" />
        <div className="flex flex-col">
            <span className="text-[12px] font-bold uppercase">{title}</span>
            <span className="text-[10px]">{subtitle}</span>
        </div>
    </div>)
}

export default function PosActionsWidget() {
    return (
        <div className="w-full grid grid-cols-4 border-t h-[340px] overflow-hidden">
            <div className="col-span-1 flex flex-col gap-3 py-3 shadow-inner [box-shadow:inset_0_0px_5px_rgba(0,0,0,0.2)]  bg-gray-50 pe-3">
                <PostAction image={cashPaymentIcon} title="Cash Payment" subtitle="Pay using cash" badge={0} />
                <PostAction image={cardPaymentIcon} title="Swipe OR UPI" subtitle="Pay using swipe machine" badge={0} />
                <PostAction image={chequePaymentIcon} title="cheque" subtitle="Pay using bank cheque" badge={0} />
                <PostAction image={creditPaymentIcon} title="credit" subtitle="Pay using customer balance" badge={0} />
            </div>
            <div className="col-span-2">
                <PosNumpadWidget />
            </div>
            <div className="col-span-1 flex flex-col gap-3 py-3 shadow-inner [box-shadow:inset_0_0px_-5px_rgba(0,0,0,0.2)]  bg-gray-50 ps-3">
                <PostAction image={cashPaymentIcon} title="Cash Payment" subtitle="Pay using cash" badge={0} className="border-e-0 border-s rounded-tr-none rounded-br-none rounded-tl-sm rounded-bl-sm" />
                <PostAction image={cardPaymentIcon} title="Swipe OR UPI" subtitle="Pay using swipe machine" badge={0} className="border-e-0 border-s rounded-tr-none rounded-br-none rounded-tl-sm rounded-bl-sm" />
                <PostAction image={chequePaymentIcon} title="cheque" subtitle="Pay using bank cheque" badge={0} className="border-e-0 border-s rounded-tr-none rounded-br-none rounded-tl-sm rounded-bl-sm" />
                <PostAction image={creditPaymentIcon} title="credit" subtitle="Pay using customer balance" badge={0} className="border-e-0 border-s rounded-tr-none rounded-br-none rounded-tl-sm rounded-bl-sm" />
            </div>
        </div>
    )
}
