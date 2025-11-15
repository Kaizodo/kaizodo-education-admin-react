import { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuGripVertical, LuPlus, LuSave, LuX } from "react-icons/lu";
import { type SetValueType } from "@/hooks/use-set-value";
import NoRecords from "@/components/common/NoRecords";
import { PiListStar } from "react-icons/pi";
import Btn from "@/components/common/Btn";
import { ProductService } from "@/services/ProductService";
import { msg } from "@/lib/msg";
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

export default function HighlightInput({ features, setValue, product_id }: { features: Feature[], setValue: SetValueType, product_id: number }) {
    const [saving, setSaving] = useState(false);
    const [text, setText] = useState("");

    const sensors = useSensors(
        useSensor(CustomPointerSensor)
    );

    const save = async () => {
        setSaving(true);
        var r = await ProductService.saveFeaturesInformation({
            product_id,
            features: features
        });

        if (r.success) {
            msg.success('Features saved!');
        }
        setSaving(false);
    }

    const addFeature = () => {
        if (!text.trim()) return;
        const newFeature: Feature = {
            id: crypto.randomUUID(),
            text: text.trim(),
        };
        setValue('product.features')([...features, newFeature]);
        setText("");
    };

    const removeFeature = (id: string) => {
        setValue('product.features')(features.filter((f) => f.id !== id));
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = features.findIndex((f) => f.id === active.id);
            const newIndex = features.findIndex((f) => f.id === over.id);
            setValue('product.features')(arrayMove(features, oldIndex, newIndex));
        }
    };




    return (
        <div className="space-y-3">
            <div className="flex flex-row gap-3">
                <input
                    className="border border-primary  p-2 w-full rounded"
                    placeholder="Type feature and press Enter"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addFeature()}
                />
                <Btn disabled={!text} onClick={addFeature}><LuPlus />Add Feature</Btn>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={features.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {features.map((f) => (
                            <SortableItem key={f.id} feature={f} onRemove={removeFeature} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            {features.length == 0 && <NoRecords icon={PiListStar} title="Add Some Features" subtitle="Try adding some features" />}
            {features.length > 0 && <div className="flex flex-row justify-end">
                <Btn onClick={save} loading={saving}><LuSave />Save Features</Btn>
            </div>}
        </div>
    );
}