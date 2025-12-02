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
import DateTimeField from '@/components/common/DateTimeField';
function TableCell({
    children,
    fixedLeft = 0,
    fixedRight = 0,
    className,
    is_last_bottom,
    is_last_right
}: {
    children?: ReactNode,
    fixedLeft?: number,
    fixedRight?: number,
    className?: string,
    is_last_right?: boolean,
    is_last_bottom?: boolean
}) {
    return (
        <td
            className={cn(
                `cursor-pointer min-w-[150px] max-w-[150px] text-center border border-gray-200 p-2`,
                (fixedLeft > 0 || fixedRight > 0) && "sticky bg-gray-50 z-30",
                fixedLeft > 0 && 'border-r border-gray-300',
                fixedRight > 0 && 'border-l border-gray-300',
                is_last_bottom && 'border-b-0',
                is_last_right && 'border-e-0',
                className
            )}
            style={{
                left: fixedLeft > 0 ? `${fixedLeft}px` : undefined,
                right: fixedRight > 0 ? `${fixedRight}px` : undefined,
            }}
        >
            {children}
        </td>
    );
}


function TableHeading({
    children,
    className,
    fixedLeft = 0,
    fixedRight = 0,
    is_last_bottom,
    is_last_right
}: {
    children?: ReactNode,
    className?: string,
    fixedLeft?: number,
    fixedRight?: number,
    is_last_right?: boolean,
    is_last_bottom?: boolean
}) {
    return (
        <th
            className={cn(
                `border border-gray-200 min-w-[150px] max-w-[150px] text-center bg-gray-50 p-2 text-gray-500`,
                (fixedLeft > 0 || fixedRight > 0) && "sticky top-0 z-40",
                fixedLeft > 0 && 'border-r border-gray-300',
                fixedRight > 0 && 'border-l border-gray-300',
                is_last_bottom && 'border-b-0',
                is_last_right && 'border-e-0',
                className
            )}
            style={{
                left: fixedLeft > 0 ? `${fixedLeft}px` : undefined,
                right: fixedRight > 0 ? `${fixedRight}px` : undefined,
            }}
        >
            {children}
        </th>
    );
}

function HeadingTitle({ children }: { children?: ReactNode }) {
    return <div className='font-medium text-sm'>{children}</div>;
}

