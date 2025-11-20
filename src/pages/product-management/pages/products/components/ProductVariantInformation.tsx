import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';
import Btn from '@/components/common/Btn';
import { LuPlus, LuSave, LuTrash2 } from 'react-icons/lu';
import TextField from '@/components/common/TextField';
import NoRecords from '@/components/common/NoRecords';
import { TbSitemap } from 'react-icons/tb';
import { CommonProductStateProps, ProductVariant, ProductVariantGroup } from '@/data/Product';

import { useForm } from '@/hooks/use-form';
import { ProductService } from '@/services/ProductService';
import { msg } from '@/lib/msg';
import SuggestProduct from '@/components/common/suggest/SuggestProduct';
import Dropdown from '@/components/common/Dropdown';
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




export default function ProductVariantInformation({ state, setStateValue }: CommonProductStateProps) {
    const [saving, setSaving] = useState(false);
    const [form, setValue] = useForm<{
        product_variant_groups: ProductVariantGroup[],
        product_variants: ProductVariant[]
    }>({
        product_variant_groups: state.product_variant_groups,
        product_variants: state.product_variants
    });

    const save = async () => {
        setSaving(true);
        var r = await ProductService.saveVariantInformation({
            product_id: state.product.id,
            product_variants: form.product_variants,
            product_variant_groups: form.product_variant_groups
        });
        if (r.success) {
            setStateValue('product_variants', 'product_variant_groups')(form.product_variants, form.product_variant_groups);
            msg.success('Variants saved');
        }
        setSaving(false);
    }


    const addVariant = () => {
        setValue('product_variants[]')({
            id: new Date().getTime()
        })
    }




    return (
        <>


            <div className='w-full max-h-[500px]  min-h-[200px] relative overflow-auto '>
                <table className="border-separate border-spacing-0 w-full table-auto ">
                    <thead className="sticky top-0 bg-white z-20">
                        <tr className="bg-white">
                            <TableHeading className='min-w-[150px]' fixed={true}>
                                <HeadingTitle>Variant Group</HeadingTitle>
                            </TableHeading>
                            <TableHeading className='min-w-[150px]'>
                                <HeadingTitle>Product</HeadingTitle>
                            </TableHeading>

                            <TableHeading className='min-w-[150px]'>
                                <HeadingTitle>Label / Value</HeadingTitle>
                            </TableHeading>





                            <TableHeading className='min-w-[50px]' is_last_right={true}>
                                <div className='flex items-center justify-center'>
                                    <LuTrash2 />
                                </div>
                            </TableHeading>
                        </tr>
                    </thead>
                    <tbody>
                        {form.product_variants.map((pv: ProductVariant) => (
                            <tr key={pv.id} className="hover:bg-accent" onClick={() => { }}>
                                <TableCell className='min-w-[150px]' fixed={true} >
                                    {(pv.new_group_mode || form.product_variant_groups.length == 0) && <div className='flex flex-row gap-3'>
                                        <div className='flex-1'>
                                            <TextField value={pv.product_variant_group_name} onChange={setValue(`product_variants[id:${pv.id}].product_variant_group_name`)} placeholder='Enter group name' />
                                        </div>
                                        <Btn disabled={!pv.product_variant_group_name} onClick={() => {
                                            var product_variant_group_id = new Date().getTime();
                                            setValue(
                                                'product_variant_groups[]',
                                                `product_variants[id:${pv.id}].product_variant_group_id`,
                                                `product_variants[id:${pv.id}].product_variant_group_name`,
                                                `product_variants[id:${pv.id}].new_group_mode`
                                            )({
                                                id: product_variant_group_id,
                                                name: pv.product_variant_group_name
                                            },
                                                product_variant_group_id,
                                                '',
                                                false
                                            );
                                        }}>Add Group</Btn>
                                    </div>}
                                    {!pv.new_group_mode && form.product_variant_groups.length > 0 && <Dropdown
                                        searchable={false}
                                        value={pv.product_variant_group_id}
                                        onChange={setValue(`product_variants[id:${pv.id}].product_variant_group_id`)}
                                        children=''
                                        getOptions={async () => form.product_variant_groups}
                                        placeholder='Select a variant group'
                                        footer={() => {
                                            return <Btn onClick={() => setValue(`product_variants[id:${pv.id}].new_group_mode`)(true)} size={'xs'}><LuPlus />Add New Group</Btn>
                                        }}
                                    ></Dropdown>}
                                </TableCell>
                                <TableCell className='min-w-[150px]' >
                                    <SuggestProduct
                                        disabled={!pv.product_variant_group_id}
                                        value={pv.product_id}
                                        onChange={setValue(`product_variants[id:${pv.id}].product_id`)}
                                        children=''
                                        selected={{ id: pv.product_id, name: pv.product_name, image: pv?.media?.media_path }}
                                        exclude_ids={form.product_variants.filter(pvx => pvx.product_variant_group_id == pv.product_variant_group_id).map(pvx => pvx.product_id)}
                                    />
                                </TableCell>

                                <TableCell className='min-w-[150px]' >
                                    <TextField disabled={!pv.product_id || !pv.product_variant_group_id} value={pv.variant_value} onChange={setValue(`product_variants[id:${pv.id}].variant_value`)} placeholder='Enter label / value' />
                                </TableCell>

                                <TableCell className='min-w-[50px]' is_last_right={true} >
                                    <Btn size={'sm'} variant={'outline'} onClick={() => setValue('product_variants')(form.product_variants.filter((pvx: ProductVariant) => pvx.id !== pv.id))}><LuTrash2 /></Btn>
                                </TableCell>
                            </tr>
                        ))}

                    </tbody>
                </table>
                {form.product_variants.length > 0 && <div className='flex flex-row justify-between p-3'>
                    <Btn variant={'outline'} onClick={addVariant}><LuPlus />Add More Variants</Btn>
                    <Btn onClick={save} loading={saving}><LuSave />Save Variants</Btn>
                </div>}
                {form.product_variants.length == 0 && <NoRecords icon={TbSitemap} title='Add Variant' subtitle='Try adding some variants' action={<Btn variant={'outline'} onClick={addVariant}><LuPlus />Add Pricing</Btn>} />}
            </div>
        </>

    );
};

