import Btn from '@/components/common/Btn'
import { msg } from '@/lib/msg';
import { UserOrderService } from '@/services/UserOrderService';
import { useState } from 'react'
import { LuDownload } from 'react-icons/lu'

export default function DownloadListBtn({ internal_reference_number, organization_id }: { internal_reference_number: string, organization_id: number }) {
    const [downloading, setDownloading] = useState(false);

    const download = async () => {
        setDownloading(true);
        try {
            var blob: any = await UserOrderService.downloadList({ internal_reference_number, organization_id });
            if (!(blob instanceof Blob)) {
                msg.warning('Unable to download');
                setDownloading(false);
            }
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

    return (<Btn onClick={download} loading={downloading} size={'sm'}><LuDownload />Download List</Btn>)
}
