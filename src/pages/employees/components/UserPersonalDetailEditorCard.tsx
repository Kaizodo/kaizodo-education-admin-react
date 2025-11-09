
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import TextField from '@/components/common/TextField';
import Dropdown from '@/components/common/Dropdown';

import CenterLoading from '@/components/common/CenterLoading';
import { BloodGroupArray, GenderArray, getModuleModifierMeta, ModuleModifier, User, UserType } from '@/data/user';
import { UserService } from '@/services/UserService';
import Btn from '@/components/common/Btn';
import { LuUpload } from 'react-icons/lu';
import DateTimeField from '@/components/common/DateTimeField';
import FileField from '@/components/common/FileField';
import { Progress } from '@/components/ui/progress';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { getImageObjectUrl } from '@/lib/utils';
import { useCropper } from '@/hooks/use-cropper';
import SuggestReligion from '@/components/common/suggest/SuggestReligion';
import SuggestCaste from '@/components/common/suggest/SuggestCaste';
import SuggestReservedCategory from '@/components/common/suggest/SuggestReservedCategory';
import AppCard from '@/components/app/AppCard';
import SuggestDesignation from '@/components/common/suggest/SuggestDesignation';
import SuggestUserRole from '@/components/common/suggest/SuggestUserRole';

type Props = {
    id?: number,
    onUpdate?: (user: User) => void,
    onSuccess?: (user: User) => void,
    modifier: ModuleModifier
}
export default function UserPersonalDetailEditorCard({ id, modifier, onUpdate, onSuccess }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const [progress, setProgress] = useState(0);
    const { openCropperFile } = useCropper();
    const getDetail = async () => {
        if (!id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        var r = await UserService.detail(id);
        if (r.success) {
            setForm(r.data.user);
            onUpdate?.(r.data.user);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        const meta = getModuleModifierMeta(modifier);
        var fx = { ...form };
        if (modifier !== 'employee') {
            fx.user_type = meta.user_type;
        }
        let r: ApiResponseType;
        if (id) {
            r = await UserService.update(fx, setProgress);
        } else {
            r = await UserService.create(fx, setProgress);

        }

        if (r.success) {
            msg.success('Details saved successfuly');

            setForm(r.data.user);
            onUpdate?.(r.data.user);
            onSuccess?.(r.data.user);
        }
        setProgress(0);
        setSaving(false);
    }

    useEffect(() => {
        if (id) {
            getDetail();
        } else {
            setLoading(false);
        }
    }, [id]);


    if (loading) {
        return <CenterLoading className="relative h-[400px]" />
    }


    return (
        <>


            <AppCard
                title='Personal Details'
                actions={<div className='me-6'><Btn onClick={save} loading={saving} size={'sm'}>Save Details</Btn></div>}
            >
                {saving && progress > 0 && <div className='flex-1'>
                    <Progress value={progress} />
                </div>}
                <div className="flex items-center space-x-4 p-3">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        {!!form.image && <img src={form.image} onError={() => setValue('image')(undefined)} className='max-w-full max-h-full' />}
                        {!form.image && <LuUpload className="h-8 w-8 text-gray-400" />}
                    </div>
                    <div>
                        <FileField onChange={async (files) => {
                            if (files.length > 0) {
                                var file = files[0];
                                var image = await openCropperFile(file, {
                                    format: 'file',
                                    aspectRatio: 1
                                });

                                if (image instanceof File) {
                                    const url = await getImageObjectUrl(image);
                                    setValue('image_file', 'image')(image, url);
                                }

                            }
                        }}>Upload Photo</FileField>

                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3'>
                    <TextField placeholder="Enter first name" value={form.first_name} onChange={setValue('first_name')}>First Name</TextField>
                    <TextField placeholder="Enter middle name" value={form.middle_name} onChange={setValue('middle_name')}>Middle Name</TextField>
                    <TextField placeholder="Enter last name" value={form.last_name} onChange={setValue('last_name')}>Last Name</TextField>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
                    <TextField value={form.email} onChange={setValue('email')} placeholder='Required for login'>Email</TextField>
                    <TextField value={form.mobile} onChange={setValue('mobile')} placeholder='Phone / Mobile'>Mobile Number</TextField>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3'>


                    <DateTimeField outputFormat='Y-MM-D' previewFormat='DD MMMM, Y' value={form.dob} placeholder='Select date of birth' onChange={setValue('dob')} mode='date'>Date of birth</DateTimeField>
                    <Dropdown value={form.gender} searchable={false} placeholder='Select Gender' onChange={setValue('gender')} getOptions={async () => {
                        return GenderArray;
                    }} >Gender</Dropdown>
                    <Dropdown value={form.blood_group} onChange={setValue('blood_group')} placeholder='Select blood group' getOptions={async () => {
                        return BloodGroupArray;
                    }} >Blood Group</Dropdown>
                    <TextField value={form.aadhar_number} onChange={setValue('aadhar_number')}>Aadhar Number</TextField>
                    <SuggestReligion value={form.religion_id} selected={{ id: form.religion_id, name: form.religion_name }} onChange={setValue('religion_id')} />
                    <SuggestCaste value={form.caste_id} selected={{ id: form.caste_id, name: form.caste_name }} onChange={setValue('caste_id')} />
                    <SuggestReservedCategory value={form.reserved_category_id} selected={{ id: form.reserved_category_id, name: form.reserved_category_name }} onChange={setValue('reserved_category_id')} />
                    {modifier == 'employee' && <Dropdown searchable={false} value={form.user_type} onChange={setValue('user_type')} getOptions={async () => {
                        return [
                            { id: UserType.Teacher, name: 'Teacher' },
                            { id: UserType.Driver, name: 'Driver' },
                            { id: UserType.Employee, name: 'Other Non Teaching' }
                        ];
                    }}>Employee Type</Dropdown>}
                    {modifier == 'employee' && form.user_type === UserType.Employee && <SuggestDesignation value={form.designation_id} onChange={setValue('designation_id')} selected={{ id: form.designation_id, name: form.designation_name }} />}
                    {modifier == 'admin' && <SuggestDesignation value={form.designation_id} onChange={setValue('designation_id')} selected={{ id: form.designation_id, name: form.designation_name }} />}
                    {['admin', 'employee'].includes(modifier) && <SuggestUserRole value={form.user_role_id} onChange={setValue('user_role_id')} selected={{ id: form.user_role_id, name: form.user_role_name }} />}
                </div>

            </AppCard>
        </>
    )
}
