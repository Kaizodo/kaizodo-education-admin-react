import AppPage from "@/components/app/AppPage";
import Btn from "@/components/common/Btn";
import { useState, useCallback, useEffect } from "react";

import {
    DndContext,
    closestCenter,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SettingService } from "@/services/SettingService";
import { msg } from "@/lib/msg";
import CenterLoading from "@/components/common/CenterLoading";

const SortableLink = ({ link, colId, updateLabel, updateTarget }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: link.id,
        data: { type: "link", colId: colId },
        transition: {
            duration: 250,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-2 p-2 border rounded bg-gray-50">
            <div className="flex items-center gap-2">
                <div {...attributes} {...listeners} className="cursor-grab px-2 py-1 bg-gray-300 rounded text-sm">⇅</div>
                <input
                    className="w-full border p-1"
                    value={link.label}
                    onChange={e => updateLabel(e.target.value)}
                />
            </div>

            <input
                className="border p-1 w-full mt-1"
                value={link.target}
                onChange={e => updateTarget(e.target.value)}
            />
        </div>
    );
};

const SortableColumn = ({ col, updateTitle, addLinkToCol, updateLinkLabel, updateLinkTarget }: any) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: col.id,
        data: { type: "column" },
        transition: {
            duration: 250,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="border p-3 rounded bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <div {...attributes} {...listeners} className="cursor-grab px-2 py-1 bg-gray-200 rounded">↕</div>
                <input
                    className="border p-1 w-full"
                    value={col.title}
                    onChange={e => updateTitle(e.target.value)}
                />
            </div>

            <SortableContext items={col.links.map((x: any) => x.id)} strategy={verticalListSortingStrategy}>
                {col.links.map((link: any) => (
                    <SortableLink
                        key={link.id}
                        link={link}
                        colId={col.id}
                        updateLabel={(label: string) => updateLinkLabel(col.id, link.id, label)}
                        updateTarget={(target: string) => updateLinkTarget(col.id, link.id, target)}
                    />
                ))}
            </SortableContext>

            <Btn size="xs" variant="outline" className="mt-2" onClick={addLinkToCol}>Add Link</Btn>
        </div>
    );
};

export default function FooterLinks() {
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([
        { id: "col1", title: "Column 1", links: [{ id: "l1", label: "Home", target: "/" }] }
    ]);
    const [saving, setSaving] = useState(false);

    const save = async () => {
        setSaving(true);
        var r = await SettingService.saveFooterLinks({ columns });
        if (r.success) {
            msg.success('Footer links saved');
        }
        setSaving(false);
    };

    const load = async () => {
        setLoading(true);
        var r = await SettingService.loadFooterLinks();
        if (r.success) {
            setColumns(r.data);
        }
        setLoading(false);
    }

    const addColumn = useCallback(() => {
        setColumns(prev => [...prev, { id: "col-" + Date.now(), title: "New Column", links: [] }]);
    }, []);

    const updateColumnTitle = useCallback((colId: string, title: string) => {
        setColumns(prev => prev.map(c => c.id === colId ? { ...c, title } : c));
    }, []);

    const addLinkToCol = useCallback((colId: string) => {
        setColumns(prev => prev.map(c => c.id === colId ? {
            ...c, links: [...c.links, { id: "l-" + Date.now(), label: "New", target: "#" }]
        } : c));
    }, []);

    const updateLinkLabel = useCallback((colId: string, linkId: string, label: string) => {
        setColumns(prev => prev.map(c =>
            c.id === colId
                ? { ...c, links: c.links.map(l => l.id === linkId ? { ...l, label } : l) }
                : c
        ));
    }, []);

    const updateLinkTarget = useCallback((colId: string, linkId: string, target: string) => {
        setColumns(prev => prev.map(c =>
            c.id === colId
                ? { ...c, links: c.links.map(l => l.id === linkId ? { ...l, target } : l) }
                : c
        ));
    }, []);

    const onDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over) return;

        // dragging columns
        if (active.data.current?.type === "column" && over.data.current?.type === "column") {
            if (active.id !== over.id) {
                const oldIdx = columns.findIndex(i => i.id === active.id);
                const newIdx = columns.findIndex(i => i.id === over.id);
                setColumns(arrayMove(columns, oldIdx, newIdx));
            }
        }

        // dragging links
        if (active.data.current?.type === "link" && over.data.current?.type === "link") {
            const colId = active.data.current.colId;
            const col = columns.find(c => c.id === colId);
            if (!col) return;

            if (active.id !== over.id) {
                const oldIdx = col.links.findIndex(i => i.id === active.id);
                const newIdx = col.links.findIndex(i => i.id === over.id);
                const newLinks = arrayMove(col.links, oldIdx, newIdx);
                setColumns(prev => prev.map(c => c.id === colId ? { ...c, links: newLinks } : c));
            }
        }
    };

    useEffect(() => {
        load();
    }, [])

    return (
        <AppPage
            title="Footer Links"
            subtitle="Manage links in footer"
            actions={<Btn onClick={save} loading={saving}>Save Footer</Btn>}
        >
            {loading && <CenterLoading className="relative h-[400px]" />}
            {!loading && <>
                <Btn size="sm" variant="outline" onClick={addColumn}>Add Column</Btn>

                <DndContext onDragEnd={onDragEnd} collisionDetection={closestCenter}>
                    <SortableContext items={columns.map(x => x.id)} strategy={verticalListSortingStrategy}>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {columns.map((col: any) => (
                                <SortableColumn
                                    key={col.id}
                                    col={col}
                                    updateTitle={(title: string) => updateColumnTitle(col.id, title)}
                                    addLinkToCol={() => addLinkToCol(col.id)}
                                    updateLinkLabel={updateLinkLabel}
                                    updateLinkTarget={updateLinkTarget}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </>}
        </AppPage>
    );
}