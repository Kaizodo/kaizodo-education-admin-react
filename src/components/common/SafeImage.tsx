import { useState, ReactNode, ImgHTMLAttributes, useEffect } from "react";

type SafeImageProps = {
    src?: string | null;
    className?: string;
    children: ReactNode;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "className" | "children">;

export default function SafeImage({
    src,
    className = "",
    children,
    ...rest
}: SafeImageProps) {
    const [err, setErr] = useState(false);

    // handle empty src
    useEffect(() => {
        if (!src) {
            setErr(true);
        } else {
            setErr(false);
        }
    }, [src]);

    if (err)
        return <div className={className}>{children}</div>;

    return (
        <img
            src={src || ""}
            className={className}
            onError={() => setErr(true)}
            alt=""
            {...rest}
        />
    );
}
