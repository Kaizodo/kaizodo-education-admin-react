import { ReactNode } from "react";
import { IconType } from "react-icons/lib";

type Props = {
    icon?: IconType,
    title?: string,
    subtitle?: string,
    children?: ReactNode
}
export default function Note({ title, subtitle, children, icon: Icon }: Props) {
    return (<div
        className='p-3 flex flex-row gap-3 rounded-lg bg-yellow-100 border items-center mb-3'
    >
        {!!Icon && <Icon className="text-3xl text-red-500" />}
        <div className='flex flex-1 flex-col'>
            <strong className='text-red-500'>{title}</strong>
            {!!subtitle && <p className='mb-0 text-sm'>{subtitle}</p>}
        </div>
        {children}
    </div>
    )
}
