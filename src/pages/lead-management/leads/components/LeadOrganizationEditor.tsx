import Btn from '@/components/common/Btn';
import { ModalBody, ModalFooter } from '@/components/common/Modal'
import AppCard from '@/components/app/AppCard'
import { useEffect, useState } from 'react'
import TextField from '@/components/common/TextField';
import DateTimeField from '@/components/common/DateTimeField';
import Dropdown from '@/components/common/Dropdown';
import { CurriculumTypeArray, getOrganizationTypeName, OrganizationTypeArray } from '@/data/Organization';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import SuggestState from '@/components/common/suggest/SuggestState';
import SuggestCity from '@/components/common/suggest/SuggestCity';
import SuggestDistrict from '@/components/common/suggest/SuggestDistrict';
import SuggestLocality from '@/components/common/suggest/SuggestLocality';


import { useForm } from '@/hooks/use-form';
import { ApiResponseType } from '@/lib/api';
import { LeadService } from '@/services/LeadService';
import CenterLoading from '@/components/common/CenterLoading';
import { msg } from '@/lib/msg';

export default function LeadOrganizationEditor({
    organization_id,
    lead_id,
    onSuccess,
    onCancel
}: {
    lead_id: number,
    organization_id?: number,
    onSuccess: () => void,
    onCancel: () => void
}) {
    const [form, setValue, setForm] = useForm()
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!!organization_id);

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType = await LeadService.saveOrganization({ ...form, lead_id });
        if (r.success) {
            msg.success(organization_id ? 'Organization created successfuly' : 'Organization updated successfuly');
            onSuccess();
        }
        setSaving(false);
    }

    const load = async () => {
        if (!organization_id) {
            return;
        }
        setLoading(true);
        var r = await LeadService.loadOrganization(organization_id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        } else {
            onCancel();
        }
    }

    useEffect(() => {
        if (organization_id) {
            load();
        }
    }, [organization_id])

    if (loading) {
        return <CenterLoading className="h-[400px] relative" />
    }

    return (<>
        <ModalBody className='p-0'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
                <AppCard
                    title='Organization Information'
                    subtitle='Please provide details about the organization'
                    mainClassName="rounded-none border-none shadow-none"
                    contentClassName="px-6 pb-6 flex flex-col gap-6"

                >
                    <TextField value={form.name} onChange={setValue('name')} placeholder="Enter organization name">Organization Name *</TextField>


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

                </AppCard>

                <AppCard
                    title='Address Information'
                    subtitle='Please provide address information '
                    mainClassName="rounded-none border-none shadow-none"
                    contentClassName="px-6 pb-6 flex flex-col gap-6"

                >
                    <div className='grid grid-cols-2 gap-3'>
                        <SuggestCountry value={form.country_id} onChange={setValue('country_id')} />
                        <SuggestState country_id={form.country_id} disabled={!form.country_id} value={form.state_id} onChange={setValue('state_id')} />
                        <SuggestCity state_id={form.state_id} disabled={!form.state_id || !form.country_id} value={form.city_id} onChange={setValue('city_id')} />
                        <SuggestDistrict state_id={form.state_id} disabled={!form.state_id || !form.country_id} value={form.district_id} onChange={setValue('district_id')} />
                        <SuggestLocality state_id={form.state_id} city_id={form.city_id} disabled={!form.state_id || !form.country_id || !form.city_id} value={form.locality_id} onChange={setValue('locality_id')} />
                        <TextField value={form.pincode} onChange={setValue('pincode')} placeholder="Enter pincode">Pincode</TextField>
                    </div>
                    <TextField value={form.address} onChange={setValue('address')} placeholder="Enter complete address" multiline>Address</TextField>
                    <TextField value={form.map_location} onChange={setValue('map_location')} placeholder="Maps URL or coordinates" multiline>Google Maps Location</TextField>

                </AppCard>
            </div>
        </ModalBody>
        <ModalFooter>
            <Btn onClick={save} loading={saving}>Save Details</Btn>
        </ModalFooter>
    </>)
}
