import { useState, ReactNode, ImgHTMLAttributes, useEffect } from "react";

type SafeImageProps = {
    src?: string | null;
    className?: string;
    children: ReactNode;
    onChangeStatus?: (success: boolean) => void
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "className" | "children">;

export default function SafeImage({
    src,
    onChangeStatus,
    className = "",
    children,
    ...rest
}: SafeImageProps) {
    const [err, setErr] = useState(false);


    useEffect(() => {
        if (!src) {
            onChangeStatus?.(false);
            setErr(true);
        } else {
            onChangeStatus?.(true);
            setErr(false);
        }
    }, [src]);

    if (err)
        return <div className={className}>{children}</div>;

    return (
        <img
            src={src || ""}
            className={className}
            onError={() => {
                setErr(true);
                onChangeStatus?.(false)
            }}
            alt=""
            {...rest}
        />
    );
}
