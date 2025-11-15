import AppCard from '@/components/app/AppCard'
import { useSetValue } from '@/hooks/use-set-value';
import { useEffect, useState } from 'react'
import { pickFileVirtually } from '@/lib/utils';
import { useCropper } from '@/hooks/use-cropper';
import Btn from '@/components/common/Btn';
import { LuUpload } from 'react-icons/lu';
import TextField from '@/components/common/TextField';
import DateTimeField from '@/components/common/DateTimeField';
import { OrganizationService } from '@/services/OrganizationService';
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import Dropdown from '@/components/common/Dropdown';
import { useGlobalContext } from '@/hooks/use-global-context';
import { OrganizationOnboardingStepsProps } from '../OrganizationEditor';
import { Label } from '@/components/ui/label';
import { CurriculumTypeArray, getOrganizationTypeName, OrganizationTypeArray } from '@/data/Organization';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import SuggestState from '@/components/common/suggest/SuggestState';
import SuggestCity from '@/components/common/suggest/SuggestCity';
import SuggestDistrict from '@/components/common/suggest/SuggestDistrict';
import SuggestLocality from '@/components/common/suggest/SuggestLocality';
import { useDefaultParams } from '@/hooks/use-default-params';



export default function OrganizationOnboardingStepBasicInformation({ organization_id, onLoading, registerCallback, $state }: OrganizationOnboardingStepsProps & {
    organization_id?: number
}) {
    const { id } = useDefaultParams<{ id: string }>(organization_id ? { id: `${organization_id}` } : undefined);
    const { openCropperFile } = useCropper();
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const [loading, setLoading] = useState(true);
    const { setContext } = useGlobalContext();
    const load = async () => {
        setLoading(true);
        var r = await OrganizationService.loadBasicDetails(Number(id));
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        registerCallback?.(async () => {
            var r = await OrganizationService.saveBasicDetails({ ...$state, ...form });
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
                title='Organization Information'
                subtitle='Please provide details about the organization'
                mainClassName="rounded-none border-none shadow-none"
                contentClassName="px-6 pb-6 flex flex-col gap-6"

            >
                <TextField value={form.name} onChange={setValue('name')} placeholder="Enter school name">Organization Name *</TextField>
                <TextField value={form.code} onChange={setValue('code')} placeholder="e.g., SCH001">Unique Code/ID *</TextField>


                <div className='grid grid-cols-2 gap-3'>
                    <Dropdown
                        searchable={false}
                        value={form.organization_type}
                        selected={{ id: form.organization_type, name: getOrganizationTypeName(form.organization_type) }}
                        onChange={setValue('organization_type')}
                        placeholder='Select organization type'
                        getOptions={async () => OrganizationTypeArray}
                    >Organization Type*</Dropdown>
                    <Radio value={form.is_govt} onChange={setValue('is_govt')} options={YesNoArray}>Is this a government institution ?</Radio>
                    <Radio value={form.curriculum_type} onChange={setValue('curriculum_type')} options={CurriculumTypeArray}>Curriculum Type</Radio>
                    <DateTimeField value={form.dof} onChange={setValue('dof')} placeholder='Select founding date' mode='date'>Date of Establishment / Founding</DateTimeField>
                    <TextField type='number' value={form.no_of_students} onChange={setValue('no_of_students')} placeholder='Enter number of students'>Number of Students</TextField>
                    <TextField type='number' value={form.no_of_branches} onChange={setValue('no_of_branches')} placeholder='Enter number of branches'>Number of Branches</TextField>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="logo">Small Size Logo</Label>
                    <div className="flex items-center space-x-3">
                        {!!form.logo_short && <img src={form.logo_short} className='h-[40px] w-[40px] border rounded-lg' />}
                        <Btn type="button" variant="outline" className="flex items-center space-x-2" onClick={async () => {
                            const files = await pickFileVirtually();
                            if (files.length > 0) {
                                const file = await openCropperFile(files[0], {
                                    format: 'file',
                                    aspectRatio: 1
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
                                    format: 'file',
                                    aspectRatio: 3 / 1
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
