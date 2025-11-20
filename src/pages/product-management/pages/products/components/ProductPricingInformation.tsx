import { cn } from '@/lib/utils';
import { ReactNode, useCallback, useState } from 'react';
import Btn from '@/components/common/Btn';
import { LuPlus, LuSave, LuTrash2 } from 'react-icons/lu';
import TextField from '@/components/common/TextField';
import NoRecords from '@/components/common/NoRecords';
import { TbTransactionRupee } from 'react-icons/tb';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import SuggestTaxCode from '@/components/common/suggest/SuggestTaxCode';
import { CommonProductStateProps, ProductPrice } from '@/data/Product';

import { useForm } from '@/hooks/use-form';
import { ProductService } from '@/services/ProductService';
import { msg } from '@/lib/msg';
import { ProductType } from '@/data/Product';
import { Switch } from '@/components/ui/switch';
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
            `border border-t-0  border-s-0 border-e-1 border-b-1 border-gray-200   min-w-[150px]  max-w-[150px] text-center bg-gray-50 p-2 text-gray-500`,
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




export default function ProductPricingInformation({ state, setStateValue }: CommonProductStateProps) {
    const [saving, setSaving] = useState(false);
    const [form, setValue, setForm] = useForm<{
        prices: ProductPrice[]
    }>({
        prices: state.prices
    });

    const save = async () => {
        setSaving(true);
        var r = await ProductService.savePriceInformation({
            product_id: state.product.id,
            prices: form.prices
        });
        if (r.success) {
            setStateValue('prices')(form.prices);
            msg.success('Prices saved');
        }
        setSaving(false);
    }

    const togglePopular = useCallback(
        (country_id: number, id: number, checked: boolean) => {
            setForm(prev => {
                const next = structuredClone(prev) as any;
                if (!next?.prices || !Array.isArray(next.prices)) return prev;

                next.prices = next.prices.map((p: any) => {
                    if (p.country_id !== country_id) return p;

                    // turn off → only clear this item
                    if (!checked && p.id === id) {
                        return { ...p, popular: false };
                    }

                    // turn on → set this true, all others false
                    if (checked) {
                        return { ...p, popular: p.id === id };
                    }

                    return p;
                });

                return next;
            });
        },
        [setForm]
    );


    const addPricing = () => {

        setValue('prices[]')({
            id: new Date().getTime(),
            popular: 1
        })
    }




    return (
        <>


            <div className='w-full max-h-[500px]  min-h-[200px] relative overflow-auto '>
                <table className="border-separate border-spacing-0 w-full table-auto ">
                    <thead className="sticky top-0 bg-white z-20">
                        <tr className="bg-white">
                            <TableHeading fixed={true} className='min-w-[150px]'>
                                <HeadingTitle>Country</HeadingTitle>
                            </TableHeading>
                            <TableHeading className='min-w-[150px]'>
                                <HeadingTitle>Tax Scheme</HeadingTitle>
                            </TableHeading>
                            <TableHeading className='min-w-[150px]'>
                                <HeadingTitle>MRP</HeadingTitle>
                            </TableHeading>

                            <TableHeading className='min-w-[150px]'>
                                <HeadingTitle>Selling Price</HeadingTitle>
                            </TableHeading>

                            <TableHeading className='min-w-[150px]'>
                                <HeadingTitle>Cost Price</HeadingTitle>
                            </TableHeading>


                            {state.product.product_type === ProductType.Service &&
                                <TableHeading className='min-w-[150px]'>
                                    <HeadingTitle>Duration (Days)</HeadingTitle>
                                </TableHeading>}
                            <TableHeading className='min-w-[150px]'>
                                <HeadingTitle>Popular</HeadingTitle>
                            </TableHeading>

                            <TableHeading className='min-w-[50px]' is_last_right={true}>
                                <div className='flex items-center justify-center'>
                                    <LuTrash2 />
                                </div>
                            </TableHeading>
                        </tr>
                    </thead>
                    <tbody>
                        {form.prices.map((pp: ProductPrice) => (
                            <tr key={pp.id} className="hover:bg-accent" onClick={() => { }}>
                                <TableCell fixed={true} className='min-w-[150px]' >
                                    <SuggestCountry value={pp.country_id} onChange={setValue(`prices[id:${pp.id}].country_id`)} children='' selected={{ id: pp.country_id, name: pp.country_name, image: pp.image }} />
                                </TableCell>
                                <TableCell className='min-w-[150px]' >
                                    <SuggestTaxCode
                                        country_id={pp.country_id} disabled={!pp.country_id} value={pp.tax_code_id}
                                        onChange={setValue(`prices[id:${pp.id}].tax_code_id`)}
                                        children=''
                                        selected={{ id: pp.tax_code_id, name: pp.tax_code_name }} />
                                </TableCell>
                                <TableCell className='min-w-[150px]' >
                                    <TextField type='number' disabled={!pp.country_id} value={pp.mrp} onChange={setValue(`prices[id:${pp.id}].mrp`)} />
                                </TableCell>
                                <TableCell className='min-w-[150px]' >
                                    <TextField type='number' disabled={!pp.country_id} value={pp.sp} onChange={setValue(`prices[id:${pp.id}].sp`)} />
                                </TableCell>

                                <TableCell className='min-w-[150px]' >
                                    <TextField type='number' disabled={!pp.country_id} value={pp.cp} onChange={setValue(`prices[id:${pp.id}].cp`)} />
                                </TableCell>

                                {state.product.product_type === ProductType.Service && <TableCell className='min-w-[150px]' >
                                    <TextField type='number' disabled={!pp.country_id} value={pp.duration_days} onChange={setValue(`prices[id:${pp.id}].duration_days`)} />
                                </TableCell>}
                                <TableCell className='min-w-[150px]' >
                                    <Switch
                                        checked={!!pp.popular}
                                        onCheckedChange={(checked) => {
                                            const count = form.prices.filter(p => p.country_id === pp.country_id && !!p.popular).length;

                                            if (!checked && count === 1) return;        // block turning off last one
                                            togglePopular(pp.country_id, pp.id, checked);
                                        }}
                                    />



                                </TableCell>
                                <TableCell className='min-w-[50px]' is_last_right={true} >
                                    <Btn size={'sm'} variant={'outline'} onClick={() => setValue('prices')(form.prices.filter((ppx: ProductPrice) => ppx.id !== pp.id))}><LuTrash2 /></Btn>
                                </TableCell>
                            </tr>
                        ))}

                    </tbody>
                </table>
                {form.prices.length > 0 && <div className='flex flex-row justify-between p-3'>
                    <Btn variant={'outline'} onClick={addPricing}><LuPlus />Add More Pricing</Btn>
                    <Btn onClick={save} loading={saving}><LuSave />Save Price</Btn>
                </div>}
                {form.prices.length == 0 && <NoRecords icon={TbTransactionRupee} title='Add Pricing' subtitle='Try adding some pricing in order to start selling' action={<Btn variant={'outline'} onClick={addPricing}><LuPlus />Add Pricing</Btn>} />}
            </div>
        </>

    );
};

