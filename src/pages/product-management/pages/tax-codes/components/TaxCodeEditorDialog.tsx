
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { TaxCodeService } from '@/services/TaxCodeService';
import SuggestCountry from '@/components/common/suggest/SuggestCountry';
import { TaxComponentService } from '@/services/TaxComponentService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import SuggestState from '@/components/common/suggest/SuggestState';
import { HiArrowTurnRightDown } from "react-icons/hi2";
import { LuCircle, LuCircleCheck, LuPlus, LuTrash2 } from 'react-icons/lu';
import { cn } from '@/lib/utils';
import { TaxModeEnum } from '@/data/Tax';
interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function TaxCodeEditorDialog({ id, onSuccess, onCancel }: Props) {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({
        tax_mode: 0
    });
    const [taxComponents, setTaxComponents] = useState<{
        id: number,
        name: string,
        description: string
    }[]>([])
    const setValue = useSetValue(setForm);

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }

        setLoading(true);


        var r = await TaxCodeService.detail(id);
        if (r.success) {
            setForm(r.data);
            await getTaxComponents();

        }
    }

    const getTaxComponents = async () => {
        var r = await TaxComponentService.all();
        if (r.success) {
            setTaxComponents(r.data);
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await TaxCodeService.update(form);
        } else {
            r = await TaxCodeService.create(form);
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
            getTaxComponents();
        }
    }, [id])


    return (
        <>
            <ModalBody className='relative'>
                {!!loading && <CenterLoading className='absolute z-[50]' />}
                <TextField value={form.name} onChange={setValue('name')} placeholder='Eg. Product Category ' subtitle='Eg. Product category based on  HSN/SAC or any tax category code'>Name</TextField>
                <SuggestCountry value={form.country_id} onChange={setValue('country_id')} />


                <div className="flex flex-col gap-2">
                    {[
                        {
                            id: TaxModeEnum.Single,
                            title: "Single Tax",
                            description: "Same tax for entire country and states",
                        },
                        {
                            id: TaxModeEnum.Double,
                            title: "Dual Tax",
                            description: "Different taxes for states other than seller's",
                        },
                        {
                            id: TaxModeEnum.Multiple,
                            title: "Multi Tax",
                            description: "Each state can have different taxes",
                        },
                    ].map((mode) => (
                        <div
                            key={mode.id}
                            onClick={() => setValue('tax_mode')(mode.id)}
                            className={cn(
                                `border bg-white p-2 rounded-lg flex items-center gap-2 cursor-pointer transition hover:bg-sky-50`,
                                form.tax_mode === mode.id
                                    ? 'bg-sky-50 border-sky-400 text-sky-800'
                                    : 'border-gray-200 text-gray-700'
                            )}
                        >
                            {form.tax_mode === mode.id ? (
                                <LuCircleCheck className="text-lg" />
                            ) : (
                                <LuCircle className="text-lg text-gray-400" />
                            )}
                            <div className="flex flex-col">
                                <span className="font-medium text-sm">{mode.title}</span>
                                <span className="text-xs text-gray-500">{mode.description}</span>
                            </div>
                        </div>
                    ))}
                </div>


                <div className='bg-white rounded-lg border'>
                    {form.tax_mode !== TaxModeEnum.Single && <div className='flex flex-col gap-1 px-3 pt-3'>
                        {form.tax_mode == TaxModeEnum.Double && <span className='text-gray-600 text-sm font-medium flex'>Seller's State Tax</span>}
                        {form.tax_mode == TaxModeEnum.Multiple && <span className='text-gray-600 text-sm font-medium flex'>Common Tax</span>}
                    </div>}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tax</TableHead>
                                <TableHead>Percentage %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {taxComponents.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell className='py-0 font-medium'>
                                        <label className='flex flex-1 gap-2 items-center'>
                                            <Checkbox checked={!!form?.common_taxes?.find?.((tx: any) => tx.tax_component_id == t.id)}
                                                onCheckedChange={checked => setValue(`common_taxes`)(checked ? [...(form?.common_taxes ?? []), {
                                                    id: new Date().getTime(),
                                                    tax_component_id: t.id,
                                                    percentage: '',
                                                    checked: true
                                                }] : form?.common_taxes?.filter?.((tx: any) => tx.tax_component_id !== t.id))} />
                                            <span>{t.name}</span>
                                        </label>
                                    </TableCell>
                                    <TableCell className='p-0'>
                                        <input
                                            disabled={!form?.common_taxes?.find?.((tx: any) => tx.tax_component_id == t.id)}
                                            value={form?.common_taxes?.find?.((tx: any) => tx.tax_component_id == t.id)?.percentage}
                                            onChange={e => setValue(`common_taxes[tax_component_id:${t.id}].percentage`)(e.target.value)}
                                            type='number'
                                            placeholder='Enter %'
                                            className='p-1 border-s w-full disabled:bg-gray-100 disabled:cursor-not-allowed'
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>


                {form.tax_mode == TaxModeEnum.Double && <div className='bg-white rounded-lg border'>
                    <div className='flex flex-col gap-1 px-3 pt-3'>
                        <span className='text-gray-600 text-sm font-medium flex'>Other States Tax</span>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tax</TableHead>
                                <TableHead>Percentage %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {taxComponents.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell className='py-0 font-medium'>
                                        <label className='flex flex-1 gap-2 items-center'>
                                            <Checkbox checked={!!form?.other_taxes?.find?.((tx: any) => tx.tax_component_id == t.id)}
                                                onCheckedChange={checked => setValue(`other_taxes`)(checked ? [...(form?.other_taxes ?? []), {
                                                    id: new Date().getTime(),
                                                    tax_component_id: t.id,
                                                    percentage: '',
                                                    checked: true
                                                }] : form?.other_taxes?.filter?.((tx: any) => tx.tax_component_id !== t.id))} />
                                            <span>{t.name}</span>
                                        </label>
                                    </TableCell>
                                    <TableCell className='p-0'>
                                        <input
                                            disabled={!form?.other_taxes?.find?.((tx: any) => tx.tax_component_id == t.id)}
                                            value={form?.other_taxes?.find?.((tx: any) => tx.tax_component_id == t.id)?.percentage}
                                            onChange={e => setValue(`other_taxes[tax_component_id:${t.id}].percentage`)(e.target.value)}
                                            type='number'
                                            placeholder='Enter %'
                                            className='p-1 border-s w-full disabled:bg-gray-100 disabled:cursor-not-allowed'
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>}
                {form.tax_mode == TaxModeEnum.Multiple && (form.state_taxes ?? []).length > 0 && <span className='flex flex-row items-center gap-1 font-medium text-gray-500 uppercase'>Specific state taxes <HiArrowTurnRightDown className='text-2xl' /></span>}
                {form.tax_mode == TaxModeEnum.Multiple && (form.state_taxes ?? []).map((st: any, st_i: number) => {
                    return <div className='bg-white rounded-lg border'>
                        <div className='p-3 flex flex-row gap-3 items-center'>
                            <span className=' bg-primary rounded-full px-2 font-bold text-sm   text-white uppercase'>State {st_i + 1}</span>
                            <div className='flex-1'>
                                <SuggestState
                                    exclude_ids={(form.state_taxes ?? []).map((stx: any) => stx.state_id).filter(Boolean)}
                                    country_id={form.country_id}
                                    disabled={!form.country_id}
                                    value={st?.state_id}
                                    onChange={setValue(`state_taxes[id:${st.id}].state_id`)}
                                    selected={{ id: st?.state_id, name: st?.state_name }}
                                    children=''

                                />
                            </div>
                            <Btn variant={'outline'} onClick={() => setValue('state_taxes')((form.state_taxes ?? []).filter((s: any) => s.id !== st.id))}><LuTrash2 /></Btn>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tax</TableHead>
                                    <TableHead>Percentage %</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {taxComponents.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell className='py-0'>

                                            <label className='flex flex-1 gap-2 items-center'>
                                                <Checkbox checked={!!st?.components?.find?.((c: any) => c.tax_component_id == t.id)}
                                                    onCheckedChange={checked => setValue(`state_taxes[id:${st.id}].components`)(checked ? [...st.components, {
                                                        id: new Date().getTime(),
                                                        tax_component_id: t.id,
                                                        percentage: 0,
                                                        checked: true
                                                    }] : st.components.filter((c: any) => c.filter(c.tax_component_id !== t.id)))} />
                                                <span>{t.name}</span>
                                            </label>
                                        </TableCell>
                                        <TableCell className='p-0'>
                                            <input
                                                disabled={!st?.components?.find?.((c: any) => c.tax_component_id == t.id)}
                                                className='p-1 border-s w-full disabled:bg-gray-100 disabled:cursor-not-allowed'
                                                type='number'
                                                value={st?.components?.find?.((c: any) => c.tax_component_id == t.id)?.percentage}
                                                onChange={e => setValue(`state_taxes[id:${st.id}].components[tax_component_id:${t.id}].percentage`)(e.target.value)}
                                                placeholder='Enter %' />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                })}
                <div>
                    {form.tax_mode == TaxModeEnum.Multiple && <Btn variant={'outline'} size={'sm'} onClick={() => {
                        setValue('state_taxes[]')({
                            id: new Date().getTime(),
                            state_id: undefined,
                            components: []
                        })
                    }}><LuPlus />Add Specific State Tax</Btn>}
                </div>




            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

