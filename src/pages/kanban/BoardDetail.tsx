import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import List from '../components/trello/List';
import CardDetailModal from '../components/trello/CardDetailModal';
import { Button } from "@/components/ui/button";
import { Plus, Star, Users, Filter, MoreHorizontal, Search, Bell, HelpCircle } from 'lucide-react';

// Initial Mock Data
const initialData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Design System Research', description: 'Analyze competitors design systems and create a moodboard.', labels: [{ color: 'bg-green-500', name: 'Design' }], members: ['JD'], checklists: [{ id: 'cl-1', title: 'Research', items: [{ id: 'item-1', text: 'Find 3 examples', checked: true }, { id: 'item-2', text: 'Create moodboard', checked: false }] }] },
        'task-2': { id: 'task-2', content: 'Set up project repo', description: 'Initialize git repository and configure CI/CD pipeline.', labels: [{ color: 'bg-blue-500', name: 'Dev' }], checklists: [] },
        'task-3': { id: 'task-3', content: 'User Interviews', description: 'Schedule calls with 5 potential users.', labels: [{ color: 'bg-yellow-500', name: 'Research' }], cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', members: ['AK'] },
        'task-4': { id: 'task-4', content: 'Database Schema', description: 'Design initial schema for User and Project entities.', labels: [{ color: 'bg-blue-500', name: 'Dev' }], checklists: [] },
        'task-5': { id: 'task-5', content: 'Frontend Boilerplate', description: 'Setup React, Tailwind, and Shadcn UI.', labels: [{ color: 'bg-blue-500', name: 'Dev' }], checklists: [] },
    },
    lists: {
        'list-1': { id: 'list-1', title: 'To Do', taskIds: ['task-1', 'task-2', 'task-3'] },
        'list-2': { id: 'list-2', title: 'In Progress', taskIds: ['task-4'] },
        'list-3': { id: 'list-3', title: 'Code Review', taskIds: ['task-5'] },
        'list-4': { id: 'list-4', title: 'Done', taskIds: [] },
    },
    listOrder: ['list-1', 'list-2', 'list-3', 'list-4'],
};

export default function Board() {
    const [data, setData] = useState(initialData);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onDragEnd = (result) => {
        const { destination, source, draggableId, type } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Moving Lists
        if (type === 'list') {
            const newListOrder = Array.from(data.listOrder);
            newListOrder.splice(source.index, 1);
            newListOrder.splice(destination.index, 0, draggableId);

            const newState = {
                ...data,
                listOrder: newListOrder,
            };
            setData(newState);
            return;
        }

        // Moving Tasks
        const start = data.lists[source.droppableId];
        const finish = data.lists[destination.droppableId];

        // Moving within the same list
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newList = {
                ...start,
                taskIds: newTaskIds,
            };

            const newState = {
                ...data,
                lists: {
                    ...data.lists,
                    [newList.id]: newList,
                },
            };

            setData(newState);
            return;
        }

        // Moving from one list to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds,
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds,
        };

        const newState = {
            ...data,
            lists: {
                ...data.lists,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };

        setData(newState);
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleTaskUpdate = (updatedTask) => {
        setData(prev => ({
            ...prev,
            tasks: {
                ...prev.tasks,
                [updatedTask.id]: updatedTask
            }
        }));
    };

    const addNewList = () => {
        const newListId = `list-${Object.keys(data.lists).length + 1}`;
        const newList = {
            id: newListId,
            title: 'New List',
            taskIds: [],
        };
        setData(prev => ({
            ...prev,
            lists: { ...prev.lists, [newListId]: newList },
            listOrder: [...prev.listOrder, newListId]
        }));
    };

    const addNewTask = (listId) => {
        const newTaskId = `task-${Date.now()}`;
        const newTask = {
            id: newTaskId,
            content: 'New Task',
            description: '',
            labels: [],
            checklists: []
        };

        setData(prev => {
            const list = prev.lists[listId];
            return {
                ...prev,
                tasks: { ...prev.tasks, [newTaskId]: newTask },
                lists: {
                    ...prev.lists,
                    [listId]: {
                        ...list,
                        taskIds: [...list.taskIds, newTaskId]
                    }
                }
            };
        });
    };

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-56px)] bg-gradient-to-r from-sky-600 to-blue-600">
            {/* Board Secondary Header */}
            <div className="h-[56px] px-4 bg-black/20 backdrop-blur-sm flex items-center justify-between shrink-0 text-white">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold cursor-pointer hover:bg-white/20 px-3 py-1.5 rounded transition-colors">Product Roadmap</h1>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-white hover:bg-white/20 hover:text-white">
                        <Star className="w-4 h-4" />
                    </Button>
                    <div className="h-4 w-[1px] bg-white/30 mx-1" />
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 hover:text-white font-medium h-8">
                        <Users className="w-4 h-4 mr-2" />
                        Team Visible
                    </Button>
                    <div className="h-4 w-[1px] bg-white/30 mx-1" />
                    <Button variant="secondary" size="sm" className="bg-slate-100 text-blue-900 hover:bg-white h-8">
                        <span className="text-xs font-bold mr-2">Board</span>
                    </Button>
                    <div className="flex -space-x-2 ml-2">
                        <div className="w-7 h-7 rounded-full bg-red-500 border-2 border-white/20 flex items-center justify-center text-[10px] font-bold cursor-pointer hover:-translate-y-1 transition-transform">JD</div>
                        <div className="w-7 h-7 rounded-full bg-yellow-500 border-2 border-white/20 flex items-center justify-center text-[10px] font-bold cursor-pointer hover:-translate-y-1 transition-transform">AK</div>
                        <div className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer border-2 border-dashed border-white/50 flex items-center justify-center text-xs transition-colors">
                            <Plus className="w-4 h-4" />
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 hover:text-white ml-2 h-8">
                        Invite
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 hover:text-white h-8">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-white hover:bg-white/20 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="all-lists" direction="horizontal" type="list">
                        {(provided) => (
                            <div
                                className="flex h-full items-start p-4 gap-3"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {data.listOrder.map((listId, index) => {
                                    const list = data.lists[listId];
                                    const tasks = list.taskIds.map((taskId) => data.tasks[taskId]);
                                    return (
                                        <List
                                            key={list.id}
                                            list={list}
                                            tasks={tasks}
                                            index={index}
                                            onTaskClick={handleTaskClick}
                                            onAddTask={addNewTask}
                                        />
                                    );
                                })}
                                {provided.placeholder}

                                {/* Add List Button */}
                                <div className="w-[280px] shrink-0">
                                    <Button
                                        onClick={addNewList}
                                        variant="ghost"
                                        className="w-full justify-start bg-white/20 hover:bg-white/30 text-white h-11 backdrop-blur-sm font-medium rounded-xl border border-transparent hover:border-white/20 transition-all"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add another list
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            <CardDetailModal
                card={selectedTask}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdate={handleTaskUpdate}
            />
        </div>
    );
}