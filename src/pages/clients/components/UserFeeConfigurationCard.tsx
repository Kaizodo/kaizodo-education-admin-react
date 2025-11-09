import AppCard from '@/components/app/AppCard';
import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import NoRecords from '@/components/common/NoRecords';
import { FeeCollectionFrequency } from '@/data/Fee';
import { useSetValue } from '@/hooks/use-set-value';
import { msg } from '@/lib/msg';
import { cn } from '@/lib/utils';
import { UserService } from '@/services/UserService';
import { useEffect, useState } from 'react';
import { FaRegCircle, FaRegCircleCheck } from 'react-icons/fa6';


type Props = {
    id: number
}

export default function UserFeeConfigurationCard({ id }: Props) {
    const [state, setState] = useState<{
        fee_structure_categories: {
            fee_category_id: number,
            frequency: FeeCollectionFrequency,
            amount: number,
        }[],
        installments: number[],
        installment_count: number
    }>({
        fee_structure_categories: [],
        installments: [],
        installment_count: 0
    });
    const setValue = useSetValue(setState);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const detail = async () => {
        setLoading(true);
        var r = await UserService.getFeeConfiguration({
            user_id: id
        });
        if (r.success) {
            setState(r.data);
        }
        setLoading(false);
    }

    const save = async () => {
        setSaving(true);
        var r = await UserService.setFeeConfiguration({
            user_id: id,
            installment_count: state.installment_count
        });
        if (r.success) {
            msg.success('Configuration saved successfuly');
        }
        setSaving(false);
    }

    useEffect(() => {
        detail();
    }, [id])




    return (
        <div className='flex flex-col gap-3'>



            {loading && <CenterLoading className='relative h-[400px]' />}
            {state.installments.length == 0 && !loading && <NoRecords title='No Fee Structures Found' subtitle='Try creating fee structure for selected session and selected class' />}


            {!loading && state.installments.length > 0 && <AppCard title='Fee Configuration' subtitle='Select fee option'>
                <div className='px-3 pb-3 space-y-3'>
                    <div className='border p-3 rounded-lg space-y-3'>
                        <span className='font-bold text-gray-500 text-lg'>Payment Option</span>
                        <div onClick={() => setValue('installment_count')(0)} className={cn(
                            `border rounded-lg p-3 flex flex-row items-center gap-3 hover:bg-sky-50 cursor-pointer select-none`,
                            state.installment_count == 0 ? 'bg-sky-50' : ''
                        )}>
                            {state.installment_count == 0 ? <FaRegCircleCheck /> : <FaRegCircle />}
                            <div className=' flex flex-col'>
                                <strong className='text-sm'>Monthly Fee</strong>
                                <span className='text-xs text-gray-600'>Fee will be collected monthly</span>
                            </div>
                        </div>
                        <div onClick={() => setValue('installment_count')(1)} className={cn(
                            `border rounded-lg p-3 flex flex-row items-center gap-3 hover:bg-sky-50 cursor-pointer select-none`,
                            state.installment_count == 1 ? 'bg-sky-50' : ''
                        )}>
                            {state.installment_count == 1 ? <FaRegCircleCheck /> : <FaRegCircle />}
                            <div className=' flex flex-col'>
                                <strong>Advance Fee (1 Installment)</strong>
                                <span className='text-xs text-gray-600'>Fee will be paid in advance for 1 year</span>
                            </div>
                        </div>
                        <div onClick={() => setValue('installment_count')(2)} className={cn(
                            `border rounded-lg p-3 flex flex-row items-center gap-3 hover:bg-sky-50 cursor-pointer select-none`,
                            state.installment_count == 2 ? 'bg-sky-50' : ''
                        )}>
                            {state.installment_count == 2 ? <FaRegCircleCheck /> : <FaRegCircle />}
                            <div className=' flex flex-col'>
                                <strong>BiAnnual Fee (2 Installments)</strong>
                                <span className='text-xs text-gray-600'>Fee will be paid in 2 installments</span>
                            </div>
                        </div>
                        <div onClick={() => setValue('installment_count')(4)} className={cn(
                            `border rounded-lg p-3 flex flex-row items-center gap-3 hover:bg-sky-50 cursor-pointer select-none`,
                            state.installment_count == 4 ? 'bg-sky-50' : ''
                        )}>
                            {state.installment_count == 4 ? <FaRegCircleCheck /> : <FaRegCircle />}
                            <div className=' flex flex-col'>
                                <strong>Quarterly Fee (4 Installments)</strong>
                                <span className='text-xs text-gray-600'>Fee will be collected quarterly</span>
                            </div>
                        </div>
                    </div>


                    <Btn size={'sm'} onClick={save} loading={saving}>Save Configuration</Btn>
                </div>

            </AppCard>}
        </div>
    )
}
