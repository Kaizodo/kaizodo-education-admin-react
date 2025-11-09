import AppCard from '@/components/app/AppCard';
import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import NoRecords from '@/components/common/NoRecords';
import Radio from '@/components/common/Radio';
import TextField from '@/components/common/TextField';
import { YesNoArray } from '@/data/Common';
import { CredentialTypeEnum } from '@/data/user';
import { useSetValue } from '@/hooks/use-set-value';
import { msg } from '@/lib/msg';
import { UserService } from '@/services/UserService';
import { useEffect, useState } from 'react'


function CredentialForm({ credential, id }: { id: number, credential: CredentialMeta }) {
    const [form, setForm] = useState(credential);
    const setValue = useSetValue(setForm);
    const [saving, setSaving] = useState(false);
    const save = async () => {
        setSaving(true);
        var r = await UserService.setCredentials({ ...form, user_id: id });
        if (r.success) {
            msg.success('Credentials updated successfuly');
        }
        setSaving(false);
    }
    return (
        <AppCard title={credential.title}>
            <div className='px-4 pb-4 space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                    <TextField value={form.username} onChange={setValue('username')} placeholder='Enter username' >Username</TextField>
                    <TextField value={form.password} onChange={setValue('password')} placeholder='Enter password' >Password</TextField>
                </div>
                <div className='flex flex-row justify-between items-end'>
                    <Radio value={form.allow_login} onChange={setValue('allow_login')} options={YesNoArray} >Allow Login ?</Radio>

                    <Btn size={'sm'} onClick={save} loading={saving}>Save Credentials</Btn>
                </div>
            </div>
        </AppCard>
    )
}



type CredentialMeta = {
    user_id: number,
    username: string,
    password: string,
    title: string,
    allow_login: boolean,
    credential_type: CredentialTypeEnum
};

export default function UserCredentialCard({ id }: { id: number }) {
    const [credentials, setCredentials] = useState<CredentialMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const load = async () => {
        setLoading(true);
        var r = await UserService.getCredentials(id);
        if (r.success) {
            setCredentials(r.data);
        }
        setLoading(false);
    }


    useEffect(() => {
        load();
    }, [])
    return (
        <div className='flex flex-col gap-4'>
            {loading && <CenterLoading className={'relative h-[400px]'} />}
            {!loading && credentials.length == 0 && <NoRecords title='No Credentials Found' subtitle='Type of user does not any login panel' />}
            {!loading && credentials.length > 0 && <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
                Note: Password is visible only when it's created for the first time. Leave the password field empty to keep the existing password.
            </div>
            }
            {credentials.map((credential, index) => <CredentialForm key={index} id={id} credential={credential} />)}
        </div>
    )
}
