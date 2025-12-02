import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DateTimeField from '@/components/common/DateTimeField';
import SuggestCustomer from '@/components/common/suggest/SuggestCustomer';
import SuggestProduct from '@/components/common/suggest/SuggestProduct';
import TextField from '@/components/common/TextField';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import SuggestTaxCode from '@/components/common/suggest/SuggestTaxCode';
import { useForm } from "@/hooks/use-form";
import NoRecords from "@/components/common/NoRecords";
import Btn from "@/components/common/Btn";
import { LuPlus, LuX } from "react-icons/lu";
import moment from "moment";
import Dropdown from "@/components/common/Dropdown";
import SuggestDiscount from "@/components/common/suggest/SuggestDiscount";
import { ProductService } from "@/services/ProductService";
import { ProductPrice } from "@/data/Product";
import SuggestState from "@/components/common/suggest/SuggestState";
import { calculateOrder } from "./helpers/TaxCalculator";
import { downloadInvoicePdf } from "./helpers/TaxInvoice";



export default function QuickInvoice() {
    const [form, setValue] = useForm<any>({
        country_id: undefined,
        invoice_date: moment().format('Y-MM-DD'),
        user_id: undefined,
        products: []
    })


    const addProduct = () => {
        setValue('products[]')({
            id: new Date().getTime(),
            quantity: 1
        })
    }

    var calculated = calculateOrder(form);

    return (<div>


        <div className='grid grid-cols-3 gap-6'>
            <div className='p-3 rounded-lg shadow-lg border bg-white space-y-3'>
                <SuggestCountry value={form.country_id} onChange={v => setValue('country_id', 'products', 'state_id')(v, form.products.map((p: any) => ({ ...p, tax_code_id: undefined, product_price_id: undefined })))} onSelect={setValue('country')} />
                <DateTimeField value={form.invoice_date} onChange={setValue('invoice_date')} previewFormat="DD MMM, Y" mode='date' placeholder='Invoice Date'>Invoice Date</DateTimeField>
            </div>
            <div className='p-3 rounded-lg shadow-lg border bg-white space-y-3'>
                <SuggestCustomer value={form.user_id} onChange={setValue('user_id')} placeholder='Select a customer'>Customer</SuggestCustomer>
                <div className="grid grid-cols-2 gap-3">
                    <TextField value={form.gst_number} onChange={setValue('gst_number')} placeholder="Enter gst number">Gst Number</TextField>
                    <SuggestState country_id={form.country_id} disabled={!form.country_id} value={form.state_id} onChange={setValue('state_id')} />
                    <TextField value={form.pincode} onChange={setValue('pincode')} placeholder="Enter pincode">Pincode</TextField>
                </div>
                <TextField value={form.address} onChange={setValue('address')} placeholder="Enter address" multiline rows={3}>Delivery Address</TextField>
            </div>
        </div>
        <div className="overflow-x-auto mt-6 bg-white shadow-lg rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Base</TableHead>
                        <TableHead>Taxable</TableHead>
                        <TableHead>Discount</TableHead>
                        {calculated.unique_tax_components.map(tax => <TableHead key={tax.tax_component_id}>{tax.tax_component_name}</TableHead>)}
                        <TableHead>Total</TableHead>
                        <TableHead>
                            <Btn size={'sm'} variant={'outline'} onClick={addProduct}><LuPlus /></Btn>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {form.products.map((product: any) => {
                        var cp = calculated.product_calcs.find(pc => pc.id == product?.id);
                        const base = cp?.base ?? 0;
                        const taxable = cp?.taxable ?? 0;
                        const total = cp?.total ?? 0;
                        const discount = cp?.discount ?? 0;
                        const discount_percentage = cp?.discount_percentage ?? 0;
                        return (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <SuggestProduct
                                        disabled={!form.country_id}
                                        value={product.product_id}
                                        onChange={setValue(`products[id:${product.id}].product_id`, `products[id:${product.id}].tax_code_id`, `products[id:${product.id}].product_price_id`)}
                                        onSelect={setValue(`products[id:${product.id}].product`)}
                                        children=''
                                        placeholder='Select a product'
                                        selected={{ id: product?.product?.id, name: product?.product?.name }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <SuggestTaxCode
                                        fetch_rates={true}
                                        disabled={!form.country_id || !product.product_id} country_id={form.country_id}
                                        value={product.tax_code_id}
                                        onChange={setValue(`products[id:${product.id}].tax_code_id`, `products[id:${product.id}].product_price_id`)}
                                        onSelect={setValue(`products[id:${product.id}].tax_code`)}
                                        children=''
                                        selected={{ id: product?.tax_code?.id, name: product?.tax_code?.name }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Dropdown
                                        disabled={!form.country_id || !product.product_id || !product.tax_code_id}
                                        value={product.product_price_id}
                                        onChange={setValue(`products[id:${product.id}].product_price_id`)}
                                        placeholder="Select price"
                                        selected={{ id: product?.price?.id, name: product?.price?.name }}
                                        getOptions={async () => {
                                            var r = await ProductService.loadPrices({
                                                country_id: form.country_id,
                                                tax_code_id: product.tax_code_id,
                                                product_id: product.product_id
                                            });
                                            if (r.success) {
                                                return r.data.map((pp: ProductPrice) => ({
                                                    name: `MRP - ${form?.country?.currency_symbol ?? ''}${pp.mrp} | SP -  ${form?.country?.currency_symbol ?? ''}${pp.sp}`,
                                                    description: `SKU - ${pp.sku} | STOCK - ${pp.quantity}`,
                                                    ...pp
                                                }))
                                            }
                                            return [];
                                        }}
                                        onSelect={setValue(`products[id:${product.id}].price`)}
                                    />
                                </TableCell>

                                <TableCell>
                                    <div className="w-[100px]">
                                        <TextField value={product.quantity} onChange={setValue(`products[id:${product.id}].quantity`)} type='number' placeholder='Quantity' />
                                    </div>
                                </TableCell>
                                <TableCell>{form.country?.currency_symbol}{base.toFixed(2)}</TableCell>
                                <TableCell>{form.country?.currency_symbol}{taxable.toFixed(2)}</TableCell>
                                <TableCell>
                                    <div className="flex flex-row items-center gap-1">
                                        <span className="text-sm">{form.country?.currency_symbol}{discount.toFixed(2)}</span>
                                        <span className="text-xs text-gray-500 italic">({discount_percentage.toFixed(2)})%</span>
                                    </div>
                                </TableCell>
                                {calculated.unique_tax_components.map(tax => {
                                    var tax_calc = cp?.taxes?.find?.(t => t.tax_component_id == tax.tax_component_id);
                                    return <TableCell key={tax.tax_component_id}>
                                        <div className="flex flex-row gap-1 items-center">
                                            <span className="text-sm">{form.country?.currency_symbol}{(tax_calc?.amount ?? 0).toFixed(2)}</span>
                                            <span className="text-xs text-gray-500 italic">({tax_calc?.percentage ?? 0}%)</span>
                                        </div>
                                    </TableCell>;
                                })}

                                <TableCell>
                                    {!!product.price && <div>
                                        <span>{form?.country?.currency_symbol}{total.toFixed(2)}</span>
                                    </div>}
                                    {!product.price && <span className="text-xs italic text-gray-500">Select Price</span>}
                                </TableCell>
                                <TableCell>
                                    <Btn onClick={() => setValue(`products[id:${product.id}]-`)()} variant={'destructive'} size={'sm'}> <LuX /></Btn>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            {form.products.length > 0 && <div className="p-3 border-t">
                <Btn variant={'outline'} size={'sm'} onClick={addProduct}><LuPlus /> Add Products</Btn>
            </div>}
            {form.products.length == 0 && <NoRecords title="No Products" subtitle="Try adding some products" action={
                <Btn variant={'outline'} onClick={addProduct}><LuPlus />Add Product</Btn>
            } />}
        </div>

        <div className="flex flex-row mt-6 justify-end gap-4 mb-10">
            {calculated.grouped_taxes.length > 0 && <div className=' w-[300px] p-3 rounded-lg shadow-lg border bg-white'>
                {calculated.grouped_taxes.map((gt, gti) => {
                    return <div key={gt.tax_component_id + '_' + gti} className={`flex flex-row justify-between items-center ${gti < calculated.grouped_taxes.length - 1 ? 'border-b' : ''} py-1`}>
                        <span className="font-bold">{gt.tax_component_name} ({gt.percentage}%)</span>
                        <span>{form.country?.currency_symbol}{gt.value.toFixed(2)}</span>
                    </div>
                })}
            </div>}
            <div className='w-[300px] p-3 rounded-lg shadow-lg border bg-white space-y-3'>
                <SuggestDiscount
                    valid_only={true}
                    load_applications={true}
                    value={form.discount_plan_id}
                    onChange={(v) => {
                        if (!v) {
                            setValue('discount_plan_id', 'discount_plan')(v)
                        } else {
                            setValue('discount_plan_id')(v)
                        }

                    }}
                    onSelect={setValue('discount_plan')}
                    placeholder="Select a discount plan"
                />
                <div className="flex flex-row justify-between">
                    <span className="font-bold">Subtotal</span>
                    <span>
                        {form.country?.currency_symbol}
                        {calculated.order_totals.base.toFixed(2)}
                    </span>
                </div>

                {/* <div className="flex flex-row justify-between">
                    <span className="font-bold">Taxable</span>
                    <span>
                        {form.country?.currency_symbol}
                        {calculated.order_totals.taxable.toFixed(2)}
                    </span>
                </div> */}

                <div className="flex flex-row justify-between">
                    <span className="font-bold">Tax</span>
                    <span>
                        {form.country?.currency_symbol}
                        {calculated.order_totals.tax.toFixed(2)}
                    </span>
                </div>


                <div className="flex flex-row justify-between">
                    <span className="font-bold">Discount</span>
                    <span>
                        {form.country?.currency_symbol}
                        {calculated.order_totals.discount.toFixed(2)}
                    </span>
                </div>


                <div className="flex flex-row justify-between border-t pt-2">
                    <span className="font-bold text-lg">Total</span>
                    <span className="text-lg font-bold">
                        {form.country?.currency_symbol}
                        {calculated.order_totals.total.toFixed(2)}
                    </span>
                </div>
                <div className="justify-end flex">
                    <Btn variant={'destructive'} size={'sm'} onClick={() => {
                        console.log(JSON.stringify(calculated));
                        downloadInvoicePdf(calculated, {
                            currency_symbol: form.country?.currency_symbol,
                            billto: {
                                id: 0,
                                name: 'Test Bill',
                                gst_number: '12313123',
                                pincode: '123123',
                                address: 'JMD megapolis',
                            },
                            shipto: {
                                id: 0,
                                name: 'Test Bill',
                                gst_number: '12313123',
                                pincode: '123123',
                                address: 'JMD megapolis',
                            },
                            seller: {
                                id: 0,
                                name: 'Test Bill',
                                gst_number: '12313123',
                                pincode: '123123',
                                address: 'JMD megapolis',
                            }
                        })
                    }}>Generate Invoice</Btn>
                </div>
            </div>

        </div>

    </div>);
};

