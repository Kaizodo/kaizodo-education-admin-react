import Btn from "@/components/common/Btn";
import { ModalBody, ModalFooter } from "@/components/common/Modal";
import Radio from "@/components/common/Radio";
import SuggestCity from "@/components/common/suggest/SuggestCity";
import SuggestCountry from "@/components/common/suggest/SuggestCountry";
import SuggestDesignation from "@/components/common/suggest/SuggestDesignation";
import SuggestDistrict from "@/components/common/suggest/SuggestDistrict";
import SuggestGender from "@/components/common/suggest/SuggestGender";
import SuggestLeadSource from "@/components/common/suggest/SuggestLeadSource";
import SuggestLocality from "@/components/common/suggest/SuggestLocality";
import SuggestOrganizationType from "@/components/common/suggest/SuggestOrganizationType";
import SuggestState from "@/components/common/suggest/SuggestState";
import TextField from "@/components/common/TextField";
import { YesNoArray } from "@/data/Common";
import { useForm } from "@/hooks/use-form";
import { msg } from "@/lib/msg";
import { LeadService } from "@/services/LeadService";
import { useState } from "react";

export default function LeadEditorDialog({ onSuccess }: { onSuccess: (data: any) => void }) {
    const [saving, setSaving] = useState(false);
    const [form, setValue] = useForm();

    const save = async () => {
        setSaving(true);
        var r = await LeadService.create(form);
        if (r.success) {
            msg.success('New lead added');
            onSuccess(r.data);
        }
        setSaving(false);
    }

    return (<>
        <ModalBody>
            <span className="text-xl font-medium">Lead Information</span>
            <div className="p-3 bg-white border rounded-lg space-y-3">
                <SuggestLeadSource value={form.lead_source_id} onChange={setValue('lead_source_id')} />
                <TextField value={form.remarks} onChange={setValue('remarks')} placeholder="Remarks / Notes" multiline>Remarks / Notes</TextField>
            </div>
            <span className="text-xl font-medium">Organization Information</span>
            <div className="p-3 bg-white border rounded-lg space-y-3">
                <TextField value={form.organization_name} onChange={setValue('organization_name')} placeholder="Enter name">Organization Name</TextField>
                <SuggestOrganizationType value={form.organization_type} onChange={setValue('organization_type')} />
                <div className="grid grid-cols-2 gap-3">
                    <SuggestCountry value={form.country_id} onChange={setValue('country_id')} />
                    <SuggestState country_id={form.country_id} disabled={!form.country_id} value={form.state_id} onChange={setValue('state_id')} />
                    <SuggestCity state_id={form.state_id} disabled={!form.state_id || !form.country_id} value={form.city_id} onChange={setValue('city_id')} />
                    <SuggestDistrict state_id={form.state_id} disabled={!form.state_id || !form.country_id} value={form.district_id} onChange={setValue('district_id')} />
                    <SuggestLocality state_id={form.state_id} city_id={form.city_id} disabled={!form.state_id || !form.country_id || !form.city_id} value={form.locality_id} onChange={setValue('locality_id')} />
                    <TextField value={form.pincode} onChange={setValue('pincode')} placeholder="Enter pincode">Pincode</TextField>
                </div>
                <TextField value={form.address} onChange={setValue('address')} placeholder="Enter address" multiline>Address</TextField>
            </div>
            <span className="text-xl font-medium">Contact Information</span>
            <div className="p-3 bg-white border rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                    <TextField value={form.first_name} onChange={setValue('first_name')} placeholder="Enter first name">First Name</TextField>
                    <TextField value={form.last_name} onChange={setValue('last_name')} placeholder="Enter last name">Last Name</TextField>
                    <SuggestGender value={form.gender} onChange={setValue('gender')} />
                    <SuggestDesignation value={form.designation_id} onChange={setValue('designation_id')} />
                    <TextField value={form.mobile} onChange={setValue('mobile')} placeholder="Enter mobile number">Mobile</TextField>
                    <Radio value={form.is_whatsapp_same} onChange={setValue('is_whatsapp_same')} options={YesNoArray}>WhatsApp same?</Radio>
                    {form.is_whatsapp_same === 0 && <TextField value={form.mobile} onChange={setValue('mobile')} placeholder="Enter mobile number">Whatsapp Number</TextField>}
                    <TextField value={form.email} onChange={setValue('email')} placeholder="Enter email address">Email</TextField>
                </div>
            </div>
        </ModalBody>
        <ModalFooter>
            <Btn onClick={save} loading={saving}>Create Lead</Btn>
        </ModalFooter>
    </>)
}
