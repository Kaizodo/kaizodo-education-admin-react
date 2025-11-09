import React, { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

type UniqueID = string | number;

interface SortableItemProps {
    id: UniqueID;
    children: ReactNode | ((props: { listeners: SyntheticListenerMap | undefined }) => ReactNode);
}

export default function SortableItem({ id, children }: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            {typeof children === "function"
                ? children({ listeners })
                : children}
        </div>
    );
}
