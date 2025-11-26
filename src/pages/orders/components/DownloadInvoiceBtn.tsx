import Btn from '@/components/common/Btn'
import { msg } from '@/lib/msg';
import { UserOrderService } from '@/services/UserOrderService';
import { useState } from 'react'
import { LuDownload } from 'react-icons/lu'

export default function DownloadInvoiceBtn({ internal_reference_number }: { internal_reference_number: string }) {
    const [downloading, setDownloading] = useState(false);

    const download = async () => {
        setDownloading(true);
        try {
            var blob: any = await UserOrderService.invoice(internal_reference_number);
            const a = document.createElement('a');
            const blobUrl = window.URL.createObjectURL(blob);
            a.href = blobUrl;
            a.download = `${internal_reference_number}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            msg.error('Unable to export report');
        }
        setDownloading(false);
    }

    return (<Btn onClick={download} loading={downloading} size={'sm'}><LuDownload />Invoice</Btn>)
}
