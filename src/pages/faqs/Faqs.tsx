import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuGripVertical, LuX } from "react-icons/lu";
import AppPage from "@/components/app/AppPage";
import Btn from "@/components/common/Btn";
import { FaqService } from "@/services/FaqService";
import { msg } from "@/lib/msg";
import CenterLoading from "@/components/common/CenterLoading";
import { useForm } from "@/hooks/use-form";

interface Faq {
    id: number;
    question: string;
    answer: string;
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
function SortableItem({ feature, onRemove, onUpdate }: { feature: Faq; onRemove: (id: number) => void, onUpdate: (faq: Faq) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: feature.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [form, setValue] = useForm(feature);

    useEffect(() => {
        onUpdate(form);
    }, [form]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 border p-2 rounded-lg bg-white shadow-sm"
        >
            {/* DRAG HANDLE ONLY */}
            <LuGripVertical
                className="text-gray-500 cursor-grab text-sm"
                {...attributes}
                {...listeners}
            />

            <div className="flex flex-col flex-1 gap-3">
                {/* Prevent drag when editing */}
                <input
                    data-no-dnd="true"
                    className="border rounded-sm p-2 font-medium"
                    placeholder="Enter question"
                    value={form.question}
                    onChange={e => setValue('question')(e.target.value)}
                />
                <textarea
                    data-no-dnd="true"
                    className="border rounded-sm p-2 text-sm"
                    placeholder="Enter Answer"
                    value={form.answer}
                    onChange={e => setValue('answer')(e.target.value)}
                />
            </div>

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

export default function Faqs() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [value, setValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const save = async () => {
        setSaving(true);
        var r = await FaqService.save({ faqs });
        if (r.success) {
            msg.success('Details saved');
        }
        setSaving(false);
    }

    const load = async () => {
        setLoading(true);
        var r = await FaqService.load();
        if (r.success) {
            setFaqs(r.data);
        }
        setLoading(false);
    }

    const sensors = useSensors(
        useSensor(CustomPointerSensor)
    );

    const addFeature = () => {
        if (!value.trim()) return;
        const newFeature: Faq = {
            id: new Date().getTime(),
            question: value.trim(),
            answer: '',
            sort_order: faqs.length,
            uuid: `${new Date().getTime()}${(Math.random() * 1000).toFixed(2)}`
        };
        setFaqs([...faqs, newFeature]);
        setValue("");
    };

    const removeFeature = (id: number) => {
        setFaqs(faqs.filter((f) => f.id !== id));
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = faqs.findIndex(f => f.id === active.id);
        const newIndex = faqs.findIndex(f => f.id === over.id);
        const updated = arrayMove(faqs, oldIndex, newIndex).map((f, i) => ({
            ...f,
            sort_order: i
        }));

        setFaqs(updated);
    };



    useEffect(() => {
        load();
    }, []);




    return (
        <AppPage
            title="FAQ - Frequenty Asked Questions"
            subtitle="Manage faqs which will help customers resolve their quries quickly."
            actions={<Btn onClick={save} loading={saving}>Save Changes</Btn>}
        >
            {loading && <CenterLoading className="relative h-[400px]" />}
            {!loading && <div className="space-y-3   bg-white rounded-xl shadow-md p-3">
                <input
                    className="border p-1 w-full rounded"
                    placeholder="Type feature and press Enter"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addFeature()}
                />

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={faqs.sort((a, b) => a.sort_order - b.sort_order).map(f => f.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {faqs.map((f) => (
                                <SortableItem key={f.id} feature={f} onRemove={removeFeature} onUpdate={(faq) => {
                                    setFaqs(fq => fq.map(fx => fx.uuid == faq.uuid ? { ...fx, ...faq } : fx));
                                }} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>}
        </AppPage>
    );
}