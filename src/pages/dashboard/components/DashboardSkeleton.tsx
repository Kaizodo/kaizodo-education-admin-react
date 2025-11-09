import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardSkeleton() {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-6">
                <Skeleton className='h-40 bg-gray-200' />
                <Skeleton className='h-40 bg-gray-200' />
                <Skeleton className='h-40 bg-gray-200' />
                <Skeleton className='h-40 bg-gray-200' />
                <Skeleton className='h-40 bg-gray-200' />
                <Skeleton className='h-40 bg-gray-200' />
                <Skeleton className='h-40 bg-gray-200' />
                <Skeleton className='h-40 bg-gray-200' />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className='h-60 bg-gray-200' />
                <Skeleton className='h-60 bg-gray-200' />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className='h-60 bg-gray-200' />
                <Skeleton className='h-60 bg-gray-200' />
            </div>
            <Skeleton className='h-60 bg-gray-200' />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className='h-60 bg-gray-200' />
                <Skeleton className='h-60 bg-gray-200' />
                <Skeleton className='h-60 bg-gray-200' />
            </div>
        </>
    )
}
