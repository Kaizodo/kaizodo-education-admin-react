import Btn from "@/components/common/Btn";
import CenterLoading from "@/components/common/CenterLoading";
import { Modal, ModalBody, ModalFooter } from "@/components/common/Modal"
import { Badge } from "@/components/ui/badge";
import { DiscountBy } from "@/data/Common";
import { getTopupTypeName, TopupTypeArray } from "@/data/Subscription";
import { useForm } from "@/hooks/use-form"
import { cn } from "@/lib/utils";
import { LeadService } from "@/services/LeadService";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { LuCircle, LuCircleCheck, LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
import ProposalPlanSelector from "./ProposalPlanSelector";
import FileDrop from "@/components/common/FileDrop";
import { Progress } from "@/components/ui/progress";
import { msg } from "@/lib/msg";
import DateTimeField from "@/components/common/DateTimeField";
import TextField from "@/components/common/TextField";
import Dropdown from "@/components/common/Dropdown";
import { getDefaultPaginated } from "@/data/pagination";
import { useSetValue } from "@/hooks/use-set-value";
import { SubscriptionPlanService } from "@/services/SubscriptionPlanService";
import { TopupPlanService } from "@/services/TopupPlanService";
import Pagination from "@/components/common/Pagination";
import NoRecords from "@/components/common/NoRecords";


const LazySubscriptionPlanForm = lazy(() => import('../../../subscription-plans/components/SubscriptionPlanForm'))

export interface SubscriptionPlan {
    id: number;
    subscription_plan_id: number | null;
    version: string;
    name: string;
    slug: string;
    description: string;
    status: number;
    features: Feature[];
    publish: number;
    popular: number;
    active: number;
    sort_order: number;
    cgst: string;
    sgst: string;
    igst: string;
    sac: string;
    hsn: string | null;
    nda: string,
    tnc: string,
    has_referral: number;
    commission_percentage: string;
    has_commission_on_renewal: number;
    renewal_commission_percentage: string;
    referral_content: string | null;
    extra_student_count: number;
    created_at: string;
    updated_at: string;
    pricing: SubscriptionPricing[];
}

export interface Feature {
    id: number;
    text: string;
}

export interface SubscriptionPricing {
    id: number;
    subscription_plan_id: number;
    price: number;
    duration_days: number;
    popular: number;
}

export interface TopupPlan {
    id: number;
    name: string;
    description: string;
    topup_type: number;
    price: string;
    quantity: number;
    popular: number;
    publish: number;
    cgst: string;
    sgst: string;
    igst: string;
    sac: string;
    hsn: string | null;
    created_at: string;
    updated_at: string;
}

export interface DiscountPlan {
    id: number;
    marketer_only: number;
    user_id: number | null;
    name: string;
    description: string;
    code: string;
    min_amount: string;
    max_amount: string;
    valid_from: string;
    valid_to: string;
    discount_percentage: string;
    discount_amount: string;
    discount_by: number;
    publish: number;
    quantity: number;
    renewal_only: number;
    quantity_used: number;
    discount_type: number;
    created_at: string;
    updated_at: string;
}

export interface DiscountPlanApplication {
    id: number;
    discount_plan_id: number;
    topup_plan_id: number | null;
    subscription_plan_price_id: number | null;
    discount_type: number;
    created_at: string;
    updated_at: string | null;
}

export type ProposalEditorState = {
    subscription_plans: SubscriptionPlan[];
    topup_plans: TopupPlan[];
    discount_plans: DiscountPlan[];
    discount_plan_applications: DiscountPlanApplication[];
}

export default function LeadProposalEditor({ lead_id, onSuccess, onCancel }: {
    lead_id: number,
    onSuccess: () => void,
    onCancel: () => void
}) {
    const [state, setState] = useState<ProposalEditorState>();
    const [form, setValue] = useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const uploadingRef = useRef(false);

    const [searchingSubscriptionPlans, setSearchingSubscriptionPlans] = useState(false);
    const [paginatedSubscriptionPlans, setPaginatedSubscriptionPlans] = useState<any>(getDefaultPaginated());
    const [subscriptionPlanFilters, setSubscriptionPlanFilters] = useState<any>({
        page: 1,
        keyword: '',
        custom: 0
    });
    const setSubscriptionPlanFilter = useSetValue(setSubscriptionPlanFilters);
    const searchSubscriptionPlans = async () => {
        setSearchingSubscriptionPlans(true);
        var r = await SubscriptionPlanService.search(subscriptionPlanFilters);
        if (r.success) {
            setPaginatedSubscriptionPlans(r.data);
        }
        setSearchingSubscriptionPlans(false);
    }

    useEffect(() => {
        searchSubscriptionPlans();
    }, [subscriptionPlanFilters]);


    const [searchingTopupPlans, setSearchingTopupPlans] = useState(false);
    const [paginatedTopupPlans, setPaginatedTopupPlans] = useState<any>(getDefaultPaginated());
    const [topupPlanFilters, setTopupPlanFilters] = useState<any>({
        page: 1,
        keyword: '',
        custom: 0
    });
    const setTopupPlanFilter = useSetValue(setTopupPlanFilters);
    const searchTopupPlans = async () => {
        setSearchingTopupPlans(true);
        var r = await TopupPlanService.search(topupPlanFilters);
        if (r.success) {
            setPaginatedTopupPlans(r.data);
        }
        setSearchingTopupPlans(false);
    }

    useEffect(() => {
        searchTopupPlans();
    }, [topupPlanFilters]);


    const createCustomPlan = () => {
        const modal_id = Modal.show({
            title: 'Create Custom Plan',
            subtitle: 'Enter details to create custom subscription plan',
            maxWidth: 1200,
            content: () => {

                return <Suspense fallback={<CenterLoading className="relative h-[500px]" />}>
                    <LazySubscriptionPlanForm
                        inModal={true}
                        custom={true}
                        onSuccess={(data) => {
                            Modal.close(modal_id);
                            setValue('subscription_plan_id', 'subscription_plan_price_id')(data.id, data?.pricing?.[0]?.id);
                            setSubscriptionPlanFilter('custom', 'debounce')(1, false);
                        }}
                    />
                </Suspense>
            }
        })
    }

    const load = async () => {
        setLoading(true);
        var r = await LeadService.loadProposalMetaData();
        if (r.success) {
            setState(r.data);
            setLoading(false);
        } else {
            onCancel();
        }
    }

    const deleteDocument = async (index: number, lead_document_id: number) => {
        setValue(`lead_documents[${index}].deleting`)(true);
        var r = await LeadService.deleteDocument({
            lead_id,
            lead_document_id
        });
        if (r.success) {
            setValue('lead_documents')(form.lead_documents.filter((ld: any) => ld.id !== lead_document_id));
        } else {
            setValue(`lead_documents[${index}].deleting`)(false);
        }
    }

    const save = async () => {
        setSaving(true);
        var {
            lead_documents,
            topup_plans,
            ...rest
        } = form;
        if (topup_plans) {
            rest.topup_plans = topup_plans.filter(Boolean);
        }
        if (lead_documents) {
            rest.lead_document_ids = lead_documents.map((l: any) => l.id);
        }
        var r = await LeadService.addProposal({ ...rest, lead_id });
        if (r.success) {
            msg.success('Proposal created successfuly');
            onSuccess();
        } else {
            setSaving(false);
        }
    }

    const [uploads, setUploads] = useState<{
        id: number,
        file: File,
        progress: number,
        uploading: boolean,
        uploaded: boolean
    }[]>([]);


    const beginUpload = async (upload_index: number) => {
        if (uploadingRef.current) return;

        const upload = uploads[upload_index];
        if (!upload || upload.uploaded || upload.uploading) return;

        uploadingRef.current = true;

        setUploads(prev => {
            const updated = [...prev];
            updated[upload_index] = { ...updated[upload_index], uploading: true, progress: 0 };
            return updated;
        });

        const r = await LeadService.uploadDocument({
            media: upload.file,
            lead_id,
        }, (progress: number) => {
            setUploads(prev => {
                const updated = [...prev];
                updated[upload_index] = { ...updated[upload_index], progress };
                return updated;
            });
        });

        if (r.success) {
            setValue('lead_documents[]')(r.data);
        }

        setUploads(prev => {
            const updated = [...prev];
            updated[upload_index] = {
                ...updated[upload_index],
                uploading: false,
                uploaded: !!r.success,
                progress: r.success ? 100 : updated[upload_index].progress
            };
            return updated;
        });

        uploadingRef.current = false;

        // check if any remaining uploads
        const latestUploads = [...uploads]; // read stale-free snapshot
        const nextIndex = latestUploads.findIndex((u, idx) => idx > upload_index && !u.uploaded && !u.uploading);

        if (nextIndex !== -1) {
            beginUpload(nextIndex);
        } else {
            setUploads([]);

        }
    };

    useEffect(() => {
        if (!uploadingRef.current) {
            const nextIndex = uploads.findIndex(u => !u.uploaded && !u.uploading);
            if (nextIndex !== -1) beginUpload(nextIndex);
        }
    }, [uploads]);

    useEffect(() => {
        load();
    }, []);

    if (loading || !state) {
        return <CenterLoading className="relative h-[400px]" />
    }

    return (
        <>
            <ModalBody>
                <div className="flex flex-row items-center gap-1">
                    <span className="px-2 rounded-full bg-primary text-primary-foreground font-bold uppercase">Step 1</span>
                    <span className="font-medium flex-1">Choose Subscription Plan</span>
                    <Btn size={'sm'} variant={'destructive'} onClick={createCustomPlan}><LuPlus />Create Custom Plan</Btn>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-lg   grid grid-cols-2 gap-3">
                    <TextField value={subscriptionPlanFilters.keyword} onChange={v => setSubscriptionPlanFilter('keyword', 'debounce')(v, true)} placeholder="Search by name ">Search</TextField>
                    <Dropdown searchable={false} value={subscriptionPlanFilters.custom} onChange={setSubscriptionPlanFilter('custom', 'debounce')} placeholder="Select plan type" getOptions={async () => {
                        return [
                            { id: 0, name: 'Standard Plan' },
                            { id: 1, name: 'Custom Plan' }
                        ]
                    }}>Plan Type</Dropdown>
                </div>
                <ProposalPlanSelector
                    searching={searchingSubscriptionPlans}
                    subscription_plans={paginatedSubscriptionPlans.records}
                    subscription_plan_id={form.subscription_plan_id}
                    subscription_plan_price_id={form.subscription_plan_price_id}
                    setValue={setValue}
                />

                <div className="flex flex-row items-center gap-1">
                    <span className="px-2 rounded-full bg-primary text-primary-foreground font-bold uppercase">Step 2</span>
                    <span className="font-medium">Choose Topup Plan</span>
                </div>
                <div className="bg-white rounded-lg p-2 shadow-lg   grid grid-cols-2 gap-3">
                    <TextField value={topupPlanFilters.keyword} onChange={v => setTopupPlanFilter('keyword', 'debounce')(v, true)} placeholder="Search by name ">Search</TextField>
                    <Dropdown value={topupPlanFilters.topup_type} onChange={setTopupPlanFilter('topup_type')} placeholder='Select topup type' getOptions={async () => TopupTypeArray}>Topup Type</Dropdown>
                </div>
                {searchingTopupPlans && <CenterLoading className='h-[400px] relative' />}
                {paginatedTopupPlans.records.map((plan: any) => {
                    var quantity = form?.topup_plans?.find?.((tp: any) => tp?.id === plan.id)?.quantity ?? 0;
                    return <div key={plan.id} className={cn(
                        "bg-white border rounded-lg hover:shadow-lg shadow-sm p-2 flex flex-row items-center gap-2",
                        quantity > 0 && " bg-orange-50 border-orange-400"
                    )}>

                        <div className="flex flex-col flex-1">
                            <span className="text-sm font-medium">{plan.name}</span>
                            <span className="text-xs text-gray-500 ">{plan.description}</span>
                            <div className="flex flex-row items-center gap-1">
                                <span className="text-sm font-bold">₹{plan.price}</span>
                                <span className="text-xs">{plan.quantity} {getTopupTypeName(plan.topup_type)}</span>
                            </div>
                        </div>
                        {quantity == 0 && <Btn variant={'outline'} size={'sm'} onClick={() => {
                            setValue(`topup_plans[${plan.id}]`)({
                                id: plan.id,
                                quantity: 1
                            });
                        }}>Add Topup</Btn>}
                        {quantity > 0 && <div className="flex   p-1 border rounded-lg gap-2 bg-orange-100">
                            <Btn size={'xs'} variant={'outline'} onClick={() => setValue(`topup_plans[${plan.id}].quantity`)(quantity - 1)}><LuMinus /></Btn>
                            <span>{quantity}</span>
                            <Btn size={'xs'} variant={'outline'} onClick={() => setValue(`topup_plans[${plan.id}].quantity`)(quantity + 1)}><LuPlus /></Btn>
                        </div>}
                    </div>
                })}
                {!searchingTopupPlans && paginatedTopupPlans.records.length == 0 && <NoRecords />}
                <div className='p-3'>
                    <Pagination paginated={paginatedTopupPlans} onChange={(page) => setTopupPlanFilter('page', 'debounce')(page, false)} />
                </div>

                <div className="flex flex-row items-center gap-1">
                    <span className="px-2 rounded-full bg-primary text-primary-foreground font-bold uppercase">Step 3</span>
                    <span className="font-medium">Apply Discount</span>
                </div>
                {state.discount_plans.map((plan) => {
                    var checked = plan.id === form?.discount_plan_id;
                    return <label
                        key={plan.id}
                        onClick={() => setValue('discount_plan_id')(plan.id)}
                        className={cn(
                            "bg-white border rounded-lg hover:shadow-lg shadow-sm p-2 flex flex-row items-center gap-2",
                            checked && " bg-orange-50 border-orange-400"
                        )}>
                        {checked && <LuCircleCheck />}
                        {!checked && <LuCircle />}
                        <div className="flex flex-col flex-1">
                            <span className="text-sm font-medium">{plan.name}</span>
                            <span className="text-xs text-gray-500 ">{plan.description}</span>
                            <div className="flex flex-row items-center gap-1">
                                {plan.discount_by == DiscountBy.Amount && <span className="text-sm font-bold">₹{plan.discount_amount} Discount</span>}
                                {plan.discount_by == DiscountBy.Percentage && <span className="text-sm font-bold">{plan.discount_percentage}% Discount</span>}
                            </div>
                        </div>
                        <Badge>{plan.code}</Badge>
                    </label>
                })}

                <div className="flex flex-row items-center gap-1">
                    <span className="px-2 rounded-full bg-primary text-primary-foreground font-bold uppercase">Step 4</span>
                    <span className="font-medium">Review NDA & Terms</span>
                </div>
                <FileDrop onChange={(files) => setUploads(ups => ([...ups, ...files.map((f, fi) => ({
                    id: new Date().getTime() + fi,
                    file: f,
                    progress: 0,
                    uploading: false,
                    uploaded: false
                }))]))} />
                {uploads.map((upload, upload_index) => <div key={'upload_' + upload_index} className="border rounded-lg p-1">
                    <div>{upload.file.name}</div>
                    <div className="flex flex-row items-center">
                        <Progress value={upload.progress} className="h-2 flex-1" />
                        <div className="w-6 text-xs text-center">{upload.progress}%</div>
                    </div>
                </div>)}
                {(form?.lead_documents ?? []).map((lead_document: {
                    id: number,
                    media_path: string,
                    media_name: string,
                    deleting: boolean
                }, index: number) => {
                    return <div key={lead_document.id} className="p-2 border rounded-lg bg-white flex flex-row items-center justify-between gap-2">
                        <span className="font-medium text-gray-500 text-sm">{lead_document.media_name}</span>
                        <Btn variant={'destructive'} loading={lead_document.deleting} size={'xs'} onClick={() => deleteDocument(index, lead_document.id)}><LuTrash2 /></Btn>
                    </div>
                })}
                <div className="flex flex-row items-center gap-1">
                    <span className="px-2 rounded-full bg-primary text-primary-foreground font-bold uppercase">Step 4</span>
                    <span className="font-medium">Validity</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <DateTimeField value={form.datetime_expiry} onChange={setValue('datetime_expiry')} placeholder="Select date & time" mode="datetime">Valid Till</DateTimeField>
                </div>
            </ModalBody>
            <ModalFooter>
                <Btn size={'sm'} loading={saving} disabled={!form.subscription_plan_id || !form.lead_documents} onClick={save}>Create Proposal</Btn>
            </ModalFooter>
        </>
    )
}