export default function ProductPricingInformation({ state, setStateValue }: CommonProductStateProps) {
    const [saving, setSaving] = useState(false);
    const [form, setValue, setForm] = useForm<{ prices: ProductPrice[] }>({
        prices: state.prices
    });

    const save = async () => {
        setSaving(true);
        const r = await ProductService.savePriceInformation({
            product_id: state.product.id,
            prices: form.prices
        });
        if (r.success) {
            setStateValue('prices')(form.prices);
            msg.success('Prices saved');
        }
        setSaving(false);
    };

    const togglePopular = useCallback(
        (country_id: number, id: number, checked: boolean) => {
            setForm(prev => {
                const next = structuredClone(prev) as any;
                if (!next?.prices || !Array.isArray(next.prices)) return prev;

                next.prices = next.prices.map((p: any) => {
                    if (p.country_id !== country_id) return p;

                    if (!checked && p.id === id) return { ...p, popular: false };
                    if (checked) return { ...p, popular: p.id === id };

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
        });
    };

    return (
        <>
            <div className='w-full relative overflow-auto'>
                <table className="border-separate border-spacing-0 w-full table-auto">
                    <thead className="sticky top-0 bg-white z-20">
                        <tr className="bg-white">
                            {/* Left fixed columns */}
                            <TableHeading fixedLeft={1}><HeadingTitle>Country</HeadingTitle></TableHeading>
                            <TableHeading fixedLeft={150}><HeadingTitle>Tax Scheme</HeadingTitle></TableHeading>

                            {/* Middle columns */}
                            <TableHeading><HeadingTitle>MRP</HeadingTitle></TableHeading>
                            <TableHeading><HeadingTitle>Selling Price</HeadingTitle></TableHeading>
                            <TableHeading><HeadingTitle>Cost Price</HeadingTitle></TableHeading>
                            {state.product.product_type === ProductType.Service &&
                                <TableHeading><HeadingTitle>Duration (Days)</HeadingTitle></TableHeading>
                            }
                            {state.product.product_type === ProductType.Goods &&
                                <>
                                    <TableHeading><HeadingTitle>Quantity</HeadingTitle></TableHeading>
                                    <TableHeading><HeadingTitle>SKU</HeadingTitle></TableHeading>
                                    <TableHeading><HeadingTitle>Barcode Number</HeadingTitle></TableHeading>
                                    <TableHeading><HeadingTitle>Expiry Date</HeadingTitle></TableHeading>
                                </>
                            }

                            {/* Right fixed columns */}
                            <TableHeading fixedRight={70} className='max-w-[70px] min-w-[70px]'><HeadingTitle>Popular</HeadingTitle></TableHeading>
                            <TableHeading fixedRight={1} is_last_right={true} className='max-w-[70px] min-w-[70px]'>
                                <div className='flex justify-center'>
                                    <LuTrash2 />
                                </div>
                            </TableHeading>
                        </tr>
                    </thead>
                    <tbody>
                        {form.prices.map((pp: ProductPrice) => (
                            <tr key={pp.id} className="hover:bg-accent">
                                <TableCell fixedLeft={1}>
                                    <SuggestCountry value={pp.country_id} onChange={setValue(`prices[id:${pp.id}].country_id`)} selected={{ id: pp.country_id, name: pp.country_name, image: pp.image }} children='' />
                                </TableCell>
                                <TableCell fixedLeft={150}>
                                    <SuggestTaxCode country_id={pp.country_id} disabled={!pp.country_id} value={pp.tax_code_id} onChange={setValue(`prices[id:${pp.id}].tax_code_id`)} selected={{ id: pp.tax_code_id, name: pp.tax_code_name }} children='' />
                                </TableCell>

                                <TableCell><TextField type='number' disabled={!pp.country_id} value={pp.mrp} onChange={setValue(`prices[id:${pp.id}].mrp`)} /></TableCell>
                                <TableCell><TextField type='number' disabled={!pp.country_id} value={pp.sp} onChange={setValue(`prices[id:${pp.id}].sp`)} /></TableCell>
                                <TableCell><TextField type='number' disabled={!pp.country_id} value={pp.cp} onChange={setValue(`prices[id:${pp.id}].cp`)} /></TableCell>

                                {state.product.product_type === ProductType.Service &&
                                    <TableCell><TextField type='number' disabled={!pp.country_id} value={pp.duration_days} onChange={setValue(`prices[id:${pp.id}].duration_days`)} /></TableCell>
                                }
                                {state.product.product_type === ProductType.Goods &&
                                    <>
                                        <TableCell><TextField type='number' disabled={!pp.country_id} value={pp.quantity} onChange={setValue(`prices[id:${pp.id}].quantity`)} /></TableCell>
                                        <TableCell><TextField disabled={!pp.country_id} value={pp.sku} onChange={setValue(`prices[id:${pp.id}].sku`)} /></TableCell>
                                        <TableCell><TextField disabled={!pp.country_id} value={pp.barcode} onChange={setValue(`prices[id:${pp.id}].barcode`)} /></TableCell>

                                        <TableCell><DateTimeField value={pp.expiry_date} onChange={setValue(`prices[id:${pp.id}].expiry_date`)} mode='date' placeholder='Select a date' /></TableCell>
                                    </>
                                }

                                <TableCell fixedRight={70} className='max-w-[70px] min-w-[70px]'>
                                    <Switch checked={!!pp.popular} onCheckedChange={(checked) => {
                                        const count = form.prices.filter(p => p.country_id === pp.country_id && !!p.popular).length;
                                        if (!checked && count === 1) return;
                                        togglePopular(pp.country_id, pp.id, checked);
                                    }} />
                                </TableCell>

                                <TableCell fixedRight={1} is_last_right={true} className='max-w-[70px] min-w-[70px]'>
                                    <Btn size='sm' variant='outline' onClick={() => setValue('prices')(form.prices.filter(p => p.id !== pp.id))}><LuTrash2 /></Btn>
                                </TableCell>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {form.prices.length === 0 && (
                    <NoRecords icon={TbTransactionRupee} title='Add Pricing' subtitle='Try adding some pricing in order to start selling' action={<Btn variant='outline' onClick={addPricing}><LuPlus />Add Pricing</Btn>} />
                )}
            </div>

            <div className='sticky bottom-0 px-3 pb-3'>
                {form.prices.length > 0 && (
                    <div className='flex flex-row justify-between w-full bg-white rounded-lg p-2 shadow-lg border'>
                        <Btn variant='outline' onClick={addPricing}><LuPlus />Add More Pricing</Btn>
                        <div className="items-center gap-3 flex">
                            <span className="text-xs text-gray-500">Save Price Information</span>
                            <Btn loading={saving} onClick={save}><LuSave /> Save Price</Btn>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
