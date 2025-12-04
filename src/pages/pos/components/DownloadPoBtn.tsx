import Btn from "@/components/common/Btn";
import { msg } from "@/lib/msg";
import { PosService } from "@/services/PosService";
import { useState } from "react";
import { LuDownload } from "react-icons/lu";

type Props = {
    title?: string,
    organization_id: number,
    internal_reference_number: string
};
export default function DownloadPoBtn({ organization_id, internal_reference_number, title = 'Download PO' }: Props) {
    const [downloading, setDownloading] = useState(false);

    const download = async () => {
        setDownloading(true);
        try {
            var blob: any = await PosService.download({ internal_reference_number, organization_id });
            console.log(blob);
            if (!(blob instanceof Blob)) {
                msg.error('Unable to export')
                setDownloading(false);
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
        setDownloading(false);
    }

    return (<Btn onClick={download} loading={downloading} size={'sm'}><LuDownload />{title}</Btn>)
}
