import { Skeleton } from '@/components/ui/skeleton'

export default function TicketDetailSkeleton() {
    return (
        <>
            <div className="lg:col-span-6">
                <Skeleton className='w-full h-[500px] bg-white shadow-lg p-3 flex flex-col gap-3'>
                    <Skeleton className='h-10 border w-full max-w-[300px]' />
                    <Skeleton className='h-5 border w-full max-w-[400px]' />
                    <Skeleton className='h-20 border w-full' />
                </Skeleton>
            </div>

            <div className="lg:col-span-3">
                <div className='w-full h-[500px] bg-white shadow-lg p-3 flex flex-col gap-3'>
                    <Skeleton className='h-10 border w-full ' />
                    <Skeleton className='h-20 border w-full' />
                    <Skeleton className='h-5 border w-full ' />
                </div>
            </div>
        </>
    )
}
