import Btn from '@/components/common/Btn';
import NoRecords from '@/components/common/NoRecords';
import { CommonProductStateProps, ProductWarrantyServiceType, ProductWarrantyServiceTypeArray, ProductWarrantyStartType, ProductWarrantyStartTypeArray, ProductWarrantyType, ProductWarrantyTypeArray } from '@/data/Product'
import { msg } from '@/lib/msg';
import { ProductService } from '@/services/ProductService';
import { useState } from 'react';
import { LuBadgeX, LuPlus, LuSave } from 'react-icons/lu';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Dropdown from '@/components/common/Dropdown';
import { Textarea } from '@/components/ui/textarea';






export default function ProductWarrantyInformation({ state, setStateValue }: CommonProductStateProps) {
    const [saving, setSaving] = useState(false);
    const save = async () => {
        setSaving(true);
        const r = await ProductService.saveWarrantyInformation({
            product_id: state.product.id,
            product_warranties: state.product_warranties
        });
        if (r.success) {
            msg.success('Details saved!');
        }
        setSaving(false);
    }


    const addRow = () => {
        setStateValue('product_warranties[]')({
            id: new Date().getTime(),
            product_id: state.product.id,
            name: "",
            duration_days: 0,
            coverage: "",
            warranty_type: ProductWarrantyType.Manufacturer,
            service_type: ProductWarrantyServiceType.OnSite,
            start_type: ProductWarrantyStartType.InvoiceDate,
        })
    }




    return (
        <>

            <div className="space-y-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Part / Name</TableHead>
                            <TableHead>Duration(Days)</TableHead>
                            <TableHead>Coverage</TableHead>
                            <TableHead>Warranty Type</TableHead>
                            <TableHead>Service Type</TableHead>
                            <TableHead>Warranty Start</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {state.product_warranties.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>
                                    <Input value={r.name} onChange={(e) => setStateValue(`product_warranties[id:${r.id}].name`)(e.target.value)} />
                                </TableCell>

                                <TableCell>
                                    <Input value={r.duration_days} onChange={(e) => setStateValue(`product_warranties[id:${r.id}].duration_days`)(e.target.value)} />
                                </TableCell>

                                <TableCell>
                                    <Textarea value={r.coverage} onChange={(e) => setStateValue(`product_warranties[id:${r.id}].coverage`)(e.target.value)} />
                                </TableCell>

                                {/* Warranty Type */}
                                <TableCell>
                                    <Dropdown
                                        searchable={false}
                                        getOptions={async () => ProductWarrantyTypeArray}
                                        children=''
                                        placeholder='Select type'
                                        value={r.warranty_type}
                                        onChange={setStateValue(`product_warranties[id:${r.id}].warranty_type`)}
                                    />

                                </TableCell>

                                {/* Service Type */}
                                <TableCell>
                                    <Dropdown
                                        searchable={false}
                                        getOptions={async () => ProductWarrantyServiceTypeArray}
                                        children=''
                                        placeholder='Select type'
                                        value={r.service_type}
                                        onChange={setStateValue(`product_warranties[id:${r.id}].service_type`)}
                                    />
                                </TableCell>

                                {/* Start Type */}
                                <TableCell>
                                    <Dropdown
                                        searchable={false}
                                        getOptions={async () => ProductWarrantyStartTypeArray}
                                        children=''
                                        placeholder='Select type'
                                        value={r.start_type}
                                        onChange={setStateValue(`product_warranties[id:${r.id}].start_type`)}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Button variant="destructive" onClick={() => setStateValue(`product_warranties[id:${r.id}]-`)()}>
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {!state.product_warranties.length && <NoRecords
                icon={LuBadgeX}
                title="No Warranty"
                subtitle="No Warranty will be provided in this product"
            />}

            {!!state.product_warranties && <div className='sticky bottom-0  px-3 pb-3'>
                <div className='flex flex-row justify-between w-full  bg-white rounded-lg p-2 shadow-lg border'>
                    <Btn variant={'outline'} onClick={addRow}><LuPlus />Add Warranty</Btn>
                    <div className="items-center gap-3 flex ">
                        <span className="text-xs text-gray-500">Save warranty information</span>
                        <Btn loading={saving} onClick={save}><LuSave /> Save Warranty</Btn>
                    </div>
                </div>
            </div>}


        </>
    )
}
