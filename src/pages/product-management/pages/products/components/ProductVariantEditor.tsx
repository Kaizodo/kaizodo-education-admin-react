import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';
import ProductEditorSection from "./ProductEditorSection";
import Btn from '@/components/common/Btn';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import TextField from '@/components/common/TextField';
import SuggestUnit from '@/components/common/suggest/SuggestUnit';
import { type SetValueType } from '@/hooks/use-set-value';
import Checkable from '@/components/common/Checkable';
import NoRecords from '@/components/common/NoRecords';
import { TbTransactionRupee } from 'react-icons/tb';
import { Modal, ModalBody } from '@/components/common/Modal';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import SuggestTaxCode from '@/components/common/suggest/SuggestTaxCode';
function TableCell({ children, fixed = false, className, is_last_bottom, is_last_right }: { children?: ReactNode, fixed?: boolean, className?: string, is_last_right?: boolean, is_last_bottom?: boolean }) {
    return (<td

        className={cn(
            ` cursor-pointer min-w-[150px] max-w-[150px] text-center border border-t-0 border-s-0 border-e-1 border-b-1 border-gray-200 p-2`,
            fixed && "sticky left-0 bg-gray-50 z-0     border-r-1  ",
            is_last_bottom && 'border-b-0',
            is_last_right && 'border-e-0',
            className
        )}
    >
        {children}
    </td>);
}

function TableHeading({ children, className, fixed = false, is_last_bottom, is_last_right }: { children?: ReactNode, fixed?: boolean, className?: string, is_last_right?: boolean, is_last_bottom?: boolean }) {
    return (<th
        className={cn(
            `border border-s-0 border-e-1 border-b-1 border-gray-200   min-w-[150px]  max-w-[150px] text-center bg-gray-50 p-2 text-gray-500`,
            fixed && "sticky left-0   z-30     top-0",
            is_last_bottom && 'border-b-0',
            is_last_right && 'border-e-0',
            className
        )}
    >{children}</th>)
}

function HeadingTitle({ children }: { children?: string }) {
    return <div className='font-medium text-sm'>{children}</div>
}



type ProductPrice = {
    id: number,
    saved: boolean,
    mrp: number,
    sp: number,
    cp: number,
    quantity: number,
    unit_id: number,
    unit_name: string,
    name: string,
    sku: string,
    code: string,
    country_id: number,
    country_name: string,
    currency_code: string,
    currency_symbol: string,
}

