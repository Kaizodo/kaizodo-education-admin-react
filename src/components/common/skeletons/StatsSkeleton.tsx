import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type StatsSkeletonProps = {
    cols?: number,
    className?: string
}

export default function StatsSkeleton({ cols = 4, className }: StatsSkeletonProps) {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-4`}>
            {Array.from({ length: cols }).map((_, i) => (
                <Skeleton key={i} className={cn(
                    "h-[100px] bg-gray-300",
                    className
                )} />
            ))}
        </div>
    )
}
