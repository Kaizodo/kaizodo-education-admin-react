import { cn } from '@/lib/utils';
import { ClassValue } from 'clsx';
import React from 'react';

type Props = {
    theme?: 'red' | 'blue' | 'green' | 'yellow' | 'pink'; 
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
    children?: React.ReactNode;
    headerChild?: React.ReactNode;
    containerClassName?: ClassValue;
};

const themeGradient = {
    red: 'from-red-400 to-transparent',
    blue: 'from-blue-400 to-transparent',
    green: 'from-green-400 to-transparent',
    yellow: 'from-yellow-400 to-transparent',  
    pink: 'from-pink-400 to-transparent',     
};

const themeText = {
    red: 'text-red-800',
    blue: 'text-blue-800',
    green: 'text-green-800',
    yellow: 'text-yellow-800', 
    pink: 'text-pink-800',     
};

const themeSubtitle = {
    red: 'text-red-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    pink: 'text-pink-600',      
};


export default function AppReportPage({
    theme = 'blue',
    title,
    subtitle,
    actions,
    children,
    containerClassName,
    headerChild,
}: Props) {
    return (
        <>
            <div className={cn('bg-gradient-to-b', themeGradient[theme])}>
                {(!!title || !!subtitle || !!actions) && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-6 space-y-6">
                        <div>
                            {title && <h1 className={cn("text-2xl md:text-3xl font-bold", themeText[theme])}>{title}</h1>}
                            {subtitle && <p className={cn("text-muted-foreground", themeSubtitle[theme])}>{subtitle}</p>}
                        </div>
                        {actions}
                    </div>
                )}
                {headerChild}
            </div>
            <div
                className={cn(
                    'p-4 md:p-6 space-y-6',
                    containerClassName
                )}
            >
                {children}
            </div>
        </>
    );
}
