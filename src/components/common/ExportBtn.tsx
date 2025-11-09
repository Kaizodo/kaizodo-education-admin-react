import { RiFileExcel2Fill } from "react-icons/ri";
import Btn from "./Btn";
import { ReactNode, useState } from "react";
import { msg } from "@/lib/msg";
type Props = {
    onClick: () => Promise<Blob>,
    fileName: string,
    className?: string,
    size?: "default" | "xs" | "sm" | "lg" | "icon" | null | undefined,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined,
    children?: ReactNode
}
export default function ExportBtn({ fileName, className = 'me-6', onClick, size = 'sm', variant, children = <><RiFileExcel2Fill />Export</> }: Props) {
    const [downloading, setDownloading] = useState(false);

    const download = async () => {
        setDownloading(true);
        try {
            var blob = await onClick();
            const a = document.createElement('a');
            const blobUrl = window.URL.createObjectURL(blob);
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            msg.error('Unable to export report');
        }
        setDownloading(false);
    }
    return (
        <div className={className}>
            <Btn size={size} variant={variant} onClick={download} loading={downloading}>{children}</Btn>
        </div>
    )
}
