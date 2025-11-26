import AppCard from '@/components/app/AppCard'
import { useSetValue } from '@/hooks/use-set-value';
import { useEffect, useState } from 'react'
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import { useGlobalContext } from '@/hooks/use-global-context';
import { OrganizationOnboardingStepsProps } from '../StoreEditor';

import { useDefaultParams } from '@/hooks/use-default-params';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';

import TextField from '@/components/common/TextField';
import { StoreService } from '@/services/StoreService';



export default function StoreOnboardingStepDomain({ organization_id, onLoading, registerCallback, $state }: OrganizationOnboardingStepsProps & {
    organization_id?: number
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
        var r = await StoreService.loadDomainDetails(Number(id));
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        registerCallback?.(async () => {
            var r = await StoreService.saveDomainDetails({ ...$state, ...form });
            if (r.success) {
                setContext(c => ({ ...c, admission_progress: r.data.progress }));
                msg.success('Details saved successfuly');
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
                title='Domain Setup'
                subtitle='Configure if portal will open on main domain or specific domain only'
                mainClassName="rounded-none border-none shadow-none"
                contentClassName="px-6 pb-6 flex flex-col gap-6"

            >
                <Radio value={form.is_custom_domain} onChange={setValue('is_custom_domain')} options={YesNoArray}>Custom Domain ?</Radio>
                {form.is_custom_domain === 1 && <>
                    <TextField value={form.domain} onChange={setValue('domain')} placeholder='www.storedomain.com'>Enter domain name</TextField>
                    <Radio value={form.custom_pg} onChange={setValue('custom_pg')} options={YesNoArray}>Use custom payment gateway ?</Radio>
                    {!!form.custom_pg && <>
                        <TextField value={form.pg_key} onChange={setValue('pg_key')} placeholder='Payment gateway key'>Payment Gateway Key</TextField>
                        <TextField value={form.pg_secret} onChange={setValue('pg_secret')} placeholder='Payment gateway secret'>Payment Gateway Secret</TextField>
                    </>
                    }

                </>}

            </AppCard>


        </div>
    )
}
