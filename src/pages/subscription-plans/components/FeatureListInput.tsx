import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuGripVertical, LuX } from "react-icons/lu";

interface Feature {
    id: string;
    text: string;
}

function shouldHandleEvent(element: HTMLElement | null): boolean {
    let cur = element;
    while (cur) {
        if (cur.dataset && cur.dataset.noDnd) {
            return false;
        }
        cur = cur.parentElement;
    }
    return true;
}

class CustomPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: 'onPointerDown' as const,
            handler: ({ nativeEvent: event }: any) => {
                return shouldHandleEvent(event.target as HTMLElement);
            },
        },
    ];
}

function SortableItem({ feature, onRemove }: { feature: Feature; onRemove: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: feature.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 border p-2 rounded-lg bg-white shadow-sm"
            {...attributes}
            {...listeners}
        >
            <LuGripVertical className="text-gray-500 cursor-grab text-sm" />
            <span className="flex-1 text-xs">{feature.text}</span>
            <button
                type="button"
                data-no-dnd="true"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(feature.id);
                }}
            >
                <LuX className="w-4 h-4" />
            </button>
        </div>
    );
}

export default function FeatureListInput({ providedFeatures, onUpdate }: { providedFeatures: Feature[], onUpdate?: (features: Feature[]) => void }) {
    const [features, setFeatures] = useState<Feature[]>(providedFeatures);
    const [value, setValue] = useState("");

    const sensors = useSensors(
        useSensor(CustomPointerSensor)
    );

    const addFeature = () => {
        if (!value.trim()) return;
        const newFeature: Feature = {
            id: crypto.randomUUID(),
            text: value.trim(),
        };
        setFeatures([...features, newFeature]);
        setValue("");
    };

    const removeFeature = (id: string) => {
        setFeatures(features.filter((f) => f.id !== id));
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = features.findIndex((f) => f.id === active.id);
            const newIndex = features.findIndex((f) => f.id === over.id);
            setFeatures(arrayMove(features, oldIndex, newIndex));
        }
    };


    useEffect(() => {
        if (onUpdate) {
            onUpdate(features);
        }
    }, [features, onUpdate]);

    return (
        <div className="space-y-3">
            <input
                className="border p-1 w-full rounded"
                placeholder="Type feature and press Enter"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFeature()}
            />

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={features.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {features.map((f) => (
                            <SortableItem key={f.id} feature={f} onRemove={removeFeature} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}