export default function ProductVariantEditor({ product_prices, setValue }: { product_prices: ProductPrice[], setValue: SetValueType }) {

    const currencies: ProductPrice[] = Object.values(
        product_prices.reduce((a, v) => {
            a[v.country_id] = v
            return a
        }, {})
    )

    const proper = {
        mrp: "MRP",
        sp: "Selling Price",
        cp: 'Cost Price',
        quantity: "Quantity",
        unit: "Unit",
        sku: "SKU",
        code: "Code"
    }
    const [columns, setColumns] = useState(['mrp', 'sp', 'cp', 'quantity', 'unit']);

    const addCurrency = () => {
        Modal.show({
            title: 'Add Currency',
            subtitle: 'Add pricing based on country and its tax system ',
            content: () => {
                return <>
                    <ModalBody>
                        <SuggestCountry />
                        <SuggestTaxCode />
                    </ModalBody>
                    <ModalBody>
                        <Btn>Add Currency</Btn>
                    </ModalBody>
                </>
            }
        })
    }

    const addPricing = () => {

        setValue('product_prices[]')({
            id: new Date().getTime(),
            saved: false,
            mrp: 0,
            sp: 0,
            quantity: 0,
            unit_id: 0,
            unit_name: '',
            name: '',
            sku: '',
            code: '',
            country_id: 0,
            country_name: '',
            currency_code: '',
            currency_symbol: '',
        })

    }




    return (
        <ProductEditorSection
            title="Product Pricing & Variants"
            subtitle="Upload attractive photos of produts"
            actions={<Btn variant={'outline'} onClick={addPricing}><LuPlus />Add Pricing</Btn>}
        >
            <div className='flex flex-row items-center flex-wrap px-3'>
                {currencies.map(currency => {
                    return <div key={currency.id} className='border rounded-lg'>
                        <span>{currency.country_name}</span>
                        <span>Currency {currency.currency_code} ({currency.currency_symbol})</span>
                    </div>
                })}
                <div className='border border-dashed rounded-lg p-2 border-sky-400 items-center justify-center flex flex-col shadow cursor-pointer'>
                    <LuPlus className='text-2xl' />
                    <span className='text-sm font-medium text-'>Add Currency</span>
                </div>
            </div>
            <div className='p-3'>
                <Checkable value={columns} onChange={setColumns} options={Object.entries(proper).map(([id, name]) => ({ id, name }))}>Enable Columns</Checkable>
            </div>
            <div className='w-full max-h-[500px]  min-h-[200px] relative overflow-auto border-1 border-gray-200'>
                <table className="border-separate border-spacing-0 w-full table-auto ">
                    <thead className="sticky top-0 bg-white z-20">
                        <tr className="bg-white">
                            <TableHeading fixed={true} className='min-w-[150px]'>
                                <HeadingTitle>Currency</HeadingTitle>
                            </TableHeading>
                            {columns.includes('mrp') && (
                                <TableHeading className='min-w-[150px]'>
                                    <HeadingTitle>MRP</HeadingTitle>
                                </TableHeading>
                            )}

                            {columns.includes('sp') && (
                                <TableHeading className='min-w-[150px]'>
                                    <HeadingTitle>Selling Price</HeadingTitle>
                                </TableHeading>
                            )}

                            {columns.includes('cp') && (
                                <TableHeading className='min-w-[150px]'>
                                    <HeadingTitle>Cost Price</HeadingTitle>
                                </TableHeading>
                            )}

                            {columns.includes('quantity') && (
                                <TableHeading className='min-w-[100px]'>
                                    <HeadingTitle>Quantity</HeadingTitle>
                                </TableHeading>
                            )}

                            {columns.includes('unit') && (
                                <TableHeading className='min-w-[150px]'>
                                    <HeadingTitle>Unit</HeadingTitle>
                                </TableHeading>
                            )}

                            {columns.includes('sku') && (
                                <TableHeading>
                                    <HeadingTitle>SKU</HeadingTitle>
                                </TableHeading>
                            )}

                            {columns.includes('code') && (
                                <TableHeading>
                                    <HeadingTitle>Product Code</HeadingTitle>
                                </TableHeading>
                            )}
                            <TableHeading className='min-w-[50px]' is_last_right={true}>
                                <div className='flex items-center justify-center'>
                                    <LuTrash2 />
                                </div>
                            </TableHeading>
                        </tr>
                    </thead>
                    <tbody>
                        {product_prices.map((pp: ProductPrice, ppi: number) => (
                            <tr key={pp.id} className="hover:bg-accent" onClick={() => { }}>
                                <TableCell fixed={true} className='min-w-[150px]' is_last_bottom={product_prices.length - 1 == ppi}>
                                    <SuggestCountry children='' />

                                </TableCell>
                                {columns.includes('mrp') && (
                                    <TableCell className='min-w-[150px]' is_last_bottom={product_prices.length - 1 == ppi}>
                                        <TextField type='number' value={pp.mrp} onChange={setValue(`product_prices[${ppi}].mrp`)} />
                                    </TableCell>
                                )}

                                {columns.includes('sp') && (
                                    <TableCell className='min-w-[150px]' is_last_bottom={product_prices.length - 1 == ppi}>
                                        <TextField type='number' value={pp.sp} onChange={setValue(`product_prices[${ppi}].sp`)} />
                                    </TableCell>
                                )}

                                {columns.includes('cp') && (
                                    <TableCell className='min-w-[150px]' is_last_bottom={product_prices.length - 1 == ppi}>
                                        <TextField type='number' value={pp.cp} onChange={setValue(`product_prices[${ppi}].cp`)} />
                                    </TableCell>
                                )}

                                {columns.includes('quantity') && (
                                    <TableCell className='min-w-[100px]' is_last_bottom={product_prices.length - 1 == ppi}>
                                        <TextField type='number' value={pp.quantity} onChange={setValue(`product_prices[${ppi}].quantity`)} />
                                    </TableCell>
                                )}

                                {columns.includes('unit') && (
                                    <TableCell className='min-w-[150px]' is_last_bottom={product_prices.length - 1 == ppi}>
                                        <SuggestUnit value={pp.unit_id} onChange={setValue(`product_prices[${ppi}].unit_id`)} children='' />
                                    </TableCell>
                                )}

                                {columns.includes('sku') && (
                                    <TableCell is_last_bottom={product_prices.length - 1 == ppi}>
                                        <TextField value={pp.sku} onChange={setValue(`product_prices[${ppi}].sku`)} />
                                    </TableCell>
                                )}

                                {columns.includes('code') && (
                                    <TableCell is_last_bottom={product_prices.length - 1 == ppi}>
                                        <TextField value={pp.code} onChange={setValue(`product_prices[${ppi}].code`)} />
                                    </TableCell>
                                )}
                                <TableCell className='min-w-[50px]' is_last_right={true} is_last_bottom={product_prices.length - 1 == ppi}>
                                    <Btn size={'sm'} variant={'outline'} onClick={() => setValue('product_prices')(product_prices.filter(ppx => ppx.id !== pp.id))}><LuTrash2 /></Btn>
                                </TableCell>
                            </tr>
                        ))}

                    </tbody>
                </table>
                {product_prices.length == 0 && <NoRecords icon={TbTransactionRupee} title='Add Pricing' subtitle='Try adding some pricing in order to start selling' action={<Btn variant={'outline'} onClick={addPricing}><LuPlus />Add Pricing</Btn>} />}
            </div>
        </ProductEditorSection>

    );
};

