import { X } from "lucide-react";

export default function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span onClick={onRemove} className="cursor-pointer flex items-center  gap-2 px-3 py-1 bg-white border text-sm rounded-full">
            {label}
            <X size={14} />
        </span>
    );
}
