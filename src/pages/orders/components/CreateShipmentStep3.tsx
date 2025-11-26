import { useModal } from '@/components/common/Modal'
import Radio from '@/components/common/Radio';

import { useEffect } from 'react'
import ShippingLabelPreview from './ShippingLabelPreview';
import Dropdown from '@/components/common/Dropdown';

export default function CreateShipmentStep3({ form, setValue }) {
    const { update } = useModal();

    useEffect(() => {
        update({
            maxWidth: 1200
        })
        return () => update({
            maxWidth: 600
        })
    }, [])

    return (<div className="space-y-8">
        <div className='p-3 rounded-lg bg-white shadow border grid grid-cols-3'>
            <Radio
                value={form.print_type}
                onChange={setValue('print_type')}
                options={[
                    { id: 'thermal', name: 'Thermal Print' },
                    { id: 'normal', name: 'Normal A4 size' }
                ]}>Print Type</Radio>
            {form.print_type !== 'thermal' && <>
                <Radio
                    value={form.print_orientation}
                    onChange={setValue('print_orientation')}
                    options={[
                        { id: 'landscape', name: 'Landscape' },
                        { id: 'portrait', name: 'Portrait' }
                    ]}>Print Orientation</Radio>
                <div className='grid grid-cols-2 gap-3'>
                    <Dropdown searchable={false} placeholder='Stacking count' value={form.labels_high} onChange={setValue('labels_high')} getOptions={async () => [
                        { id: 1, name: '1 Label' },
                        { id: 2, name: '2 Labels' },
                        { id: 3, name: '3 Labels' },
                        { id: 4, name: '4 Labels' },
                        { id: 5, name: '5 Labels' }
                    ]}>Labels High</Dropdown>
                    <Dropdown searchable={false} placeholder='Stacking count' value={form.labels_wide} onChange={setValue('labels_wide')} getOptions={async () => [
                        { id: 1, name: '1 Label' },
                        { id: 2, name: '2 Labels' },
                        { id: 3, name: '3 Labels' },
                        { id: 4, name: '4 Labels' },
                        { id: 5, name: '5 Labels' }
                    ]}>Labels Wide</Dropdown>
                </div>
            </>}
        </div>
        <ShippingLabelPreview form={form} setValue={setValue} />
    </div>)
}
