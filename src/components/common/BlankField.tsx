import { ClassValue } from 'clsx'
import { Label } from '../ui/label'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
type Props = {
    onClick: () => void,
    children?: ReactNode,
    title?: string,
    disabled?: boolean,
    className?: ClassValue
}
export default function BlankField({ children, onClick, title, className, disabled }: Props) {
    return (
        <div className='space-y-2'>
            <Label className='mb-2'>{title}</Label>
            <div onClick={() => !disabled ? onClick() : undefined} className={cn(
                `flex hover:bg-sky-50 select-none cursor-pointer active:bg-slate-100 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background     md:text-sm`,
                disabled && "bg-gray-100 cursor-not-allowed hover:bg-gray-100 active:bg-gray-100 active:shadow-none",
                className
            )}>
                {children}
            </div>
        </div>
    )
}
