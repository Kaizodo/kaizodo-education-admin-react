import { ModalBody, ModalFooter, useModal } from '@/components/common/Modal'
import Radio from '@/components/common/Radio';

import { useEffect, useRef, useState } from 'react'
import Dropdown from '@/components/common/Dropdown';
import { useForm } from '@/hooks/use-form';
import CenterLoading from '@/components/common/CenterLoading';
import Btn from '@/components/common/Btn';
import { Download } from 'lucide-react';
import { UserOrderService } from '@/services/UserOrderService';
import { msg } from '@/lib/msg';
import NoRecords from '@/components/common/NoRecords';
import { BiError } from 'react-icons/bi';

export default function ShippingLabelPrintDialog({ internal_reference_number }: { internal_reference_number: string }) {
    const [form, setValue] = useForm<any>({
        internal_reference_number,
        print_type: 'normal',
        print_orientation: 'landscape',
        labels_high: 2,
        labels_wide: 2
    });
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [printing, setPrinting] = useState(true);
    const [iframeUrl, setIframeUrl] = useState<string>();
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(false);


    const download = async () => {
        setDownloading(true);
        try {
            var blob: any = await UserOrderService.printLables(form);
            const a = document.createElement('a');
            const blobUrl = window.URL.createObjectURL(blob);
            a.href = blobUrl;
            a.download = `${internal_reference_number}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            msg.error('Unable to export report');
        }
        setDownloading(false);
    }

    const loadPrintPreview = async () => {
        setPrinting(true);
        var blob: any = await UserOrderService.printLables(form);
        if (!(blob instanceof Blob)) {
            setError(true);
        } else {
            setError(false);
            const url = URL.createObjectURL(blob);
            setIframeUrl(url);
        }
        setPrinting(false);
    }

    useEffect(() => {
        loadPrintPreview();
    }, [form]);

    const { update } = useModal();

    useEffect(() => {
        update({
            maxWidth: 1200
        })
        return () => update({
            maxWidth: 600
        })
    }, [])

    return (<>
        <ModalBody className='p-0 space-y-0 gap-0'>
            <div className=' bg-white p-3  border-b grid grid-cols-3'>
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
                        <Dropdown showClearBtn={false} searchable={false} placeholder='Stacking count' value={form.labels_high} onChange={setValue('labels_high')} getOptions={async () => [
                            { id: 1, name: '1 Label' },
                            { id: 2, name: '2 Labels' },
                            { id: 3, name: '3 Labels' },
                            { id: 4, name: '4 Labels' },
                            { id: 5, name: '5 Labels' }
                        ]}>Labels High</Dropdown>
                        <Dropdown showClearBtn={false} searchable={false} placeholder='Stacking count' value={form.labels_wide} onChange={setValue('labels_wide')} getOptions={async () => [
                            { id: 1, name: '1 Label' },
                            { id: 2, name: '2 Labels' },
                            { id: 3, name: '3 Labels' },
                            { id: 4, name: '4 Labels' },
                            { id: 5, name: '5 Labels' }
                        ]}>Labels Wide</Dropdown>
                    </div>
                </>}
            </div>
            {printing && <CenterLoading className='relative h-[80vh]' />}
            {error && <NoRecords icon={BiError} title='Unable to generate labels' subtitle='Try adjusting item and print settings' />}
            {!printing && !error && !!iframeRef && <iframe ref={iframeRef} src={iframeUrl} className='w-full h-screen' />}
        </ModalBody>
        <ModalFooter>
            <Btn disabled={error || printing || !iframeRef} size={'sm'} variant={'destructive'} onClick={download} loading={downloading}>  <Download />Download</Btn>
        </ModalFooter>
    </>)
}
