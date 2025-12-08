import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
    AlignLeft, CheckSquare, Tag, Calendar,
    User, Paperclip, Activity, CreditCard, Eye, Trash2,
    Plus, X, Clock, Layout, GripVertical
} from 'lucide-react';

export default function CardDetailModal({ card, isOpen, onClose, onUpdate }) {
    const [currentCard, setCurrentCard] = useState(card);
    const [newChecklistItem, setNewChecklistItem] = useState("");
    const [editingDesc, setEditingDesc] = useState(false);
    const [activeChecklistId, setActiveChecklistId] = useState(null);

    useEffect(() => {
        if (card) {
            // Ensure checklists have IDs and items have IDs for DnD
            const safeCard = {
                ...card,
                checklists: (card.checklists || []).map((cl, i) => ({
                    ...cl,
                    id: cl.id || `cl-${Date.now()}-${i}`,
                    items: (cl.items || []).map((item, j) => ({
                        ...item,
                        id: item.id || `item-${Date.now()}-${i}-${j}`
                    }))
                }))
            };
            setCurrentCard(safeCard);
        }
    }, [card]);

    if (!currentCard) return null;

    const handleSave = () => {
        onUpdate(currentCard);
    };

    const updateChecklists = (newChecklists) => {
        const updatedCard = { ...currentCard, checklists: newChecklists };
        setCurrentCard(updatedCard);
        onUpdate(updatedCard);
    };

    const toggleCheckItem = (checklistIndex, itemIndex) => {
        const newChecklists = [...currentCard.checklists];
        const item = newChecklists[checklistIndex].items[itemIndex];
        item.checked = !item.checked;
        updateChecklists(newChecklists);
    };

    const addCheckItem = (checklistIndex) => {
        if (!newChecklistItem.trim()) return;
        const newChecklists = [...currentCard.checklists];
        newChecklists[checklistIndex].items.push({
            id: `item-${Date.now()}`,
            text: newChecklistItem,
            checked: false
        });
        updateChecklists(newChecklists);
        setNewChecklistItem("");
    };

    const deleteCheckItem = (checklistIndex, itemIndex) => {
        const newChecklists = [...currentCard.checklists];
        newChecklists[checklistIndex].items.splice(itemIndex, 1);
        updateChecklists(newChecklists);
    };

    const deleteChecklist = (checklistIndex) => {
        const newChecklists = [...currentCard.checklists];
        newChecklists.splice(checklistIndex, 1);
        updateChecklists(newChecklists);
    };

    const addChecklist = () => {
        const newChecklists = [...(currentCard.checklists || [])];
        newChecklists.push({
            id: `cl-${Date.now()}`,
            title: 'Checklist',
            items: []
        });
        updateChecklists(newChecklists);
    };

    const onDragEnd = (result) => {
        const { source, destination, type } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const newChecklists = [...currentCard.checklists];

        if (type === 'CHECKLIST') {
            const [removed] = newChecklists.splice(source.index, 1);
            newChecklists.splice(destination.index, 0, removed);
            updateChecklists(newChecklists);
            return;
        }

        if (type === 'ITEM') {
            const sourceChecklistIdx = newChecklists.findIndex(c => c.id === source.droppableId);
            const destChecklistIdx = newChecklists.findIndex(c => c.id === destination.droppableId);

            if (sourceChecklistIdx === -1 || destChecklistIdx === -1) return;

            const sourceItems = [...newChecklists[sourceChecklistIdx].items];
            const destItems = (sourceChecklistIdx === destChecklistIdx)
                ? sourceItems
                : [...newChecklists[destChecklistIdx].items];

            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            if (sourceChecklistIdx !== destChecklistIdx) {
                newChecklists[sourceChecklistIdx] = { ...newChecklists[sourceChecklistIdx], items: sourceItems };
                newChecklists[destChecklistIdx] = { ...newChecklists[destChecklistIdx], items: destItems };
            } else {
                newChecklists[sourceChecklistIdx] = { ...newChecklists[sourceChecklistIdx], items: sourceItems };
            }

            updateChecklists(newChecklists);
        }
    };

    const calculateProgress = (items) => {
        if (!items || items.length === 0) return 0;
        const checked = items.filter(i => i.checked).length;
        return Math.round((checked / items.length) * 100);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#f4f5f7] p-0 gap-0 border-none sm:rounded-lg shadow-2xl">

                {/* Cover Image */}
                {currentCard.cover && (
                    <div
                        className="h-40 w-full bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${currentCard.cover})` }}
                    >
                        <Button variant="secondary" size="sm" className="absolute bottom-2 right-2 bg-black/50 text-white hover:bg-black/70 border-none">
                            Cover
                        </Button>
                    </div>
                )}

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_190px] gap-8">
                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Title Header */}
                        <div className="flex gap-4 items-start">
                            <CreditCard className="w-6 h-6 mt-1.5 text-[#172b4d] shrink-0" />
                            <div className="space-y-1 w-full">
                                <Input
                                    value={currentCard.content}
                                    onChange={(e) => {
                                        const updated = { ...currentCard, content: e.target.value };
                                        setCurrentCard(updated);
                                    }}
                                    onBlur={handleSave}
                                    className="text-xl font-semibold bg-transparent border-transparent shadow-none px-2 h-8 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm focus:bg-white -ml-2 text-[#172b4d]"
                                />
                                <div className="text-sm text-[#44546f] px-0.5">
                                    in list <span className="underline decoration-transparent hover:decoration-[#44546f] cursor-pointer font-medium text-[#172b4d] transition-all">In Progress</span>
                                </div>
                            </div>
                        </div>

                        {/* Labels & Members Row */}
                        {(currentCard.members?.length > 0 || currentCard.labels?.length > 0) && (
                            <div className="ml-10 flex flex-wrap gap-6">
                                {currentCard.members && currentCard.members.length > 0 && (
                                    <div className="space-y-1.5">
                                        <h4 className="text-xs font-semibold text-[#44546f] uppercase tracking-wide">Members</h4>
                                        <div className="flex gap-1">
                                            {currentCard.members.map((m, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-[#dfe1e6] hover:bg-[#c1c7d0] cursor-pointer border-transparent flex items-center justify-center text-xs font-bold text-[#172b4d] transition-colors" title="Member">
                                                    {m}
                                                </div>
                                            ))}
                                            <button className="w-8 h-8 rounded-full bg-[#dfe1e6] hover:bg-[#c1c7d0] flex items-center justify-center transition-colors text-[#172b4d]">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {currentCard.labels && currentCard.labels.length > 0 && (
                                    <div className="space-y-1.5">
                                        <h4 className="text-xs font-semibold text-[#44546f] uppercase tracking-wide">Labels</h4>
                                        <div className="flex gap-1 flex-wrap">
                                            {currentCard.labels.map((l, i) => (
                                                <div key={i} className={`${l.color} px-3 py-1.5 rounded-[3px] bg-opacity-80 hover:bg-opacity-100 cursor-pointer transition-colors text-white text-sm font-semibold min-w-[48px] h-8 flex items-center justify-center`}>
                                                    {l.name}
                                                </div>
                                            ))}
                                            <button className="w-8 h-8 rounded-[3px] bg-[#dfe1e6] hover:bg-[#c1c7d0] flex items-center justify-center transition-colors text-[#42526e]">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        <div className="flex gap-4 items-start">
                            <AlignLeft className="w-6 h-6 mt-1 text-[#172b4d] shrink-0" />
                            <div className="w-full space-y-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-[#172b4d]">Description</h3>
                                </div>

                                {editingDesc ? (
                                    <div className="space-y-2">
                                        <Textarea
                                            value={currentCard.description || ""}
                                            onChange={(e) => setCurrentCard({ ...currentCard, description: e.target.value })}
                                            className="min-h-[108px] bg-white resize-none focus-visible:ring-2 focus-visible:ring-blue-600 border-blue-400"
                                            placeholder="Add a more detailed description..."
                                            autoFocus
                                        />
                                        <div className="flex gap-2 items-center">
                                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { handleSave(); setEditingDesc(false); }}>Save</Button>
                                            <Button size="sm" variant="ghost" className="hover:bg-transparent text-[#44546f]" onClick={() => setEditingDesc(false)}>Cancel</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setEditingDesc(true)}
                                        className={`min-h-[60px] text-[#172b4d] text-sm leading-relaxed cursor-pointer hover:bg-[#091e420f] rounded-[3px] transition-colors ${currentCard.description ? 'p-2 -ml-2' : 'p-3 bg-[#091e420f] font-medium'}`}
                                    >
                                        {currentCard.description || "Add a more detailed description..."}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Checklists Area with DnD */}
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="checklists" type="CHECKLIST">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6">
                                        {currentCard.checklists && currentCard.checklists.map((checklist, cIdx) => (
                                            <Draggable key={checklist.id} draggableId={checklist.id} index={cIdx}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`flex gap-4 items-start group/checklist ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                                    >
                                                        <div className="mt-1 shrink-0" {...provided.dragHandleProps}>
                                                            <CheckSquare className="w-6 h-6 text-[#172b4d]" />
                                                        </div>

                                                        <div className="w-full space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <h3 className="text-lg font-semibold text-[#172b4d]" {...provided.dragHandleProps}>{checklist.title}</h3>
                                                                <Button
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    onClick={() => deleteChecklist(cIdx)}
                                                                    className="bg-[#dfe1e6] hover:bg-[#c1c7d0] text-[#172b4d] h-8 opacity-0 group-hover/checklist:opacity-100 transition-opacity"
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[11px] font-medium text-[#5e6c84] w-8">{calculateProgress(checklist.items)}%</span>
                                                                <Progress value={calculateProgress(checklist.items)} className="h-1.5 bg-[#dfe1e6]" indicatorClassName="bg-blue-600" />
                                                            </div>

                                                            <Droppable droppableId={checklist.id} type="ITEM">
                                                                {(provided) => (
                                                                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-1">
                                                                        {checklist.items.map((item, iIdx) => (
                                                                            <Draggable key={item.id} draggableId={item.id} index={iIdx}>
                                                                                {(provided, snapshot) => (
                                                                                    <div
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        className={`group flex items-center gap-3 hover:bg-[#091e420f] p-1.5 -ml-2 rounded transition-colors ${snapshot.isDragging ? 'bg-white shadow-md' : ''}`}
                                                                                    >
                                                                                        <div className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-[#5e6c84]">
                                                                                            <GripVertical className="w-4 h-4" />
                                                                                        </div>
                                                                                        <Checkbox
                                                                                            checked={item.checked}
                                                                                            onCheckedChange={() => toggleCheckItem(cIdx, iIdx)}
                                                                                            className="w-5 h-5 border-2 border-[#dfe1e6] data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-[2px]"
                                                                                        />
                                                                                        <span
                                                                                            className={`flex-1 text-sm transition-all ${item.checked ? 'line-through text-[#5e6c84]' : 'text-[#172b4d]'}`}
                                                                                            onClick={() => toggleCheckItem(cIdx, iIdx)}
                                                                                        >
                                                                                            {item.text}
                                                                                        </span>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            onClick={() => deleteCheckItem(cIdx, iIdx)}
                                                                                            className="opacity-0 group-hover:opacity-100 h-6 w-6 text-[#5e6c84] hover:text-red-600 hover:bg-[#091e420f]"
                                                                                        >
                                                                                            <X className="w-3.5 h-3.5" />
                                                                                        </Button>
                                                                                    </div>
                                                                                )}
                                                                            </Draggable>
                                                                        ))}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>

                                                            <div className="pl-0">
                                                                <div className="space-y-2">
                                                                    {activeChecklistId === checklist.id ? (
                                                                        <div className="space-y-2">
                                                                            <Input
                                                                                autoFocus
                                                                                placeholder="Add an item"
                                                                                className="h-9 text-sm bg-white"
                                                                                value={newChecklistItem}
                                                                                onChange={(e) => setNewChecklistItem(e.target.value)}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter') {
                                                                                        addCheckItem(cIdx);
                                                                                        // Keep focus? 
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <div className="flex gap-2 items-center">
                                                                                <Button size="sm" onClick={() => addCheckItem(cIdx)} className="bg-blue-600 hover:bg-blue-700">Add</Button>
                                                                                <Button size="sm" variant="ghost" onClick={() => setActiveChecklistId(null)}>Cancel</Button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <Button
                                                                            variant="secondary"
                                                                            size="sm"
                                                                            className="bg-[#091e420f] hover:bg-[#091e4214] text-[#172b4d] justify-start h-8 px-3"
                                                                            onClick={() => setActiveChecklistId(checklist.id)}
                                                                        >
                                                                            Add an item
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        {/* Activity Section */}
                        <div className="flex gap-4 items-start">
                            <Activity className="w-6 h-6 mt-1 text-[#172b4d] shrink-0" />
                            <div className="w-full space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-[#172b4d]">Activity</h3>
                                    <Button variant="secondary" size="sm" className="bg-[#091e420f] hover:bg-[#091e4214] text-[#172b4d] h-8">Show Details</Button>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#dfe1e6] text-[#172b4d] flex items-center justify-center font-bold text-xs shrink-0">JD</div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-[#172b4d]">
                                            <span className="font-bold">John Doe</span> added this card to In Progress
                                        </div>
                                        <div className="text-xs text-[#5e6c84]">Just now</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6 pt-1">
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-[#5e6c84] uppercase tracking-wide mb-1">Add to card</h4>

                            <Button variant="secondary" className="w-full justify-start h-8 text-[#172b4d] bg-[#091e420f] hover:bg-[#091e4214] shadow-none text-sm px-3">
                                <User className="w-4 h-4 mr-2" /> Members
                            </Button>
                            <Button variant="secondary" className="w-full justify-start h-8 text-[#172b4d] bg-[#091e420f] hover:bg-[#091e4214] shadow-none text-sm px-3">
                                <Tag className="w-4 h-4 mr-2" /> Labels
                            </Button>
                            <Button
                                onClick={addChecklist}
                                variant="secondary"
                                className="w-full justify-start h-8 text-[#172b4d] bg-[#091e420f] hover:bg-[#091e4214] shadow-none text-sm px-3"
                            >
                                <CheckSquare className="w-4 h-4 mr-2" /> Checklist
                            </Button>
                            <Button variant="secondary" className="w-full justify-start h-8 text-[#172b4d] bg-[#091e420f] hover:bg-[#091e4214] shadow-none text-sm px-3">
                                <Clock className="w-4 h-4 mr-2" /> Dates
                            </Button>
                            <Button variant="secondary" className="w-full justify-start h-8 text-[#172b4d] bg-[#091e420f] hover:bg-[#091e4214] shadow-none text-sm px-3">
                                <Paperclip className="w-4 h-4 mr-2" /> Attachment
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-[#5e6c84] uppercase tracking-wide mb-1">Actions</h4>
                            <Button variant="secondary" className="w-full justify-start h-8 text-[#172b4d] bg-[#091e420f] hover:bg-[#091e4214] shadow-none text-sm px-3">
                                <Eye className="w-4 h-4 mr-2" /> Watch
                            </Button>
                            <Button variant="secondary" className="w-full justify-start h-8 text-[#172b4d] bg-[#091e420f] hover:bg-[#091e4214] shadow-none text-sm px-3 hover:bg-red-50 hover:text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" /> Archive
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}