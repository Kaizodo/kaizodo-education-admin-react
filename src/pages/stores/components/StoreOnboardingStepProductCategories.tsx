import AppCard from '@/components/app/AppCard'
import { useSetValue } from '@/hooks/use-set-value';
import { useEffect, useState } from 'react'
import Btn from '@/components/common/Btn';
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import { useGlobalContext } from '@/hooks/use-global-context';
import { OrganizationOnboardingStepsProps } from '../StoreEditor';

import { useDefaultParams } from '@/hooks/use-default-params';
import SuggestProductCategory from '@/components/common/suggest/SuggestProductCategory';
import Radio from '@/components/common/Radio';
import { YesNoArray } from '@/data/Common';
import NoRecords from '@/components/common/NoRecords';
import { MdOutlineChecklist } from 'react-icons/md';
import { CategoryTree, ProductTypeArray } from '@/data/Product';
import { StoreService } from '@/services/StoreService';
import { LuArrowRight, LuX } from 'react-icons/lu';



export default function StoreOnboardingStepProductCategories({ organization_id, onLoading, registerCallback }: OrganizationOnboardingStepsProps & {
    organization_id?: number
}) {
    const { id } = useDefaultParams<{ id: string }>(organization_id ? { id: `${organization_id}` } : undefined);
    const [form, setForm] = useState<any>({
        sell_all_product_category: 1,
        categories: [],
    });
    const setValue = useSetValue(setForm);
    const [loading, setLoading] = useState(true);
    const { setContext } = useGlobalContext();
    const load = async () => {
        setLoading(true);
        var r = await StoreService.loadProductCategoryDetails(Number(id));
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        registerCallback?.(async () => {
            var r = await StoreService.saveProductCategoryDetails({
                id,
                sell_all_product_category: form.sell_all_product_category,
                product_type: form.product_type,
                product_category_ids: form.categories.map((c: any) => c.id)
            });
            if (r.success) {
                setContext(c => ({ ...c, admission_progress: r.data.progress }));
                msg.success('Details saved successfuly');
            }
            return r.success;
        })
    });

    useEffect(() => {
        onLoading?.(loading);
    }, [loading])

    useEffect(() => {
        if (!!id) {
            load();
        } else {
            setLoading(false);
        }
    }, []);


    if (loading) {
        return <CenterLoading className="relative h-[400px]" />
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
            <AppCard
                title='Product Categories'
                subtitle='Please select categories which store can sell'
                mainClassName="rounded-none border-none shadow-none"
                contentClassName="px-6 pb-6 flex flex-col gap-6"

            >
                <Radio value={form.product_type} onChange={setValue('product_type')} options={[{ id: 2, name: 'All Types' }, ...ProductTypeArray]}>Type of Product</Radio>
                <div className='bg-sky-50 border-sky-400 border p-3 rounded-lg flex flex-row items-end gap-3'>
                    <div>
                        <Radio value={form.sell_all_product_category} onChange={setValue('sell_all_product_category')} options={YesNoArray}>All Categories</Radio>
                    </div>
                    {!form.sell_all_product_category && <>
                        <div className='flex-1'>
                            <SuggestProductCategory
                                is_service={form.product_type == 2 ? undefined : form.product_type}
                                value={form.product_category_id}
                                exclude_ids={form.categories.map((c: any) => c.id)}
                                onChange={setValue('product_category_id')}
                                onSelect={setValue(`category`)}
                            />
                        </div>
                        <div>
                            <Btn disabled={!form.category} onClick={() => setValue(`categories[]`, 'category', 'product_category_id')(form.category)}>Add Category</Btn>
                        </div>
                    </>}
                </div>
                {!!form.sell_all_product_category && <NoRecords icon={MdOutlineChecklist} title='All Categories Allowed' subtitle='Store can sell products on all categories' />}
                <div className="flex flex-col gap-2">
                    {form.categories.map((category: any) => (
                        <div
                            key={category.id}
                            className="p-2 border rounded-xl bg-white shadow-sm flex flex-col gap-1"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">{category.name}</span>
                                <Btn
                                    size="xs"
                                    variant="destructive"
                                    onClick={() =>
                                        setValue("categories")(
                                            form.categories.filter((c: any) => c !== category)
                                        )
                                    }
                                >
                                    <LuX />
                                </Btn>
                            </div>

                            <div className="flex flex-wrap gap-1 text-xs items-center mt-1">
                                {category.tree
                                    .filter((t: CategoryTree) => t.id !== category.id)
                                    .map((item: CategoryTree, index: number) => (
                                        <div key={item.id} className="flex items-center gap-1">
                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-300">
                                                {item.name}
                                            </span>
                                            {index !==
                                                category.tree.filter(
                                                    (t: CategoryTree) => t.id !== category.id
                                                ).length -
                                                1 && <LuArrowRight />}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

            </AppCard>


        </div>
    )
}
