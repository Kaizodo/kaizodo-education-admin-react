import Btn from '@/components/common/Btn'
import { msg } from '@/lib/msg';
import { UserOrderService } from '@/services/UserOrderService';
import { LuDownload } from 'react-icons/lu'

export const downloadInvoice = async ({ internal_reference_number, additional_data = {} }: { internal_reference_number: string, additional_data?: any }) => {
    try {
        var blob: any = await UserOrderService.invoice(internal_reference_number, additional_data);
        console.log(blob);
        if (!(blob instanceof Blob)) {
            msg.error('Unable to export')
            return;
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
        msg.error('Unable to export invoice');
    }
}

export default function DownloadInvoiceBtn({ internal_reference_number, title = 'Invoice', additional_data = {} }: { internal_reference_number: string, title?: string, additional_data?: any }) {

    return (<Btn asyncClick={() => downloadInvoice({ internal_reference_number, additional_data })} size={'sm'}><LuDownload />{title}</Btn>)
}
