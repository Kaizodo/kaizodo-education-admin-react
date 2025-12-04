import Btn from '@/components/common/Btn';
import { ModalBody, ModalFooter } from '@/components/common/Modal'
import SuggestCity from '@/components/common/suggest/SuggestCity';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import SuggestDistrict from '@/components/common/suggest/SuggestDistrict';
import SuggestLocality from '@/components/common/suggest/SuggestLocality';
import SuggestState from '@/components/common/suggest/SuggestState';
import TextField from '@/components/common/TextField'
import { Organization } from '@/data/Organization'
import { useForm } from '@/hooks/use-form'
import { msg } from '@/lib/msg';
import { StoreService } from '@/services/StoreService';

export default function CloneOrganizationDialog({ organization, onSuccess }: { organization: Organization, onSuccess: () => void }) {
    const [form, setValue] = useForm<any>(organization);

    const clone = async () => {
        var r = await StoreService.clone(form);
        if (r.success) {
            msg.success('Clone successful!');
            onSuccess();
        }
        return r.success;
    }

    return (
        <>
            <ModalBody>
                <TextField value={form.name} onChange={setValue('name')}>Name</TextField>
                <TextField value={form.nickname} onChange={setValue('nickname')}>Nick Name</TextField>
                <TextField value={form.gst_number} onChange={setValue('gst_number')}>Gst Number</TextField>
                <div className='grid grid-cols-2 gap-3'>
                    <SuggestCountry value={form.country_id} selected={{ id: form.country_id, name: form.country_name }} onChange={setValue('country_id')} />
                    <SuggestState value={form.state_id} selected={{ id: form.state_id, name: form.state_name }} onChange={setValue('state_id')} />
                    <SuggestCity value={form.city_id} selected={{ id: form.city_id, name: form.city_name }} onChange={setValue('city_id')} />
                    <SuggestDistrict value={form.district_id} selected={{ id: form.district_id, name: form.district_name }} onChange={setValue('district_id')} />
                    <SuggestLocality value={form.locality_id} selected={{ id: form.locality_id, name: form.locality_name }} onChange={setValue('locality_id')} />
                    <TextField value={form.pincode} onChange={setValue('pincode')} placeholder='Enter pincode'>Pincode</TextField>
                </div>
                <TextField value={form.address} onChange={setValue('address')} placeholder="Enter complete address" multiline>Address</TextField>
                <TextField value={form.billing_address} onChange={setValue('billing_address')} placeholder="Enter billing address" multiline>Billing Address</TextField>


            </ModalBody>
            <ModalFooter>
                <Btn size={'sm'} asyncClick={clone}>Create Clone</Btn>
            </ModalFooter>
        </>
    )
}
