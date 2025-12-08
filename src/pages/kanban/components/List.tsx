import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus, CheckSquare, AlignLeft, Paperclip, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function List({ list, index, tasks, onTaskClick, onAddTask }) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [listTitle, setListTitle] = useState(list.title);

    return (
        <Draggable draggableId={list.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="w-[280px] shrink-0 select-none"
                >
                    <div
                        className={`bg-[#f1f2f4] rounded-xl shadow-sm border border-transparent flex flex-col max-h-[calc(100vh-140px)] transition-shadow ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500/20 rotate-2' : ''}`}
                        {...provided.dragHandleProps}
                    >
                        {/* List Header */}
                        <div className="p-3 pr-2 flex justify-between items-start gap-2 group">
                            {isEditingTitle ? (
                                <input
                                    autoFocus
                                    className="flex-1 px-2 py-1 text-sm font-semibold text-[#172b4d] bg-white border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm inset-0"
                                    value={listTitle}
                                    onChange={(e) => setListTitle(e.target.value)}
                                    onBlur={() => setIsEditingTitle(false)}
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                                />
                            ) : (
                                <h3
                                    onClick={() => setIsEditingTitle(true)}
                                    className="flex-1 px-2 py-1 text-sm font-semibold text-[#172b4d] truncate cursor-pointer hover:bg-[#091e4214] rounded transition-colors"
                                >
                                    {listTitle}
                                </h3>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#091e4214] text-[#44546f] rounded-md">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* List Tasks Area */}
                        <Droppable droppableId={list.id} type="task">
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`px-2 flex-1 overflow-y-auto min-h-[2px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/30' : ''
                                        }`}
                                    style={{
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#091e4224 transparent'
                                    }}
                                >
                                    {tasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={() => onTaskClick(task)}
                                                    className={`group relative bg-white p-2.5 mb-2 rounded-lg shadow-[0px_1px_1px_#091e4240,0px_0px_1px_#091e424f] cursor-pointer hover:border-blue-300 hover:shadow-md transition-all ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500 z-50 rotate-1' : ''
                                                        }`}
                                                >
                                                    {/* Task Cover Image if exists */}
                                                    {task.cover && (
                                                        <div className="h-32 -mx-2.5 -mt-2.5 mb-2 rounded-t-lg bg-cover bg-center" style={{ backgroundImage: `url(${task.cover})` }} />
                                                    )}

                                                    {/* Task Labels */}
                                                    {task.labels && task.labels.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mb-1.5">
                                                            {task.labels.map((label, idx) => (
                                                                <span key={idx} className={`h-2 min-w-[40px] rounded-full ${label.color} hover:brightness-110 transition-all`} title={label.name} />
                                                            ))}
                                                        </div>
                                                    )}

                                                    <span className="text-sm text-[#172b4d] font-medium block mb-1.5 leading-tight">
                                                        {task.content}
                                                    </span>

                                                    {/* Task Metadata */}
                                                    <div className="flex items-center gap-3 text-[11px] text-[#44546f] flex-wrap">
                                                        {task.description && (
                                                            <div className="flex items-center gap-1" title="This card has a description">
                                                                <AlignLeft className="w-3.5 h-3.5" />
                                                            </div>
                                                        )}
                                                        {task.checklists && task.checklists.some(c => c.items.length > 0) && (
                                                            <div
                                                                className={`flex items-center gap-1 px-1 rounded ${task.checklists.reduce((acc, cl) => acc + cl.items.filter(i => i.checked).length, 0) === task.checklists.reduce((acc, cl) => acc + cl.items.length, 0)
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : ''
                                                                    }`}
                                                                title="Checklist items"
                                                            >
                                                                <CheckSquare className="w-3.5 h-3.5" />
                                                                <span>
                                                                    {task.checklists.reduce((acc, cl) => acc + cl.items.filter(i => i.checked).length, 0)}/
                                                                    {task.checklists.reduce((acc, cl) => acc + cl.items.length, 0)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {task.attachments && (
                                                            <div className="flex items-center gap-1">
                                                                <Paperclip className="w-3.5 h-3.5" />
                                                                <span>{task.attachments}</span>
                                                            </div>
                                                        )}
                                                        {task.dueDate && (
                                                            <div className="flex items-center gap-1 p-0.5 rounded hover:bg-[#091e4214]">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                <span>{task.dueDate}</span>
                                                            </div>
                                                        )}
                                                        {task.members && task.members.length > 0 && (
                                                            <div className="flex items-center gap-0.5 ml-auto">
                                                                {task.members.map((m, i) => (
                                                                    <div key={i} className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold border border-white">
                                                                        {m}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        {/* Add Card Button */}
                        <div className="p-2">
                            <Button
                                onClick={() => onAddTask(list.id)}
                                variant="ghost"
                                className="w-full justify-start text-[#44546f] hover:text-[#172b4d] hover:bg-[#091e4214] h-8 rounded-md"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">Add a card</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}