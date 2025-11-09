import { cn } from '@/lib/utils'
import { ClassValue } from 'clsx'
import React from 'react'

type Props = {
    title?: string,
    subtitle?: string,
    actions?: React.ReactNode,
    children?: React.ReactNode,
    mainClassName?: ClassValue,
    contentClassName?: ClassValue
}

export default function AppCard({ title, subtitle, children, mainClassName, contentClassName, actions }: Props) {
    return (
        <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', mainClassName)}>
            {!!title && <div className='flex flex-row items-center gap-3'>
                <div className='flex flex-col space-y-1.5 p-6 flex-1'>
                    <h3 className='text-2xl font-semibold leading-none tracking-tight'>{title}</h3>
                    {!!subtitle && <p className='text-sm text-muted-foreground'>{subtitle}</p>}
                </div>
                {actions}
            </div>}
            <div className={cn(
                'p-0',
                contentClassName
            )}>
                {children}
            </div>
        </div>
    )
}
