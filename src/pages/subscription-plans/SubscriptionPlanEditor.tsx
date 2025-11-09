import AppCard from '@/components/app/AppCard';
import AppPage from '@/components/app/AppPage'
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSetValue } from '@/hooks/use-set-value';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import FeatureListInput from './components/FeatureListInput';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';
import { LuCheck, LuPlus, LuSparkles, LuX } from 'react-icons/lu';
import { cn, formatDays } from '@/lib/utils';
import { CustomSubscriptionPlanBuilder } from './components/CustomSubscriptionPlanBuilder';
import Note from '@/components/common/Note';
import { Progress } from '@/components/ui/progress';
import { GrCircleQuestion } from "react-icons/gr";
import { SubscriptionPlanService } from '@/services/SubscriptionPlanService';
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import FeatureComparePoints from './components/FeatureComparePoints';
import ContentCards from './components/ContentCards';
import { ReferralTab } from './components/ReferralTab';
import { MarketingMaterialTab } from './components/MarketingMaterialTab';
import ProjectPhaseTab from './components/ProjectPhaseTab';


export type SubscriptionPlanEditorState = {
    id: number;
    version: string;
    name: string;
    description: string;
    status: number;
    cgst: number;
    sgst: number;
    igst: number;
    sac: string;
    hsn: string;
    extra_student_count: number;
    pricing: {
        id: number,
        price: number,
        duration_days: number,
        popular?: number
    }[],
    features: {
        id: string;
        text: string
    }[];
    topup_plan_ids: {
        id: number,
        quantity: number
    }[],
    has_referral: number,
    commission_percentage: number,
    has_commission_on_renewal: number,
    renewal_commission_percentage: number,
    referral_content: string,
    phase_ids: number[],
    feature_card_ids: number[],
    comparison_point_ids: number[],
    subscription_feature_ids: number[],
    subscription_module_ids: number[],
    marketing_materials: {
        id: number,
        marketing_material_category_id: number,
        media_path: string,
        media_name: string,
        created_at: string
    }[],
    publish: number;
    popular: number;
    created_at: string;
    updated_at: string;
    modules: any[];
    topup_plans: any[]
};

