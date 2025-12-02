import Btn from '@/components/common/Btn';
import { ModalBody, ModalFooter } from '@/components/common/Modal'
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import SuggestState from '@/components/common/suggest/SuggestState';
import TextField from '@/components/common/TextField'
import { useForm } from '@/hooks/use-form'
import { ClientService } from '@/services/ClientService';
import { LuArrowRight } from 'react-icons/lu';
type Props = {
    user: any,
    onSuccess: (profiles: any[]) => void
};
export default function CustomerProfileForm({ onSuccess, user }: Props) {
    const [form, setValue] = useForm<any>({
        user_id: user.id,
        name: user.first_name + ' ' + user.last_name,
        mobile: user.mobile,
        email: user.email,
        state_id: user.state_id,
        country_id: user.country_id,
        address: user.address
    });
    return (<>
        <ModalBody>
            <div className='grid grid-cols-2 max-w-2xl gap-3'>
                <TextField value={form.name} onChange={setValue('name')}>Name</TextField>
                <TextField value={form.mobile} onChange={setValue('mobile')} placeholder='Enter mobile number'>Mobile Number</TextField>
                <TextField value={form.email} onChange={setValue('email')} placeholder='Enter email address'>Email</TextField>
            </div>
            <div className='grid grid-cols-2 max-w-2xl gap-3'>
                <SuggestCountry value={form.country_id} onChange={setValue('country_id')} selected={{ id: form.country_id, name: form.country_name }} />
                <SuggestState country_id={form.country_id} disabled={!form.country_id} value={form.state_id} onChange={setValue('state_id')} selected={{ id: form.state_id, name: form.state_name }} />
                <TextField value={form.pincode} onChange={setValue('pincode')} placeholder='Enter pincode'>Pincode</TextField>
            </div>
            <TextField value={form.address} onChange={setValue('address')} placeholder='Enter address' rows={5} multiline>Billing Address</TextField>
            <div className='grid grid-cols-2 max-w-2xl gap-3'>
                <TextField value={form.organization_name} onChange={setValue('organization_name')} placeholder='Enter organization name'>Organization Name</TextField>
                <TextField value={form.gst_number} onChange={setValue('gst_number')} placeholder='Enter gst number'>Gst Number</TextField>
            </div>

        </ModalBody>
        <ModalFooter>
            <Btn size={'lg'} asyncClick={async () => {
                var r = await ClientService.createProfile(form);
                if (r.success) {
                    onSuccess(r.data);
                }
            }}>Create Profile<LuArrowRight /></Btn>

        </ModalFooter>
    </>)
}
