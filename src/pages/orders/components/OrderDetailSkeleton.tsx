import { Skeleton } from "@/components/ui/skeleton"

export default function DetailSkeleton() {
    return <div>
        <Skeleton className='h-[70px] bg-white border w-full mb-3' />
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className='lg:col-span-2 space-y-8'>
                <Skeleton className='h-[200px] bg-white border w-full' />
                <Skeleton className='h-[200px] bg-white border w-full' />
            </div>
            <div className='lg:col-span-1 mt-8 lg:mt-0 space-y-8'>
                <Skeleton className='h-[200px] bg-white border w-full' />
            </div>
        </div>
    </div>
}