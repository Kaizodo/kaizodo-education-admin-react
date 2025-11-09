import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableItem = ({ children }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: children.key });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2 p-2 border rounded cursor-move">
            {children}
        </div>
    );
};
