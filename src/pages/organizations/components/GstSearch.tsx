import Btn from "@/components/common/Btn";
import SuggestCountry from "@/components/common/suggest/SuggestCountry";
import SuggestState from "@/components/common/suggest/SuggestState";
import TextField from "@/components/common/TextField";
import { Progress } from "@/components/ui/progress";
import { Organization } from "@/data/Organization";
import { useForm } from "@/hooks/use-form";
import { msg } from "@/lib/msg";
import { OrganizationService } from "@/services/OrganizationService";
import { useEffect, useState } from "react";
import { LuCircle, LuPlus, LuSearch, LuX } from "react-icons/lu";

type Props = {
    organization?: Organization,
    organization_id: number,
    askGstin?: boolean,
    onChange: (organization_id?: number) => void
};

export default function GstSearch({ onChange, askGstin = true, organization_id, organization: Org }: Props) {
    const [organization, setOrganization] = useState<Organization | null>(Org ?? null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    const [searching, setSearching] = useState(false);
    const [hasGstin, setHasGstin] = useState(!askGstin);
    const [found, setFound] = useState<Boolean>();
    const [form, setValue] = useForm<any>({
        search_gst_number: 'grawio123456789'
    });
    const length = form.search_gst_number?.length || 0;
    const progress = Math.min((length / 15) * 100, 100);
    const isValid = length === 15;



    const create = async () => {
        var r = await OrganizationService.quickCreate({ ...form, organization_id });
        if (r.success) {
            setOrganization(r.data);
            setFound(true);
        }
    }

    const search = async () => {
        if (!isValid) return msg.error("Enter full 15-digit GST number");
        setSearching(true);
        const r = await OrganizationService.gstSearch({ gst_number: form.search_gst_number });
        if (r.success && r.data.found) {
            if (r.data.organizations.length == 1) {
                setOrganization(r.data.organizations[0]);
            } else {
                setOrganizations(r.data.organizations);
            }
        }
        if (!r?.data?.found) {
            if (!form.gst_number) {
                setValue('gst_number')(form.search_gst_number);

            }
        }
        setFound(r.data.found);
        setSearching(false);
    };

    useEffect(() => {
        onChange(organization?.id);
    }, [organization])

    useEffect(() => {
        if (Org) {
            setOrganization(Org);
        }
    }, [Org])

    if (organization) {
        return (
            <div className="p-3 bg-green-50 border-green-400 border rounded-lg flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="font-semibold text-lg">{organization.name}</div>

                    <Btn size="xs" variant="destructive" onClick={() => setOrganization(null)}>
                        <LuX /> Change
                    </Btn>
                </div>

                <div>
                    {(organization.logo_full || organization.logo_short) && (
                        <img
                            src={organization.logo_full || organization.logo_short}
                            alt="logo"
                            className="h-5 w-auto"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                    )}
                </div>

                <div className="text-sm">
                    <div><b>GST:</b> {organization.gst_number}</div>
                    <div><b>Address:</b> {organization.billing_address}</div>
                    <div><b>Code:</b> {organization.code}</div>
                </div>
            </div>
        );
    }

    if (!organization && organizations.length > 0) {
        return <div className="p-3 bg-green-50 border-green-400 border rounded-lg flex flex-col gap-3">
            <div className="flex flex-row">
                <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium">Multiple Matches Found</span>
                    <span className="text-xs">Select one organization with gst number</span>
                </div>
                <Btn size={'xs'} variant={'destructive'} onClick={() => setOrganizations([])}><LuX /></Btn>
            </div>
            {organizations.map(o => <div onClick={() => {
                setOrganization(o);
                setOrganizations([])
            }} key={o.id} className="p-3 bg-white border rounded-lg flex flex-col gap-3 hover:bg-accent cursor-pointer">
                <div className="flex gap-2 items-center">
                    <LuCircle className="text-xl" />
                    <div className="font-semibold text-lg">{o.name}</div>
                </div>

                {(o.logo_full || o.logo_short) && <div>
                    {(o.logo_full || o.logo_short) && (
                        <img
                            src={o.logo_full || o.logo_short}
                            alt="logo"
                            className="h-5 w-auto"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                    )}
                </div>}

                <div className="text-sm">
                    <div><b>GST:</b> {o.gst_number}</div>
                    <div><b>Address:</b> {o.billing_address}</div>
                    <div><b>Code:</b> {o.code}</div>
                </div>
            </div>)}
        </div>
    }

    return (
        <div className="p-3 bg-green-50 border-green-400 border rounded-lg flex flex-col gap-3">

            {askGstin && <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={hasGstin}
                    onChange={(e) => setHasGstin(e.target.checked)}
                />
                Have GSTIN?
            </label>}

            {hasGstin && (
                <>
                    <TextField
                        max={15}
                        disabled={searching}
                        placeholder="Enter gst number"
                        value={form.search_gst_number}
                        onChange={setValue("search_gst_number")}
                    >
                        GST Number
                    </TextField>

                    <Progress value={progress} className={`${isValid ? "bg-green-200" : ""} h-1`} />

                    <Btn
                        variant={"outline"}
                        loading={searching}
                        onClick={search}
                        className={isValid ? "border-green-500 text-green-700" : ""}
                    >
                        <LuSearch /> Search Business
                    </Btn>
                    {found === false && <>
                        <div className="text-center">
                            <span className="text-xs">We did't find any organization with <b>{form.gst_number}</b> gst number.</span>
                            <span className="flex flex-row p-3 font-medium text-center justify-center  text-green-900">Create new organization</span>
                        </div>
                        <hr></hr>
                        <div className="space-y-3">
                            <TextField value={form.name} onChange={setValue('name')} placeholder="Enter name">Organization Name</TextField>
                            <div className='grid grid-cols-2 gap-3'>
                                <SuggestCountry value={form.country_id} selected={{ id: form.country_id, name: form.country_name }} onChange={setValue('country_id')} />
                                <SuggestState value={form.state_id} selected={{ id: form.state_id, name: form.state_name }} onChange={setValue('state_id')} />
                                <TextField value={form.pincode} onChange={setValue('pincode')} placeholder='Enter pincode'>Pincode</TextField>
                            </div>
                            <TextField value={form.address} onChange={setValue('address')} placeholder="Enter complete address" multiline>Address</TextField>

                            <TextField value={form.gst_number} onChange={setValue('gst_number')} placeholder="Enter school name">GST Number</TextField>
                            <TextField value={form.billing_address} onChange={setValue('billing_address')} placeholder="Enter billing address" multiline>Billing Address</TextField>

                        </div>
                        <div>
                            <b>Bank Details</b> <span className="text-xs">(Optional)</span>
                            <hr />
                        </div>
                        <TextField
                            value={form.bank_name}
                            onChange={setValue('bank_name')}
                            placeholder="Enter bank name"
                        >
                            Bank Name
                        </TextField>

                        <TextField
                            value={form.bank_account}
                            onChange={setValue('bank_account')}
                            placeholder="Enter bank account number"
                        >
                            Account Number
                        </TextField>

                        <TextField
                            value={form.bank_ifsc}
                            onChange={setValue('bank_ifsc')}
                            placeholder="Enter IFSC code"
                        >
                            IFSC Code
                        </TextField>


                        <Btn
                            variant={"outline"}
                            asyncClick={create}
                            className={isValid ? "border-green-500 text-green-700" : ""}
                        >
                            <LuPlus /> Add New
                        </Btn>
                    </>}
                </>
            )}
        </div>
    );
}
