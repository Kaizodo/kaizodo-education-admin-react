import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import { ModalBody, ModalFooter } from '@/components/common/Modal'
import TextField from '@/components/common/TextField';
import { Shipment } from '@/data/Shipment';
import { useForm } from '@/hooks/use-form';
import { cn } from '@/lib/utils';
import { UniversalCategoryService } from '@/services/UniversalCategoryService';
import { UserOrderService } from '@/services/UserOrderService';
import { useEffect, useState } from 'react';
import { LuCircle, LuCircleCheck } from 'react-icons/lu';
import { TbMapPinCancel } from 'react-icons/tb';

export default function CancelShipmentDialog({ shipment, onSuccess }: { shipment: Shipment, onSuccess: () => void }) {
    const [form, setValue] = useForm<any>({})
    const [reasons, setReasons] = useState<{ id: number, name: string, description: string }[]>([]);
    const [loadingReasons, setLoadingReasons] = useState(false);




    const loadReasons = async () => {
        if (reasons.length > 0) {
            return;
        }
        setLoadingReasons(true);
        var r = await UniversalCategoryService.all({
            is_seller_order_cancellation_reason: 1
        });
        if (r.success) {
            setReasons(r.data);
        }
        setLoadingReasons(false);
    }


    useEffect(() => {
        loadReasons();
    }, [])


    return (
        <>
            <ModalBody>
                {loadingReasons && <CenterLoading className="relative h-[100px]" />}
                <div className='grid grid-cols-2 gap-3'>
                    {reasons.map(reason => {

                        return <label
                            onClick={() => setValue('universal_category_id')(reason.id)}
                            className={cn(
                                'flex flex-row items-center gap-3 border p-2 rounded-lg bg-white hover:bg-accent transition-all cursor-pointer',
                                form.universal_category_id === reason.id && " bg-sky-50 border-sky-500"
                            )}>
                            {form.universal_category_id !== reason.id && <LuCircle className='text-xl' />}
                            {form.universal_category_id === reason.id && <LuCircleCheck className='text-xl' />}
                            <div className='flex flex-col'>
                                <span className='text-sm font-medium'>{reason.name}</span>
                                <span className='text-xs'>{reason.description}</span>
                            </div>
                        </label>
                    })}
                </div>
                <TextField value={form.remarks} onChange={setValue('remarks')} placeholder='Enter Notes / Remarks' multiline rows={5}>Notes / Remarks</TextField>

            </ModalBody>
            <ModalFooter>

                <Btn
                    disabled={!form.universal_category_id}
                    size={'sm'}
                    variant={'destructive'}
                    asyncClick={async () => {
                        var r = await UserOrderService.cancelShipment({
                            shipment_id: shipment.id,
                            remarks: form.remarks,
                            universal_category_id: form.universal_category_id
                        });
                        if (r.success) {
                            onSuccess();
                        }
                        return r.success;
                    }}>Cancel Order <TbMapPinCancel /></Btn>
            </ModalFooter>
        </>
    );
}
