import AppCard from '@/components/app/AppCard'
import { useSetValue } from '@/hooks/use-set-value';
import { useEffect, useState } from 'react'
import { pickFileVirtually } from '@/lib/utils';
import { useCropper } from '@/hooks/use-cropper';
import Btn from '@/components/common/Btn';
import { LuUpload } from 'react-icons/lu';
import TextField from '@/components/common/TextField';
import DateTimeField from '@/components/common/DateTimeField';
import { StoreService } from '@/services/StoreService';
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import { useGlobalContext } from '@/hooks/use-global-context';
import { OrganizationOnboardingStepsProps } from '../StoreEditor';
import { Label } from '@/components/ui/label';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import SuggestState from '@/components/common/suggest/SuggestState';
import SuggestCity from '@/components/common/suggest/SuggestCity';
import SuggestDistrict from '@/components/common/suggest/SuggestDistrict';
import SuggestLocality from '@/components/common/suggest/SuggestLocality';
import { useDefaultParams } from '@/hooks/use-default-params';
import { useNavigate } from 'react-router-dom';
import SuggestStore from '@/components/common/suggest/SuggestStore';



export default function StoreOnboardingStepBasicInformation({ onUpdate, organization_id, onLoading, registerCallback, $state }: OrganizationOnboardingStepsProps & {
    onCreate: (id: number) => void,
    organization_id?: number
}) {
    const navigate = useNavigate();
    const { id } = useDefaultParams<{ id: string }>(organization_id ? { id: `${organization_id}` } : undefined);
    const { openCropperFile } = useCropper();
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const [loading, setLoading] = useState(true);
    const { setContext } = useGlobalContext();
    const load = async () => {
        setLoading(true);
        var r = await StoreService.loadBasicDetails(Number(id));
        if (r.success) {
            onUpdate?.(r.data);
            setForm(r.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        registerCallback?.(async () => {
            var r = await StoreService.saveBasicDetails({ ...$state, ...form });
            if (r.success) {
                setContext(c => ({ ...c, admission_progress: r.data.progress }));
                navigate('/stores/update/' + r.data.id, {
                    state: true
                });
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


    useEffect(() => {
        onUpdate?.(form);
    }, [form])

    if (loading) {
        return <CenterLoading className="relative h-[400px]" />
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
            <AppCard
                title='Store Information'
                subtitle='Please provide details about the store'
                mainClassName="rounded-none border-none shadow-none"
                contentClassName="px-6 pb-6 flex flex-col gap-6"

            >
                <SuggestStore value={form.organization_id} onChange={setValue('organization_id')} placeholder='Select a parent company'>Parent Company</SuggestStore>
                <TextField value={form.name} onChange={setValue('name')} placeholder="Enter store name">Store Name *</TextField>
                <TextField value={form.nickname} onChange={setValue('nickname')} placeholder="Enter nick name" subtitle='Nickname will be used to search'>Nick Name*</TextField>
                <TextField value={form.code} onChange={setValue('code')} placeholder="e.g., ST001">Unique Code/ID *</TextField>


                <div className='grid grid-cols-2 gap-3'>

                    <DateTimeField value={form.dof} onChange={setValue('dof')} outputFormat='Y-MM-DD' previewFormat='DD MMM, Y' placeholder='Select founding date' mode='date'>Date of Establishment / Founding</DateTimeField>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="logo">Small Size Logo</Label>
                    <div className="flex items-center space-x-3">
                        {!!form.logo_short && <img src={form.logo_short} className='h-[40px] w-[40px] border rounded-lg' />}
                        <Btn type="button" variant="outline" className="flex items-center space-x-2" onClick={async () => {
                            const files = await pickFileVirtually();
                            if (files.length > 0) {
                                const file = await openCropperFile(files[0], {
                                    format: 'file'
                                });
                                if (file instanceof File) {
                                    setValue('logo_short_file', 'logo_short')(file, URL.createObjectURL(file));
                                }
                            }
                        }}>
                            <LuUpload className="w-4 h-4" />
                            <span>Upload Logo</span>
                        </Btn>
                        <span className="text-sm text-gray-500">PNG, JPG up to 200KB</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="logo">Full Size Logo</Label>
                    <div className="flex items-center space-x-3">
                        {!!form.logo_full && <img src={form.logo_full} className='h-[40px]  border rounded-lg' />}
                        <Btn type="button" variant="outline" className="flex items-center space-x-2" onClick={async () => {
                            const files = await pickFileVirtually();
                            if (files.length > 0) {
                                const file = await openCropperFile(files[0], {
                                    format: 'file'
                                });
                                if (file instanceof File) {
                                    setValue('logo_full_file', 'logo_full')(file, URL.createObjectURL(file));
                                }
                            }
                        }}>
                            <LuUpload className="w-4 h-4" />
                            <span>Upload Logo</span>
                        </Btn>
                        <span className="text-sm text-gray-500">PNG, JPG up to 200KB</span>
                    </div>
                </div>
            </AppCard>

            <AppCard
                title='Address Information'
                subtitle='Please provide address information '
                mainClassName="rounded-none border-none shadow-none"
                contentClassName="px-6 pb-6 flex flex-col gap-6"

            >
                <div className='grid grid-cols-2 gap-3'>
                    <SuggestCountry value={form.country_id} selected={{ id: form.country_id, name: form.country_name }} onChange={setValue('country_id')} />
                    <SuggestState value={form.state_id} selected={{ id: form.state_id, name: form.state_name }} onChange={setValue('state_id')} />
                    <SuggestCity value={form.city_id} selected={{ id: form.city_id, name: form.city_name }} onChange={setValue('city_id')} />
                    <SuggestDistrict value={form.district_id} selected={{ id: form.district_id, name: form.district_name }} onChange={setValue('district_id')} />
                    <SuggestLocality value={form.locality_id} selected={{ id: form.locality_id, name: form.locality_name }} onChange={setValue('locality_id')} />
                    <TextField value={form.pincode} onChange={setValue('pincode')} placeholder='Enter pincode'>Pincode</TextField>

                </div>
                <TextField value={form.address} onChange={setValue('address')} placeholder="Enter complete address" multiline>Address</TextField>

                <TextField value={form.map_location} onChange={setValue('map_location')} placeholder="Maps URL or coordinates" multiline>Google Maps Location</TextField>

            </AppCard>
        </div>
    )
}
