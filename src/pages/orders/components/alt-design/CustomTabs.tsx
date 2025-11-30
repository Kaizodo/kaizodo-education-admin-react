import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Loader2, GripVertical, Settings } from 'lucide-react';
import { TbFilterDown, TbFilterUp } from 'react-icons/tb';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface TabNav {
    id: string;
    label: string;
    count: number | 'icon';
}

interface CustomTabsProps {
    filtersToggle: (open: boolean) => void;
    navs: TabNav[];
    onCreateBtnClick: () => void;
    onTabSelect: (id: string) => void;
    children?: ReactNode;
    activeTab: string;
    loading?: boolean;
}

export default function CustomTabs({
    filtersToggle,
    navs,
    activeTab,
    onCreateBtnClick,
    onTabSelect,
    children,
    loading = false
}: CustomTabsProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [activeTabId, setActiveTabId] = useState(activeTab);
    const [tabOrder, setTabOrder] = useState<string[]>([]);
    const [isSortingOpen, setIsSortingOpen] = useState(false);
    const [tempOrder, setTempOrder] = useState<string[]>([]);
    const tabsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setActiveTabId(activeTab);
    }, [activeTab]);

    useEffect(() => {
        const activeElement = tabsRef.current?.querySelector(`[data-tab-id="${activeTabId}"]`) as HTMLElement;
        activeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [activeTabId]);

    useEffect(() => {
        filtersToggle(showFilters);
    }, [showFilters, filtersToggle]);

    useEffect(() => {
        const saved = localStorage.getItem('tabOrder');
        const defaultOrder = navs.map(t => t.id);
        if (!saved) {
            setTabOrder(defaultOrder);
            return;
        }
        try {
            const savedOrder: string[] = JSON.parse(saved);
            if (!Array.isArray(savedOrder)) {
                setTabOrder(defaultOrder);
                return;
            }
            const existing = savedOrder.filter(id => navs.some(t => t.id === id));
            const newIds = navs.map(t => t.id).filter(id => !existing.includes(id));
            const newOrder = [...existing, ...newIds];
            setTabOrder(newOrder);
        } catch {
            setTabOrder(defaultOrder);
        }
    }, [navs]);

    const orderedNavs = tabOrder.map(id => navs.find(t => t.id === id)).filter(Boolean) as TabNav[];

    const handleOpenSorting = () => {
        setTempOrder([...tabOrder]);
        setIsSortingOpen(true);
    };

    const handleDragEndInPopup = (result: DropResult) => {
        if (!result.destination) return;
        const newOrder = Array.from(tempOrder);
        const [removed] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, removed);
        setTempOrder(newOrder);
    };

    const popupOrderedNavs = tempOrder.map(id => navs.find(t => t.id === id)).filter(Boolean) as TabNav[];

    const saveOrder = () => {
        setTabOrder(tempOrder);
        localStorage.setItem('tabOrder', JSON.stringify(tempOrder));
        setIsSortingOpen(false);
    };

    const resetOrderInPopup = () => {
        const defaultOrder = navs.map(t => t.id);
        setTempOrder(defaultOrder);
    };

    const scrollLeft = () => {
        tabsRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
    };

    const scrollRight = () => {
        tabsRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
    };

    const resetOrder = () => {
        const defaultOrder = navs.map(t => t.id);
        setTabOrder(defaultOrder);
        localStorage.setItem('tabOrder', JSON.stringify(defaultOrder));
    };

    const TabItem: React.FC<{ tab: TabNav }> = ({ tab }) => {
        const isActive = tab.id === activeTabId;
        const activeClasses = 'text-blue-600 font-medium hover:text-primary';
        const inactiveClasses = 'text-gray-700 hover:text-gray-900';
        const renderCount = () => {
            if (tab.count === 'icon') {
                return loading ? (
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse mr-1" />
                ) : (
                    <div className="w-2 h-2 rounded-full bg-blue-600 mr-1" />
                );
            }
            if (typeof tab.count === 'number') {
                return loading ? (
                    <div className="bg-gray-300 animate-pulse rounded-lg px-2 py-0.5 min-w-[2rem] h-4" />
                ) : tab.count > 0 ? (
                    <span className="bg-gray-200 text-xs font-semibold px-2 py-0.5 rounded-lg text-gray-700">
                        {tab.count}
                    </span>
                ) : null;
            }
            return null;
        };
        return (
            <button
                data-tab-id={tab.id}
                className={`
                    flex items-center space-x-2 px-4 py-2 text-sm relative transition-all duration-300 hover:text-sky-500
                    ${isActive ? activeClasses : inactiveClasses}
                `}
                onClick={() => {
                    setActiveTabId(tab.id);
                    onTabSelect(tab.id);
                }}
            >
                {renderCount()}
                <span>{tab.label}</span>
                {isActive && (
                    <div className="absolute inset-x-0 bottom-0 h-[3px] bg-blue-600 rounded-t-sm shadow-inner transition-all duration-300" />
                )}
            </button>
        );
    };

    if (isSortingOpen) {
        return (
            <>
                <div className='bg-white p-3 border-s border-b'>
                    <span className='font-semibold'>Order Management</span>
                </div>
                <div className="flex items-center h-14 border-b border-gray-200 text-gray-500 bg-white border-s sticky top-0 z-50">
                    <div className="flex items-center space-x-2 p-3 border-r border-gray-200">
                        <button
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                            onClick={() => !loading && setShowFilters(!showFilters)}
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : showFilters ? (
                                <TbFilterUp className="w-5 h-5" />
                            ) : (
                                <TbFilterDown className="w-5 h-5" />
                            )}
                        </button>
                        <button
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={onCreateBtnClick}
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        <button
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={handleOpenSorting}
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                    <div ref={tabsRef} className="flex-1 flex overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {orderedNavs.map((tab) => (
                            <TabItem key={tab.id} tab={tab} />
                        ))}
                    </div>
                    <div className="flex items-center space-x-1 p-3 border-l border-gray-200">
                        <button
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={scrollLeft}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={scrollRight}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors text-xs"
                            onClick={resetOrder}
                            title="Reset tab order"
                        >
                            ↻
                        </button>
                    </div>
                </div>
                <div className="p-3 max-h-screen overflow-y-auto">
                    {children}
                </div>
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <h3 className="font-semibold mb-4 text-lg">Sort Tabs</h3>
                        <DragDropContext onDragEnd={handleDragEndInPopup}>
                            <Droppable droppableId="popup-tabs">
                                {(provided) => (
                                    <ul
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-2 mb-6"
                                    >
                                        {popupOrderedNavs.map((tab, index) => (
                                            <Draggable key={tab.id} draggableId={tab.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <li
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`p-3 border rounded-md flex items-center space-x-3 cursor-move ${snapshot.isDragging ? 'bg-gray-100 shadow-lg' : 'bg-white hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="text-gray-400 flex-shrink-0"
                                                        >
                                                            <GripVertical className="w-4 h-4" />
                                                        </div>
                                                        <span className="flex-1 font-medium">{tab.label}</span>
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <button
                                onClick={() => setIsSortingOpen(false)}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={resetOrderInPopup}
                                className="px-4 py-2 text-gray-500 hover:text-gray-700 rounded-md"
                            >
                                Reset
                            </button>
                            <button
                                onClick={saveOrder}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className='bg-white p-3 border-s border-b'>
                <span className='font-semibold'>Order Management</span>
            </div>
            <div className="flex items-center h-14 border-b border-gray-200 text-gray-500 bg-white border-s sticky top-0 z-50">
                <div className="flex items-center space-x-2 p-3 border-r border-gray-200">
                    <button
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                        onClick={() => !loading && setShowFilters(!showFilters)}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : showFilters ? (
                            <TbFilterUp className="w-5 h-5" />
                        ) : (
                            <TbFilterDown className="w-5 h-5" />
                        )}
                    </button>
                    <button
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={onCreateBtnClick}
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <button
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={handleOpenSorting}
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
                <div ref={tabsRef} className="flex-1 flex overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {orderedNavs.map((tab) => (
                        <TabItem key={tab.id} tab={tab} />
                    ))}
                </div>
                <div className="flex items-center space-x-1 p-3 border-l border-gray-200">
                    <button
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={scrollLeft}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={scrollRight}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                </div>
            </div>
            <div className="p-3 max-h-screen overflow-y-auto">
                {children}
            </div>
        </>
    );
}