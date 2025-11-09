import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { useState, useCallback, useRef, ChangeEvent, DragEvent } from "react";
import { Label } from "../ui/label";
import { LucideUploadCloud } from "lucide-react";

interface FileDropProps {
    children?: React.ReactNode;
    onChange: (files: File[]) => void;
    accept?: ("image" | "video" | "document")[];
    className?: ClassValue;
    title?: string;
    subtitle?: string;
    size?: 'sm' | 'lg'
}

const typeMap: Record<string, string[]> = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    video: ["video/mp4", "video/webm", "video/ogg"],
    document: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
};

export default function FileDrop({ children, onChange, accept = [], className, title = 'Drop files here or click to browse', subtitle, size = 'lg' }: FileDropProps) {
    const [highlight, setHighlight] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const allowedTypes = accept.flatMap(type => typeMap[type] || []);

    const handleFiles = useCallback(
        (files: FileList) => {
            const validFiles = Array.from(files).filter((file) => {
                if (allowedTypes.length === 0) return true;
                return allowedTypes.includes(file.type);
            });
            if (validFiles.length) onChange(validFiles);
        },
        [onChange, allowedTypes]
    );

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setHighlight(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleBrowse = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
            e.target.value = ''; // reset input so same file can be re-selected
        }
    };

    return (
        <div className="space-y-2">
            {!!children && <Label className="mb-2">{children}</Label>}
            <div
                className={cn(
                    `bg-white border-4 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex items-center justify-center ${highlight ? "border-blue-500 bg-blue-50" : "border-gray-300"}`,
                    className,
                    size == 'sm' && 'p-2'
                )}
                onDragOver={(e) => {
                    e.preventDefault();
                    setHighlight(true);
                }}
                onDragLeave={() => setHighlight(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >


                <input
                    type="file"
                    className="hidden"
                    multiple={false}
                    ref={inputRef}
                    accept={allowedTypes.join(",")}
                    onChange={handleBrowse}
                />
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center text-center cursor-pointer">
                    <LucideUploadCloud className="w-12 h-12 text-indigo-500 mb-3" />
                    <p className="text-lg font-semibold text-gray-700">
                        {title} Drag & Drop your Image or Video here
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        or <span className="text-indigo-600 font-medium hover:text-indigo-700">click to browse</span>.
                    </p>

                    {!!subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                </label>



            </div>
        </div>
    );
}
