import AppCard from "@/components/app/AppCard";
import Btn from "@/components/common/Btn";
import CenterLoading from "@/components/common/CenterLoading";
import TextField from "@/components/common/TextField";

import { useSetValue } from "@/hooks/use-set-value";
import { msg } from "@/lib/msg";
import { UserService } from "@/services/UserService";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    id: number
};


export default function UserStatutoryConfigurationCard({ id }: Props) {
    const [form, setForm] = useState<any>({});
    const setValue = useSetValue(setForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const load = async () => {
        setLoading(true);
        var r = await UserService.loadStatutoryConfiguration(id);
        if (r.success) {
            setForm(r.data);
        }
        setLoading(false);
    }











    const save = async () => {
        setSaving(true);
        var r = await UserService.saveStatutoryConfiguration(form);
        if (r.success) {
            msg.success('Bank & Statutory details saved!');
        }
        setSaving(false);
    }

    useEffect(() => {
        load();
    }, [id])





    return (
        <AppCard
            title="Bank & Statutory Details"
            subtitle="Manage employee bank account, PF, and ESIC information"
            contentClassName="pb-6"
        >


            {loading && <CenterLoading className='relative h-[400px]' />}
            {!loading && <>
                <strong className="px-3  mb-3 flex text-muted-foreground">Provident Fund / EPF</strong>
                <div className="grid grid-cols-2 gap-3 px-3">
                    <TextField
                        value={form.pf_number}
                        onChange={setValue('pf_number')}
                        placeholder="Enter Pf Number"
                    >PF Member ID / PF Account Number</TextField>
                    <TextField
                        value={form.uan_number}
                        onChange={setValue('uan_number')}
                        placeholder="Enter UAN Number"
                    >UAN (Universal Account Number)</TextField>
                </div>

                <hr className="my-3" />
                <strong className="px-3  mb-3 flex text-muted-foreground">ESIC & Insurance</strong>
                <div className="grid grid-cols-2 gap-3 px-3">
                    <TextField
                        value={form.ip_number}
                        onChange={setValue('ip_number')}
                        placeholder="Enter IP Number"
                    >IP Number (Insurance Number)</TextField>
                    <TextField
                        value={form.esic_number}
                        onChange={setValue('esic_number')}
                        placeholder="Enter Esic Code"
                    >ESIC Code</TextField>
                </div>

                <hr className="my-3" />
                <strong className="px-3  mb-3 flex text-muted-foreground">Bank Account Details</strong>
                <div className="grid grid-cols-2 gap-3 px-3">
                    <TextField
                        value={form.bank_name}
                        onChange={setValue('bank_name')}
                        placeholder="Bank Name"
                    >Bank Name</TextField>
                    <TextField
                        value={form.bank_branch_name}
                        onChange={setValue('bank_branch_name')}
                        placeholder="Enter Branch Name"
                    >Branch Name</TextField>
                    <TextField
                        value={form.bank_account_number}
                        onChange={setValue('bank_account_number')}
                        placeholder="Enter Account Number"

                    >Account Number</TextField>
                    <TextField
                        value={form.bank_ifsc_code}
                        onChange={setValue('bank_ifsc_code')}
                        placeholder="Enter IFSC Code"
                    >IFSC Code</TextField>
                </div>
                <hr className="my-3" />
                <strong className="px-3  mb-3 flex text-muted-foreground">Tax & Identification</strong>
                <div className="grid grid-cols-2 gap-3 px-3">
                    <TextField
                        value={form.pan_number}
                        onChange={setValue('pan_number')}
                        placeholder="Pan Number"
                    >Pan Number</TextField>
                    <TextField
                        value={form.aadhaar_number}
                        onChange={setValue('aadhaar_number')}
                        placeholder="Enter Aadhaar Number"
                    >Aadhaar Number</TextField>

                </div>
                <div className="px-3 mt-6">
                    <Btn onClick={save} loading={saving}><Save />Save Details</Btn>
                </div>
            </>}
        </AppCard>
    )
}
