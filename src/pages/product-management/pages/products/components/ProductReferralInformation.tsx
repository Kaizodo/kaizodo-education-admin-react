import TextField from "@/components/common/TextField";
import { useEffect, useState } from "react";
import Richtext from "@/components/common/Richtext";
import Btn from "@/components/common/Btn";
import { useForm } from "@/hooks/use-form";
import { ProductService } from "@/services/ProductService";
import { msg } from "@/lib/msg";
import Radio from "@/components/common/Radio";
import { YesNoArray } from "@/data/Common";
import { CommonProductStateProps } from '@/data/Product';
import { MarketingMaterialCategoryService } from "@/services/MarketingMaterialCategoryService";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { MarketingMaterialService } from "@/services/MarketingMaterialService";
import CenterLoading from "@/components/common/CenterLoading";
import { Checkbox } from "@/components/ui/checkbox";
import Pagination from "@/components/common/Pagination";
import NoRecords from "@/components/common/NoRecords";
import { LuX } from "react-icons/lu";

export default function ProductReferralInformation({ state, setStateValue }: CommonProductStateProps) {
    const [saving, setSaving] = useState(false);
    const [form, setValue] = useForm(state.product);
    const save = async () => {
        setSaving(true);
        const r = await ProductService.saveReferralInformation({
            product_id: state.product.id,
            has_referral: form.has_referral,
            has_commission_on_renewal: form.has_commission_on_renewal,
            commission_percentage: form.commission_percentage,
            renewal_commission_percentage: form.renewal_commission_percentage,
            has_secondary_commission: form.has_secondary_commission,
            secondary_commission: form.secondary_commission,
            has_renewal_secondary_commission: form.has_renewal_secondary_commission,
            renewal_secondary_commission: form.renewal_secondary_commission,
            referral_content: form.referral_content,
            product_marketing_materials: state.product_marketing_materials.map(pmm => ({
                marketing_material_id: pmm.id,
                message: pmm.message
            }))
        });
        if (r.success) {
            msg.success('Details saved!');
            setStateValue('product')({ ...state.product, ...form });
        }
        setSaving(false);
    }

    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [categories, setCategories] = useState<{
        id: number,
        name: string
    }[]>([])
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilter] = useForm<{
        debounce?: boolean,
        page: number,
        keyword: string,
        marketing_material_category_id?: number,
    }>({
        debounce: true,
        page: 1,
        keyword: '',
    });








    const load = async () => {
        setLoading(true);
        var r = await MarketingMaterialCategoryService.all();
        if (r.success) {
            setCategories(r.data);
            setFilter('marketing_material_category_id')(r.data?.[0]?.id);
            setLoading(false);
        }

    }


    const debounceSearch = useDebounce(() => {
        search();
    }, 300, 1);

    const search = async () => {
        setSearching(true);
        var r = await MarketingMaterialService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }

    useEffect(() => {

        if (categories.length > 0) {
            if (filters.debounce) {
                debounceSearch();
            } else {
                search();
            }
        } else {
            load();
        }

    }, [filters]);









    if (loading) {
        return <CenterLoading className="relative h-[400px]" />
    }
    return (
        <>
            <div className="grid grid-cols-4 gap-3">
                <div className="">
                    <div className='flex flex-col max-w-sm gap-3 mb-3'>
                        <Radio value={form.has_referral} onChange={setValue('has_referral')} options={YesNoArray}>Avaiable for referral ?</Radio>
                        {!!form.has_referral && <>
                            <TextField type='number' value={form.commission_percentage} onChange={setValue('commission_percentage')} placeholder='Enter %'>Commission Percentage / Referral</TextField>
                            <Radio value={form.has_commission_on_renewal} onChange={setValue('has_commission_on_renewal')} options={YesNoArray}>Give commision on renewal ?</Radio>
                            {!!form.has_commission_on_renewal && <TextField type='number' value={form.renewal_commission_percentage} onChange={setValue('renewal_commission_percentage')} placeholder='Enter %'>Renewal Commission Percentage</TextField>}
                            <Radio value={form.has_secondary_commission} onChange={setValue('has_secondary_commission')} options={YesNoArray}>Has Secondary Commission ?</Radio>
                            {!!form.has_secondary_commission && <>
                                <TextField type="number" value={form.secondary_commission} onChange={setValue('secondary_commission')} placeholder='Enter renewal secondary commission percentage %'>Secondary Commission Percentage</TextField>
                                <Radio value={form.has_renewal_secondary_commission} onChange={setValue('has_renewal_secondary_commission')} options={YesNoArray}>Has Commission on secondary renewal ?</Radio>
                                {!!form.has_renewal_secondary_commission && <TextField type="number" value={form.renewal_secondary_commission} onChange={setValue('renewal_secondary_commission')} placeholder='Enter renewal secondary commission percentage %'>Secondary Renwal Commission Percentage</TextField>}
                            </>}
                        </>}
                    </div>
                </div>
                {!!form.has_referral && <>
                    <div className=' border p-3 rounded-lg col-span-2'>

                        <div className="mb-8">
                            <label className="block text-lg font-medium text-gray-700 mb-3">
                                Marketing Material Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setFilter('marketing_material_category_id', 'debounce')(category.id)}
                                        className={`flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 shadow-md ${filters.marketing_material_category_id === category.id
                                            ? 'bg-primary text-white ring-4 ring-indigo-300'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                            }`}
                                    >
                                        <span className="ml-2">{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>




                        <div className="mt-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-5">
                                Existing Materials ({categories.find(c => c.id == filters.marketing_material_category_id)?.name})
                            </h2>
                            {searching && <CenterLoading className='h-[400px] relative' />}

                            {!searching && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                {paginated.records.map((material) => {
                                    var checked = !!(state.product_marketing_materials ?? []).find(m => m.id == material.id);
                                    return <label className='aspect-square relative border p-4'>
                                        <div className='absolute bottom-0 bg-black/20 w-full left-0 p-2  font-medium flex items-center gap-2'>
                                            <Checkbox checked={checked} onCheckedChange={chk =>
                                                setStateValue('product_marketing_materials')(chk ? [...(state.product_marketing_materials ?? []), material] : (state.product_marketing_materials ?? []).filter(x => x.id !== material.id))} />
                                            <span className="text-xs">{material.media_name}</span>
                                        </div>
                                        <img src={material.media_path} className='max-w-full max-h-full' />
                                    </label>;
                                })}
                            </div>}
                        </div>
                        {!searching && paginated.records.length == 0 && <NoRecords />}
                        <Pagination className="p-3" paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />
                    </div>
                    <div className='border p-3 rounded-lg'>
                        <label className="block text-lg font-medium text-gray-700 mb-3">
                            Selected Marketing Material
                        </label>
                        <div className='flex flex-col gap-3'>
                            {categories.filter(c => state.product_marketing_materials.map(mm => mm.marketing_material_category_id).includes(c.id)).map(category => {
                                return <div className=''>
                                    <span className='font-medium text-2xl flex mb-1'>{category.name}</span>
                                    <div className='space-y-2'>

                                        {state.product_marketing_materials.filter(mm => mm.marketing_material_category_id == category.id).map((material) => {

                                            var found = (state.product_marketing_materials ?? []).find(m => m.id == material.id);
                                            return <div className=' relative border rounded-lg hover:border-sky-500 overflow-hidden transition-all hover:bg-sky-50'>
                                                <div className="flex flex-row p-2 gap-2">
                                                    <div className="w-[100px] min-w-[100px]">
                                                        <div className="aspect-square border p-1 rounded-lg overflow-hidden">
                                                            <img src={material.media_path} className='max-w-full max-h-full' />
                                                        </div>
                                                    </div>

                                                    <div className="font-medium flex items-center gap-2 flex-1 overflow-hidden">
                                                        <span className="text-xs text-ellipsis whitespace-nowrap overflow-hidden flex-1">
                                                            {material.media_name}
                                                        </span>
                                                        <Btn className="shrink-0" variant="destructive" size="xs">
                                                            <LuX />
                                                        </Btn>
                                                    </div>
                                                </div>
                                                <div className="p-2 space-y-2">
                                                    <TextField multiline placeholder="Caption" value={found?.message} onChange={setStateValue(`product_marketing_materials[id:${material.id}].message`)}></TextField>
                                                </div>
                                            </div>;
                                        })}
                                    </div>

                                </div>
                            })}
                        </div>
                    </div>
                </>}
            </div>
            {!!form.has_referral && <Richtext value={form.referral_content} onChange={setValue('referral_content')} placeholder='Enter instrucitons and terms'>Instructions & Terms</Richtext>}

            <div className="flex flex-row justify-end w-full">
                <Btn loading={saving} onClick={save}>Save Details</Btn>
            </div>

        </>
    )
}
