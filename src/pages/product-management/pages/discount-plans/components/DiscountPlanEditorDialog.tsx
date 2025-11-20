
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { DiscountPlanService } from '@/services/DiscountPlanService';
import { DiscountBy, DiscountByArray, DiscountType, DiscountTypeArray, YesNoArray } from '@/data/Common';
import Radio from '@/components/common/Radio';
import DateTimeField from '@/components/common/DateTimeField';
import SuggestMarketer from '@/components/common/suggest/SuggestMarketer';
import { LuCamera, LuPlus, LuX } from 'react-icons/lu';
import { FaBoxOpen, FaSitemap } from 'react-icons/fa6';
import { pickMultiProduct } from '../../products/components/MultiProductPicker';
import { Product, ProductPrice, ProductType } from '@/data/Product';
import SafeImage from '@/components/common/SafeImage';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { formatDays } from '@/lib/utils';
import Richtext from '@/components/common/Richtext';
import SuggestProductCategory from '@/components/common/suggest/SuggestProductCategory';
import { ProductCategory } from '../../products/components/ProductCategorySelector';


interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}



export default function DiscountPlanEditorDialog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({
        products: [],
        product_categories: [],
    });
    const setValue = useSetValue(setForm);

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await DiscountPlanService.detail(id);
        if (r.success) {
            setForm(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        var { products, product_category, product_category_id, product_categories, ...rest } = form;
        var product_price_ids = products.flatMap((p: Product) => p.prices.map((px: ProductPrice) => px.id));
        var product_category_ids = product_categories.map((pc: ProductCategory) => pc.id);
        let r: ApiResponseType;
        if (id) {
            r = await DiscountPlanService.update({ ...rest, product_price_ids, product_category_ids });
        } else {
            r = await DiscountPlanService.create({ ...rest, product_price_ids, product_category_ids });
        }
        if (r.success) {
            msg.success(id ? 'Record updated successfully' : 'Record created successfully');
            onSuccess(r.data);
        }
        setSaving(false);
    }

    useEffect(() => {
        if (id) {
            getDetail();
        } else {
            setLoading(false);
        }
    }, [id])


    return (
        <>
            <ModalBody className='relative'>
                {!!loading && <CenterLoading className='absolute z-[50]' />}
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter name'>Name</TextField>
                <TextField
                    value={form.description}
                    multiline rows={5}
                    onChange={setValue('description')}
                    placeholder='Enter Description'
                >Description</TextField>
                <TextField type='text' value={form.code} onChange={setValue('code')} placeholder='Enter code'>Coupon Code</TextField>
                <Radio value={form.show_in_frontend} onChange={setValue('show_in_frontend')} options={YesNoArray}>Show in frontend ?</Radio>
                <Radio value={form.renewal_only} onChange={setValue('renewal_only')} options={YesNoArray}>Renewal Only ?</Radio>
                <Radio value={form.marketer_only} onChange={setValue('marketer_only')} options={YesNoArray}>Marketer Only ?</Radio>
                {!!form.marketer_only && <SuggestMarketer value={form.user_id} onChange={setValue('user_id')} />}


                <Radio value={form.discount_by} onChange={setValue('discount_by')} options={DiscountByArray}>Discount By</Radio>
                {form.discount_by == DiscountBy.Percentage && <TextField type='number' value={form.discount_percentage} onChange={setValue('discount_percentage')} placeholder='Enter percentage'>Percentage %</TextField>}
                {form.discount_by == DiscountBy.Amount && <TextField type='number' value={form.discount_amount} onChange={setValue('discount_amount')} placeholder='Enter amount'>Amount</TextField>}
                <Radio value={form.discount_type} onChange={setValue('discount_type')} options={DiscountTypeArray}>Discount Application</Radio>

                {form.discount_type == DiscountType.OrderValue && <div className='grid grid-cols-2 gap-3 p-2 bg-green-50 border border-green-400 rounded-lg'>
                    <TextField type='number' value={form.min_amount} onChange={setValue('min_amount')} placeholder='Enter amount'>Min Order Value</TextField>
                    <TextField type='number' value={form.max_amount} onChange={setValue('max_amount')} placeholder='Enter amount'>Max Order Value</TextField>
                </div>}
                {form.discount_type == DiscountType.Product && <>

                    {!form?.products?.length && <div className='bg-red-50 border-red-500 p-2 rounded-lg border flex flex-col items-center justify-center'>
                        <FaBoxOpen className='text-2xl text-red-500' />
                        <span className='text-red-500 font-medium text-sm'>Add Products</span>
                        <span className='text-xs italic text-red-900'>In order to make discount functional select some products</span>
                    </div>}

                    {form?.products?.map?.((product: Product, index: number) => {
                        return <div id={product.id + '_' + index} className='flex flex-col bg-white border p-2 rounded-lg'>
                            <div className='flex flex-row items-center w-full gap-3'>
                                <SafeImage src={product?.media?.media_path} className="h-12 w-12 shrink-0 grow-0 rounded-md border object-cover">
                                    <div className="text-2xl flex items-center justify-center flex-1  h-full w-full text-gray-400">
                                        <LuCamera />
                                    </div>
                                </SafeImage>
                                <div className="flex flex-col items-start flex-1">
                                    <div className="flex flex-col text-sm">
                                        <div className="flex flex-row items-center gap-1">
                                            <span className='font-medium'>{product.name}</span>
                                            {!!product.product_id && <Badge>Cloned</Badge>}
                                        </div>
                                        {!!product.product_id && <div className="text-xs text-gray-500">
                                            <span>Clone of </span>
                                            <Link to={"/product-management/products/" + product.product_id} target='_blank' className="text-blue-700 font-medium cursor-pointer hover:text-blue-900">{product.main_product_name}</Link>
                                        </div>}
                                    </div>
                                    <p className="text-muted-foreground text-xs italic">{product.description}</p>
                                    {product.prices.map((price: any) => {

                                        return <label className='flex flex-row items-center gap-2 font-medium'>
                                            <span className="text-xs" key={price.id}>
                                                {price.country_name} - {price.currency_symbol}{price.sp} / {product.unit_name} {product.product_type === ProductType.Service ? `(${formatDays(price.duration_days)})` : ''}
                                            </span>
                                        </label>
                                    })}
                                </div>
                                <Btn variant={'destructive'} size={'xs'} onClick={() => setValue('products')(form.products.filter((p: Product) => p !== product))}><LuX /></Btn>
                            </div>
                        </div>
                    })}
                    <Btn variant={'destructive'} onClick={async () => {
                        var products = await pickMultiProduct({
                            products: form.products
                        });
                        setValue('products')(products);
                    }} ><LuPlus />Add {form?.products?.length > 0 ? 'More ' : ''}Products</Btn>
                </>}
                {form.discount_type == DiscountType.ProductCategory && <div className='bg-orange-50 border-orange-500 p-2 rounded-lg border space-y-3'>
                    <div className='bg-white border rounded-lg flex flex-row items-end gap-3 p-2'>
                        <div className='flex-1'>
                            <SuggestProductCategory value={form.product_category_id} onChange={setValue('product_category_id')} onSelect={setValue('product_category')} />
                        </div>
                        <Btn disabled={!form.product_category_id} onClick={() => setValue('product_categories[]')(form.product_category)}>Add Category</Btn>
                    </div>

                    {!form?.product_categories?.length && <div className='bg-red-50 border-red-500 p-2 rounded-lg border flex flex-col items-center justify-center'>
                        <FaSitemap className='text-2xl text-red-500' />
                        <span className='text-red-500 font-medium text-sm'>Add Product Categories</span>
                        <span className='text-xs italic text-red-900'>In order to make discount functional select some product categories</span>
                    </div>}

                    {form?.product_categories?.map?.((pc: ProductCategory, index: number) => {
                        return <div id={pc.id + '_' + index} className='flex flex-col bg-white border p-2 rounded-lg'>
                            <div className='flex flex-row items-center w-full gap-3'>

                                <div className="flex flex-col items-start flex-1">
                                    <div className="flex flex-col text-sm">
                                        <div className="flex flex-row items-center gap-1">
                                            <span className='font-medium'>{pc.name}</span>
                                        </div>

                                    </div>
                                    <p className="text-muted-foreground text-xs italic">{pc.description}</p>

                                </div>
                                <Btn variant={'destructive'} size={'xs'} onClick={() => setValue('product_categories')(form.product_categories.filter((pcx: ProductCategory) => pcx !== pc))}><LuX /></Btn>
                            </div>
                        </div>
                    })}

                </div>}
                <div className='grid grid-cols-2 gap-3'>
                    <DateTimeField value={form.valid_from} onChange={setValue('valid_from')} placeholder='Select a date ' mode='date'>Valid From</DateTimeField>
                    <DateTimeField value={form.valid_to} onChange={setValue('valid_to')} placeholder='Select a date ' mode='date'>Valid To</DateTimeField>
                    <TextField type='number' value={form.quantity} onChange={setValue('quantity')} placeholder='Enter quantity'>Quantity</TextField>
                    <Radio value={form.publish} onChange={setValue('publish')} options={YesNoArray}>Publish ?</Radio>
                </div>
                <Richtext value={form.tnc} onChange={setValue('tnc')} placeholder='Enter terms and conditions'>Terms & Conditions</Richtext>

            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

