import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import { TicketCategoryActionArray, TicketCategoryActionEnum } from '@/data/Ticket';
import { msg } from '@/lib/msg';
import { TeamService } from '@/services/TeamService';
import { useState, useEffect } from 'react';
import { LuSquare, LuSquareCheck } from 'react-icons/lu';



export default function TeamTicketSupportEditor({ id }: { id: number }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<{
        id: number,
        name: string,
        description: string,
        ticket_category_type: TicketCategoryActionEnum
    }[]>([]);

    const load = async () => {
        setLoading(true);
        var r = await TeamService.loadTicketConfiguration(id);
        if (r.success) {
            setCategories(r.data.ticket_categories);
            setSelectedCategory(r.data.ticket_category_ids);
            setSelectedType(r.data.ticket_category_types);
        }
        setLoading(false);
    }


    const save = async () => {
        setSaving(true);
        var r = await TeamService.saveTicketConfiguration({
            team_id: id,
            ticket_category_ids: selectedCategory
        });

        if (r.success) {
            msg.success('Details are saved');
        }
        setSaving(false);
    };





    const [selectedType, setSelectedType] = useState<TicketCategoryTypeEnum[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number[]>([]);



    const toggleType = (type: TicketCategoryTypeEnum) => {
        setSelectedType(prev => {
            if (prev.includes(type)) {
                return prev.filter(t => t !== type);
            } else {
                return [...prev, type];
            }
        });
        setSelectedCategory(cx => {
            return cx.filter(cy => {
                var found = categories.find(cz => cz.id == cy);

                if (found) {
                    if (selectedType.includes(found.ticket_category_type)) {
                        return true;
                    }
                }
                return false;
            })
        });
    };

    const toggleCategory = (category: number) => {
        setSelectedCategory(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };




    useEffect(() => {
        load();
    }, [])

    if (loading) {
        return <CenterLoading className='relative h-[400px]' />
    }

    return (

        <>
            {/* STEP 1: Category Type (Multi-Select) */}
            <div className="mb-10 p-6 bg-indigo-50 rounded-2xl border border-indigo-200">
                <h2 className="text-xl font-semibold text-indigo-700 mb-6 flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 mr-3 bg-indigo-600 text-white text-lg font-bold rounded-full">1</span>
                    Ticket Category Type (Multi-Select)
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {TicketCategoryActionArray.map((type) => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => toggleType(type.id)}
                            className={`
                    p-4 rounded-xl text-center transition-all duration-200 shadow-md h-24
                    flex items-center justify-center font-medium border
                    ${selectedType.includes(type.type)
                                    ? 'bg-indigo-600 text-white border-indigo-700 ring-1 ring-indigo-300  '
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'
                                }
                  `}
                        >
                            {type.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* STEP 2: Specific Category (Grouped Multi-Select) */}
            <div className="mb-10 p-6 bg-green-50 rounded-2xl border border-green-200">
                <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 mr-3 bg-green-600 text-white text-lg font-bold rounded-full">2</span>
                    Select Specific Issue(s) by Type
                </h2>

                {selectedType.length === 0 ? (
                    <p className="text-gray-500 italic">Please select one or more Category Types in Step 2 to view available issues.</p>
                ) : (
                    <>
                        {selectedType.map(ticket_category_type => {
                            var found = TicketCategoryActionArray.find(t => t.id == ticket_category_type);
                            if (!found) {
                                return null;
                            }
                            return (
                                <div key={ticket_category_type} className="mb-6">
                                    <div className='flex flex-row items-center gap-3'>
                                        <h3 className="text-lg font-bold text-green-800 flex-1 mb-3 mt-4 border-b border-green-300 pb-1">
                                            {found.name} Issues
                                        </h3>
                                        <Btn size={'xs'} variant={'outline'} onClick={() => {
                                            setSelectedCategory(cq => [...cq, ...categories.filter(cx => cx.ticket_category_type == ticket_category_type).map(cx => cx.id)])
                                        }}>Select All</Btn>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {categories.filter(c => c.ticket_category_type == ticket_category_type).map((category) => (
                                            <button
                                                key={category.id}
                                                type="button"
                                                onClick={() => toggleCategory(category.id)}
                                                className={`
                                            p-3 rounded-lg text-left transition-all duration-150 border-2 text-sm flex items-center gap-1
                                            ${selectedCategory.includes(category.id)
                                                        ? 'bg-green-600 text-white border-green-700 shadow-md'
                                                        : 'bg-white text-gray-800 border-gray-300 hover:bg-green-100'
                                                    }
                                        `}
                                            >
                                                {selectedCategory.includes(category.id) ? <LuSquareCheck /> : <LuSquare />}
                                                <span className="font-semibold">{category.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Summary of all selected issues */}
                        {selectedCategory.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-green-300 flex flex-row items-center gap-3">
                                <div className='flex flex-col flex-1'>
                                    <p className="text-md font-semibold text-green-700">
                                        Total Selected Issues ({selectedCategory.length}):
                                    </p>
                                    <p className="text-sm text-green-600 italic">
                                        {selectedCategory.map(c => {
                                            var found = categories.find(cx => cx.id == c);
                                            return found?.name ?? '--'
                                        }).join(' | ')}
                                    </p>
                                </div>
                                <Btn size={'lg'} onClick={save} loading={saving}>Save Details</Btn>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