export default function SubscriptionPlanEditor() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(!!id);
    const [progress, setProgress] = useState(0);
    const [tip, setTip] = useState('');
    const [activePriceIndex, setActivePriceIndex] = useState(0);
    const [form, setForm] = useState<SubscriptionPlanEditorState>({
        id: 0,
        version: "1.0",
        name: "",
        description: "",
        status: 0,
        cgst: 9,
        sgst: 9,
        igst: 18,
        sac: '998314',
        hsn: '',
        extra_student_count: 0,
        pricing: [
            {
                id: new Date().getTime(),
                price: 0,
                duration_days: 365
            },
            {
                id: new Date().getTime() + 1,
                price: 0,
                duration_days: 365 * 2
            }, {
                id: new Date().getTime() + 2,
                price: 0,
                duration_days: 365 * 3
            },
            {
                id: new Date().getTime() + 3,
                price: 0,
                duration_days: 365 * 4
            }
        ],
        marketing_materials: [],
        feature_card_ids: [],
        comparison_point_ids: [],
        phase_ids: [],
        features: [],
        publish: 0,
        popular: 0,
        topup_plan_ids: [],
        subscription_feature_ids: [],
        subscription_module_ids: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        modules: [],
        has_referral: 0,
        commission_percentage: 0,
        has_commission_on_renewal: 0,
        renewal_commission_percentage: 0,
        referral_content: '',
        topup_plans: []
    });
    const setValue = useSetValue(setForm);


    const save = async () => {
        setSaving(true);
        var { modules, topup_plans, marketing_materials, ...rest } = form;
        var r = await SubscriptionPlanService.create({ ...rest, marketing_material_ids: marketing_materials.map(i => i.id) });
        if (r.success) {
            msg.success('Subscription Plan saved successfully');
            navigate(`/subscription-plans`);
        }
        setSaving(false);
    }

    const load = async () => {
        setLoading(true);
        var r = await SubscriptionPlanService.detail(Number(id));
        if (r.success) {
            setForm(s => ({ ...s, ...r.data }));
        }
        setLoading(false);
    }


    function calculateDiscount() {
        // Filter valid numeric pricing
        const validPricing = form.pricing
            .map(p => ({
                ...p,
                price: Number(p.price),
                duration_days: Number(p.duration_days)
            }))
            .filter(p => !isNaN(p.price) && !isNaN(p.duration_days) && p.price > 0 && p.duration_days > 0)
            .sort((a, b) => a.duration_days - b.duration_days);

        if (!validPricing.length) return [];

        const basePlan = validPricing[0];

        return validPricing.map(p => {
            let discount = 0;
            if (p.id !== basePlan.id) {
                const baseTotal = basePlan.price * (p.duration_days / basePlan.duration_days);
                discount = baseTotal > 0 ? ((baseTotal - p.price) / baseTotal) * 100 : 0;
            }
            return { ...p, discount: Number(discount.toFixed(1)) };
        });
    }


    function addPricing() {
        const currentPricing = form.pricing ?? [];

        if (!currentPricing.length) {
            // First item
            setValue('pricing')([
                ...currentPricing,
                { id: new Date().getTime(), price: 0, duration_days: 365 }
            ]);
            return;
        }

        // Sort to find the base plan (lowest duration)
        const sortedPricing = [...currentPricing].sort((a, b) => a.duration_days - b.duration_days);
        const basePrice = Number(sortedPricing[0].price) || 0;
        const baseDuration = Number(sortedPricing[0].duration_days) || 365;

        // Take last item as previous plan
        const lastItem = currentPricing[currentPricing.length - 1];
        const newDuration = Number(lastItem.duration_days) + baseDuration; // double last duration
        const newPrice = Number(lastItem.price) + basePrice; // scale price according to base

        const newItem = {
            id: new Date().getTime(),
            price: newPrice,
            duration_days: newDuration
        };

        setValue('pricing')([...currentPricing, newItem]);
    }

    useEffect(() => {
        let currentProgress = 0;
        let currentTip = '';

        const steps = [
            { check: !!form.name, tip: 'Please provide a plan name' },
            { check: !!form.description, tip: 'Please provide a plan description' },
            { check: (form?.pricing || []).length > 0, tip: 'Please add at least one price' },

            { check: (form?.features || []).length > 0, tip: 'Please add at least one public feature' },
            { check: (form?.subscription_module_ids || []).length > 0, tip: 'Please select at least one module' },
            { check: (form?.subscription_feature_ids || []).length > 0, tip: 'Please select at least one feature' },
        ];

        const points = 100 / steps.length;

        for (const step of steps) {
            if (step.check) {
                currentProgress += points;
            } else if (!currentTip) {
                currentTip = step.tip;
            }
        }

        setProgress(currentProgress);
        setTip(currentTip);
    }, [form]);


    useEffect(() => {
        if (!!id) {
            load();
        }
    }, [id]);

    const calculatedPricing = calculateDiscount();

    const activePrice = calculatedPricing[activePriceIndex];
    return (
        <AppPage
            enableBack={true}
            title={id ? `Edit Subscription Plan` : 'Create Subscription Plan'}
            subtitle='Manage your subscription plan details'
            actions={<Btn disabled={progress < 100} size={'sm'} loading={saving} onClick={save}>Save Changes</Btn>}
        >
            <div className='flex flex-row items-center gap-3'>
                {!!tip && <span className='flex flex-row items-center bg-yellow-50 border-yellow-300 border rounded-lg px-1 text-xs gap-1'><GrCircleQuestion />{tip}</span>}
                <Progress value={progress > 100 ? 100 : progress}
                    className={cn(
                        'flex-1 h-2',
                        progress < 50 ? 'bg-red-100' : progress < 80 ? 'bg-yellow-100' : 'bg-green-100',
                    )} />
            </div>
            {loading && <CenterLoading className="relative h-[400px]" />}
            {!loading && <AppCard contentClassName="p-2">
                <Tabs defaultValue="plan">
                    <TabsList>
                        <TabsTrigger value="plan">Plan Details</TabsTrigger>
                        <TabsTrigger value="compare">Feature Comparison</TabsTrigger>
                        <TabsTrigger value="modules">Modules & Features</TabsTrigger>
                        <TabsTrigger value="content_cards">Content Cards</TabsTrigger>
                        <TabsTrigger value="referral">Referral Program</TabsTrigger>
                        <TabsTrigger value="marketing">Marketing Material</TabsTrigger>
                        <TabsTrigger value="phase">Project Phases</TabsTrigger>
                    </TabsList>
                    <TabsContent value="plan">
                        <div className='grid grid-cols-3 gap-4  w-full'>
                            <div className=' p-4   flex-1 space-y-3'>
                                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter plan name'>Plan Name</TextField>
                                <TextField value={form.description} onChange={setValue('description')} placeholder='Enter plan description' multiline>Plan Description</TextField>
                                <div className='bg-green-50 border-green-400 border p-2 rounded-lg flex flex-col gap-3'>
                                    <span className='text-xs italic text-green-600'>Tax Information - Included in price</span>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <TextField type='number' value={form.cgst} onChange={setValue('cgst')} placeholder="Enter CGST">CGST %</TextField>
                                        <TextField type='number' value={form.sgst} onChange={setValue('sgst')} placeholder="Enter SGST">SGST %</TextField>
                                        <TextField type='number' value={form.igst} onChange={setValue('igst')} placeholder="Enter IGST">IGST %</TextField>
                                    </div>
                                    <div className='grid grid-cols-2 gap-3'>
                                        <TextField value={form.sac} onChange={setValue('sac')} placeholder="Enter SAC">SAC - For Services</TextField>
                                        <TextField value={form.hsn} onChange={setValue('hsn')} placeholder="Enter HSN">HSN - For Goods</TextField>
                                    </div>
                                </div>
                                <TextField type='number' value={form.extra_student_count} onChange={setValue('extra_student_count')} placeholder="Enter extra students" subtitle='Client will be able to add N + extra students after that student addition will be restricted'>Extra Students</TextField>

                                <div className='border rounded-lg overflow-hidden'>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className=' w-[50px] text-center'>Popular</TableHead>
                                                <TableHead className='text-center text-nowrap'>Price / Student</TableHead>
                                                <TableHead className='text-center'>Duration(Days)</TableHead>
                                                <TableHead className='text-end'>
                                                    <Btn
                                                        variant="outline"
                                                        size="xs"
                                                        onClick={addPricing}
                                                    >
                                                        <LuPlus /> Add More
                                                    </Btn>

                                                </TableHead>

                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {form.pricing.map((pricing, pricing_index) => <TableRow key={pricing.id}>
                                                <TableCell className='p-1 text-center w-[50px]'><Checkbox checked={!!pricing.popular} onCheckedChange={_ => setValue(...form.pricing.map((_, pi) => `pricing[${pi}].popular`))(...form.pricing.map((p) => p.id == pricing.id))} className='rounded-full' /></TableCell>
                                                <TableCell className='p-1 text-center'>
                                                    ₹ <input
                                                        value={pricing.price}
                                                        onChange={e => setValue(`pricing[${pricing_index}].price`)(e.target.value)}
                                                        type='number'
                                                        className='border p-1 rounded-lg focus:outline-primary w-[100px]'
                                                        placeholder='Price'
                                                    />
                                                </TableCell>
                                                <TableCell className='p-1 text-center'>
                                                    <input
                                                        value={pricing.duration_days}
                                                        onChange={e => setValue(`pricing[${pricing_index}].duration_days`)(e.target.value)}
                                                        type='number'
                                                        className='border p-1 rounded-lg focus:outline-primary w-[70px]'
                                                        placeholder='Duration Days'
                                                    /> {formatDays(pricing.duration_days)}
                                                </TableCell>
                                                <TableCell className='text-end p-1'>
                                                    <Btn
                                                        variant={'destructive'}
                                                        size={'xs'}
                                                        onClick={() => setValue('pricing')((form.pricing ?? []).filter(p => p.id !== pricing.id))}
                                                    ><LuX />Remove</Btn>
                                                </TableCell>
                                            </TableRow>)}
                                        </TableBody>
                                    </Table>
                                    {!calculatedPricing.length && <div className='flex flex-col  justify-center items-center py-4'>
                                        <span className='font-medium text-red-500'>Pricing Required</span>
                                        <span className='text-xs mb-3'>Please add some pricing</span>
                                        <Btn

                                            size="xs"
                                            onClick={addPricing}
                                        >
                                            <LuPlus /> Add Pricing
                                        </Btn>
                                    </div>}
                                </div>


                                <Radio value={form.popular} onChange={setValue('popular')} options={YesNoArray}>Popular ?</Radio>
                                <Radio value={form.publish} onChange={setValue('publish')} options={YesNoArray}>Publish ?</Radio>
                                {!!form.publish && <Note title='info' subtitle='Published plans will be visible to users for subscription. and no changes will be allowed afterwards.' />}
                            </div>
                            <div className='p-4 flex-1 border rounded-lg  '>
                                <h3 className='text-lg font-semibold'>Public Features</h3>
                                <span>Define features in your words</span>
                                <FeatureListInput providedFeatures={form.features ?? []} onUpdate={setValue('features')} />
                            </div>
                            <div className='flex flex-col gap-5'>
                                <div className='flex flex-row  justify-center gap-2 flex-wrap'>
                                    {calculatedPricing.map((p, pi) => {
                                        return (
                                            <div
                                                onClick={() => setActivePriceIndex(pi)}
                                                key={p.id}
                                                className={cn(
                                                    "border flex flex-col py-1 px-2 rounded-sm hover:bg-sky-50 hover:border-sky-300 cursor-pointer select-none",
                                                    pi == activePriceIndex && "bg-sky-50 border-sky-300"
                                                )}>
                                                <span className="text-gray-500 text-sm font-bold italic">{formatDays(p.duration_days)}</span>
                                                {p.discount > 0 && <span className="text-green-600 font-medium text-xs">{p.discount}% off</span>}
                                                {p.discount == 0 && <span className="text-green-600 font-medium text-xs">₹{p.price}</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                                <Card
                                    className={`max-w-[350px] w-full mx-auto relative p-8 transition-all hover:shadow-card-hover cursor-pointer animate-scale-in ${form.popular ? "border-primary" : ""}`}
                                >
                                    {!!form.popular && (
                                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary gap-1">
                                            <LuSparkles className="h-3 w-3" />
                                            Most Popular
                                        </Badge>
                                    )}



                                    {activePrice?.discount > 0 && (
                                        <Badge variant="secondary" className="absolute top-4 right-4 bg-secondary">
                                            {activePrice.discount}% OFF
                                        </Badge>
                                    )}

                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold mb-2">{form.name ?? 'Untitled Plan'}</h3>
                                        <p className="text-muted-foreground text-sm">{form.description ?? 'No description available'}</p>
                                    </div>

                                    {!calculatedPricing.length && <div className='bg-red-50 border-red-400 border p-2 rounded-lg flex flex-col mb-3'>
                                        <span className='font-medium text-red-500'>Pricing Required</span>
                                        <span className='text-xs'>Please add some pricing</span>
                                    </div>}

                                    {activePrice && <div className="mb-6">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-4xl font-bold">{`₹${activePrice?.price}`}</span>
                                            <span className="text-muted-foreground">/ {formatDays(Number(activePrice?.duration_days ?? 0))}</span>
                                        </div>
                                    </div>}

                                    <ul className="space-y-3 mb-8">
                                        {form.features.map((feature: any) => (
                                            <li key={feature.id} className="flex items-start gap-2">
                                                <LuCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                <span className="text-sm">{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>

                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="compare">
                        <FeatureComparePoints state={form} setValue={setValue} />
                    </TabsContent>
                    <TabsContent value="modules">
                        <CustomSubscriptionPlanBuilder state={form} setValue={setValue} />
                    </TabsContent>
                    <TabsContent value="content_cards">
                        <ContentCards state={form} setValue={setValue} />
                    </TabsContent>
                    <TabsContent value="referral">
                        <ReferralTab state={form} setValue={setValue} />
                    </TabsContent>
                    <TabsContent value="marketing">
                        <MarketingMaterialTab state={form} setValue={setValue} />
                    </TabsContent>
                    <TabsContent value="phase">
                        <ProjectPhaseTab state={form} setValue={setValue} />
                    </TabsContent>
                </Tabs>
            </AppCard>}
        </AppPage >
    )
}
