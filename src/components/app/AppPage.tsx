import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'
import Btn from '../common/Btn'
import { LuArrowLeft } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

type Props = {
    enableBack?: boolean,
    backRoute?: string | number,
    title?: string,
    subtitle?: ReactNode,
    actions?: React.ReactNode,
    children?: React.ReactNode,
    containerClassName?: string
}

export default function AppPage({ enableBack, title, subtitle, actions, children, containerClassName, backRoute = -1 }: Props) {
    const navigate = useNavigate();
    return (
        <>
            {(!!title || !!subtitle || !!actions) && <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-6 space-y-6">
                <div className='flex flex-row items-center gap-3'>
                    {!!enableBack && <Btn variant={'outline'} onClick={() => navigate(backRoute as string)}><LuArrowLeft /></Btn>}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
                        {typeof subtitle === 'string' && <p className="text-muted-foreground">{subtitle}</p>}
                        {typeof subtitle !== 'string' && subtitle}
                    </div>
                </div>
                {actions}
            </div>}
            <div className={cn(
                "px-4 md:px-6",
                containerClassName
            )}>
                {children}
            </div>
        </>
    )
}
