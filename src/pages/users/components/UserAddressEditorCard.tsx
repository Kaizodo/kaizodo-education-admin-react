import AppCard from '@/components/app/AppCard'
import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import SuggestCity from '@/components/common/suggest/SuggestCity';
import SuggestCountry from '@/components/common/suggest/SuggestCountry'
import SuggestDistrict from '@/components/common/suggest/SuggestDistrict';
import SuggestLocality from '@/components/common/suggest/SuggestLocality';
import SuggestState from '@/components/common/suggest/SuggestState';
import TextField from '@/components/common/TextField';
import { useSetValue } from '@/hooks/use-set-value';
import { msg } from '@/lib/msg';
import { UserService } from '@/services/UserService';
import { useEffect, useState } from 'react'

export default function UserAddressEditorCard({ id }: { id: number }) {
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const [saving, setSaving] = useState(false);
    const save = async () => {
        setSaving(true);
        var r = await UserService.saveAddressDetails(form);
        if (r.success) {
            msg.success('Address details saved');
        }
        setSaving(false);
    }

    const load = async () => {
        setLoading(true);
        var r = await UserService.loadAddressDetails(id);
        if (r.success) {
            setForm(r.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, [id])
    return (
        <AppCard
            title='Address Information'
            actions={<div className='me-6'><Btn size={'sm'} onClick={save} loading={saving}>Save Address</Btn></div>}
        >
            {loading && <CenterLoading className="relative h-[400px]" />}

            {!loading && <>
                <div className='p-3 border-b'>
                    <span className='font-bold'>Permanent Address</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4  ">

                        <SuggestCountry
                            value={form.country_id}
                            selected={{ id: form.country_id, name: form.country_name }}
                            onChange={setValue('country_id', 'state_id', 'city_id', 'district_id', 'locality_id')}
                        />
                        <SuggestState
                            disabled={!form.country_id}
                            country_id={form.country_id}
                            value={form.state_id}
                            selected={{ id: form.state_id, name: form.state_name }}
                            onChange={setValue('state_id', 'city_id', 'district_id', 'locality_id')}
                        />
                        <SuggestCity
                            disabled={!form.country_id || !form.state_id}
                            state_id={form.state_id}
                            value={form.city_id}
                            selected={{ id: form.city_id, name: form.city_name }}
                            onChange={setValue('city_id', 'locality_id')}
                        />
                        <SuggestDistrict
                            disabled={!form.country_id || !form.state_id}
                            state_id={form.state_id}
                            value={form.district_id}
                            selected={{ id: form.district_id, name: form.district_name }}
                            onChange={setValue('district_id', 'locality_id')}
                        />
                        <SuggestLocality
                            disabled={!form.country_id || !form.state_id || !form.city_id}
                            country_id={form.country_id}
                            state_id={form.state_id}
                            city_id={form.city_id}
                            value={form.locality_id}
                            selected={{ id: form.locality_id, name: form.locality_name }}
                            onChange={setValue('locality_id')}
                        />
                        <TextField value={form.pincode} onChange={setValue('pincode')}>Pincode</TextField>
                        <TextField value={form.permanent_address} onChange={setValue('permanent_address')} multiline>Permanent Address</TextField>
                    </div>
                </div>
                <div className='p-3'>
                    <TextField value={form.present_address} onChange={setValue('present_address')} multiline>Present Address</TextField>
                </div>
            </>}
        </AppCard>
    )
}
