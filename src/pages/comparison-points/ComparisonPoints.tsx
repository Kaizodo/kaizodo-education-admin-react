import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuGripVertical, LuX } from "react-icons/lu";
import AppPage from "@/components/app/AppPage";
import Btn from "@/components/common/Btn";
import { ComparisonPointService } from "@/services/ComparisonPointService";
import { msg } from "@/lib/msg";
import CenterLoading from "@/components/common/CenterLoading";

interface ComparisonPoint {
    id: number;
    name: string;
    sort_order: number;
    uuid: string
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

function SortableItem({ feature, onRemove }: { feature: ComparisonPoint; onRemove: (id: number) => void }) {
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
            <span className="flex-1 text-xs">{feature.name}</span>
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

export default function ComparisonPoints() {
    const [points, setPoints] = useState<ComparisonPoint[]>([]);
    const [value, setValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const save = async () => {
        setSaving(true);
        var r = await ComparisonPointService.save({ points });
        if (r.success) {
            msg.success('Details saved');
        }
        setSaving(false);
    }

    const load = async () => {
        setLoading(true);
        var r = await ComparisonPointService.load();
        if (r.success) {
            setPoints(r.data);
        }
        setLoading(false);
    }

    const sensors = useSensors(
        useSensor(CustomPointerSensor)
    );

    const addFeature = () => {
        if (!value.trim()) return;
        const newFeature: ComparisonPoint = {
            id: new Date().getTime(),
            name: value.trim(),
            sort_order: points.length,
            uuid: `${new Date().getTime()}${(Math.random() * 1000).toFixed(2)}`
        };
        setPoints([...points, newFeature]);
        setValue("");
    };

    const removeFeature = (id: number) => {
        setPoints(points.filter((f) => f.id !== id));
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = points.findIndex(f => f.id === active.id);
        const newIndex = points.findIndex(f => f.id === over.id);
        const updated = arrayMove(points, oldIndex, newIndex).map((f, i) => ({
            ...f,
            sort_order: i
        }));

        setPoints(updated);
    };



    useEffect(() => {
        load();
    }, []);




    return (
        <AppPage
            title="Comparison Points"
            subtitle="Manage comparison points which will help customers choose correct plan."
            actions={<Btn onClick={save} loading={saving}>Save Changes</Btn>}
        >
            {loading && <CenterLoading className="relative h-[400px]" />}
            {!loading && <div className="space-y-3 max-w-2xl   bg-white rounded-xl shadow-md p-3">
                <input
                    className="border p-1 w-full rounded"
                    placeholder="Type feature and press Enter"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addFeature()}
                />

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={points.sort((a, b) => a.sort_order - b.sort_order).map(f => f.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {points.map((f) => (
                                <SortableItem key={f.id} feature={f} onRemove={removeFeature} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>}
        </AppPage>
    );
}