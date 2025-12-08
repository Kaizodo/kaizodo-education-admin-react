import AppCard from '@/components/app/AppCard'
import { useEffect, useState } from 'react'
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import { useGlobalContext } from '@/hooks/use-global-context';
import { OrganizationOnboardingStepsProps } from '../StoreEditor';

import { useDefaultParams } from '@/hooks/use-default-params';

import { StoreService } from '@/services/StoreService';
import NoRecords from '@/components/common/NoRecords';
import { LuCog } from 'react-icons/lu';
import NavManager from './navigation/NavManager';



export default function StoreOnboardingStepNavigation({ organization_id, onLoading, registerCallback, $state }: OrganizationOnboardingStepsProps & {
    organization_id?: number
}) {
    const { id } = useDefaultParams<{ id: string }>(organization_id ? { id: `${organization_id}` } : undefined);
    const [form, setForm] = useState<any>({
        header: [],
        footer: []
    });
    const [loading, setLoading] = useState(true);
    const { setContext } = useGlobalContext();
    const load = async () => {
        setLoading(true);
        var r = await StoreService.loadNavigation(Number(id));
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        registerCallback?.(async () => {
            if (!form.is_custom_domain) {
                return true;
            }
            var r = await StoreService.saveNavigation({ ...$state, ...form, id: Number(id) });
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
        <AppCard
            title='Navigation'
            subtitle='Manage store header and footer navigation'
            mainClassName="rounded-none border-none shadow-none"
            contentClassName="px-6 pb-6 flex flex-col gap-6"

        >
            {!!form.is_custom_domain &&
                <>
                    <NavManager data={form} setData={setForm} />
                </>}
            {!form.is_custom_domain && <NoRecords icon={LuCog} title='No Settings Avaiable' subtitle='Settings are only avaiable for stores which have cusotm domains' />}

        </AppCard>
    )
}
