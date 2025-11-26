import AppCard from '@/components/app/AppCard'
import { useSetValue } from '@/hooks/use-set-value';
import { useEffect, useState } from 'react'
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import { useGlobalContext } from '@/hooks/use-global-context';
import { OrganizationOnboardingStepsProps } from '../StoreEditor';

import { useDefaultParams } from '@/hooks/use-default-params';
import { StoreService } from '@/services/StoreService';
import { Switch } from '@/components/ui/switch';



export default function StoreOnboardingStepConfirmation({ organization_id, onLoading, registerCallback, onPublish }: OrganizationOnboardingStepsProps & {
    organization_id?: number,
    onPublish: (publish: number) => void
}) {
    const { id } = useDefaultParams<{ id: string }>(organization_id ? { id: `${organization_id}` } : undefined);
    const [form, setForm] = useState<any>({
        all_categories: 1
    });
    const setValue = useSetValue(setForm);
    const [loading, setLoading] = useState(true);
    const { setContext } = useGlobalContext();
    const load = async () => {
        setLoading(true);
        var r = await StoreService.loadPublishStatus(Number(id));
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        registerCallback?.(async () => {
            var r = await StoreService.updatePublishStatus(form);
            if (r.success) {
                setContext(c => ({ ...c, admission_progress: r.data.progress }));
                msg.success('Details saved successfuly');
                onPublish(form.publish);
            }
            return r.success;
        })
    });

    useEffect(() => {
        onLoading?.(loading);
    }, [loading])

    useEffect(() => {
        if (!!id) {
            load();
        } else {
            setLoading(false);
        }
    }, []);


    if (loading) {
        return <CenterLoading className="relative h-[400px]" />
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
            <AppCard
                title='Confirm Submition'
                subtitle='Once confirmed store will be published and employees will be able to login.'
                mainClassName="rounded-none border-none shadow-none"
                contentClassName="px-6 pb-6 flex flex-col gap-6"

            >
                <label className='p-3 rounded-lg gap-3 flex items-center  bg-sky-50 border border-sky-300 hover:bg-sky-100 cursor-pointer select-none'>
                    <div className='flex flex-col flex-1'>
                        <span className='text-sm'>I confirm that all details are correct and store is ready for operation</span>
                        <span className='text-sm'>Once pubished assigned employees can login into store's portal</span>
                    </div>
                    <Switch checked={!!form.publish} onCheckedChange={checked => setValue('publish')(checked ? 1 : 0)} />
                </label>

            </AppCard>


        </div>
    )
}
