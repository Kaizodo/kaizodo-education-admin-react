import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, X, GripVertical, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LuCircle, LuCircleCheck, LuImage, LuImageOff } from 'react-icons/lu';
import Btn from '@/components/common/Btn';
import { pickImageUrl } from '@/components/common/SimpleMediaPicker';
import SafeImage from '@/components/common/SafeImage';

export function MCQRenderer({ subject, section, question, onChange, multiSelect = false }: { subject: any, section: any, question: any, onChange: (key: string, value: any) => void, multiSelect?: boolean }) {
    const options = question.options || [];


    const updateOption = (index: number, field: string, value: any) => {
        const newOptions = [...options];
        newOptions[index][field] = value;
        onChange('options', newOptions);
    };


    const toggleCorrect = (index: number) => {
        const newOptions = [...options];
        if (multiSelect) newOptions[index].is_correct = newOptions[index].is_correct ? 0 : 1;
        else newOptions.forEach((o, i) => (o.is_correct = i === index ? 1 : 0));
        onChange('options', newOptions);
    };


    const addOption = () => {
        onChange('options', [...options, { id: Date.now(), text: '', is_correct: 0 }]);
    };


    const removeOption = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        onChange('options', newOptions);
    };


    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const reordered = [...options];
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);
        onChange('options', reordered);
    };


    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="options-list">
                {(provided) => (
                    <div className="space-y-3" ref={provided.innerRef} {...provided.droppableProps}>
                        {options.map((opt: any, idx: number) => (
                            <Draggable key={opt.id} draggableId={String(opt.id)} index={idx}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${opt.is_correct ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div {...provided.dragHandleProps} className="text-gray-400 cursor-grab active:cursor-grabbing">
                                            <GripVertical className="h-4 w-4" />
                                        </div>


                                        {multiSelect ? (
                                            <label className={`flex flex-row items-center gap-1 flex-nowrap text-nowrap whitespace-nowrap ${!!opt.is_correct && 'text-green-600'}`}>
                                                <Checkbox checked={opt.is_correct === 1} onCheckedChange={() => toggleCorrect(idx)} />
                                                <span className='text-xs whitespace-nowrap'>Mark Correct</span>
                                            </label>
                                        ) : (
                                            <div
                                                onClick={() => toggleCorrect(idx)}
                                                className={` gap-1  cursor-pointer flex items-center justify-center flex-nowrap text-nowrap whitespace-nowrap ${!!opt.is_correct && 'text-green-600'} `}
                                            >
                                                {!opt.is_correct ? <LuCircle className='text-lg' /> : null}
                                                {!!opt.is_correct && <LuCircleCheck className='text-lg' />}
                                                <span className='text-xs'>Mark Correct</span>
                                            </div>
                                        )}


                                        <div className="flex-1">
                                            <div className="flex gap-2 items-center">
                                                <span className="font-semibold text-gray-500 w-6">{String.fromCharCode(65 + idx)}.</span>
                                                <Input
                                                    value={opt.text}
                                                    onChange={(e) => updateOption(idx, 'text', e.target.value)}
                                                    placeholder={`Option ${idx + 1}`}
                                                />

                                            </div>
                                        </div>
                                        {!!opt?.media_path && <SafeImage src={opt?.media_path} className='max-w-[150px] border rounded-lg p-2 object-contain'>
                                            <LuImageOff />
                                        </SafeImage>}
                                        <Btn variant={'outline'} asyncClick={async () => {
                                            var image = await pickImageUrl({
                                                category_name: `${subject.name} | ${section.name} | Q${question.id}`,
                                                cropped: true
                                            });
                                            if (image) {
                                                updateOption(idx, 'media_path', image)
                                            }
                                        }}><LuImage /> Add Image</Btn>
                                        <Btn variant="ghost" size="icon" onClick={() => removeOption(idx)} className="text-gray-400 hover:text-red-500">
                                            <X className="h-4 w-4" />
                                        </Btn>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}


                        <Button variant="outline" onClick={addOption} className="w-full border-dashed border-gray-300 text-gray-500">
                            <Plus className="mr-2 h-4 w-4" /> Add Option
                        </Button>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export function TrueFalseRenderer({ question, onChange }) {
    const isTrue = question.answer === 'true';
    const isFalse = question.answer === 'false';

    return (
        <div className="grid grid-cols-2 gap-4">
            <div
                onClick={() => onChange('answer', 'true')}
                className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-all ${isTrue ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <span className="text-lg font-bold">TRUE</span>
            </div>
            <div
                onClick={() => onChange('answer', 'false')}
                className={`cursor-pointer p-4 rounded-lg border-2 text-center transition-all ${isFalse ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <span className="text-lg font-bold">FALSE</span>
            </div>
        </div>
    );
}

export function NumericalRenderer({ question, onChange }) {
    return (
        <div className="p-4 border rounded-lg bg-gray-50 flex flex-row items-center gap-4 w-full">
            <div className='space-y-4 flex-1 max-w-md'>
                <Label>Correct Numerical Value</Label>
                <Input
                    type="number"
                    step="any"
                    placeholder="Enter the correct answer (e.g. 4.5)"
                    value={question.answer || ''}
                    onChange={(e) => onChange('answer', e.target.value)}
                    className="text-2xl font-mono h-16 w-full"
                />
            </div>
            <div className='space-y-4 max-w-sm flex-1'>
                <Label>Correct Unit</Label>
                <Input
                    step="any"
                    placeholder="Enter the correct int (e.g. CM, KG, pascal)"
                    value={question.unit || ''}
                    onChange={(e) => onChange('unit', e.target.value)}
                    className="text-2xl font-mono h-16 w-full"
                />

            </div>
        </div>
    );
}

export function FillBlanksRenderer({ question, onChange }) {
    return (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <Label>Correct Answer(s)</Label>
            <div className="flex gap-2">
                <Input
                    placeholder="Correct answer"
                    value={question.answer || ''}
                    onChange={(e) => onChange('answer', e.target.value)}
                />
            </div>
            <p className="text-sm text-gray-500">For multiple blanks, separate answers with a comma.</p>
        </div>
    );
}

export function MatchingRenderer({ question, onChange }) {
    const pairs = question.pairs || [{ left: '', right: '' }, { left: '', right: '' }];

    const updatePair = (index, side, value) => {
        const newPairs = [...pairs];
        newPairs[index][side] = value;
        onChange('pairs', newPairs);
    };

    const addPair = () => {
        onChange('pairs', [...pairs, { left: '', right: '' }]);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-[1fr,auto,1fr,auto] gap-4 items-center mb-2 font-medium text-gray-500 text-sm">
                <div>Column A</div>
                <div></div>
                <div>Column B</div>
                <div></div>
            </div>
            {pairs.map((pair, idx) => (
                <div key={idx} className="grid grid-cols-[1fr,auto,1fr,auto] gap-4 items-center">
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 font-bold text-gray-400 text-xs">{idx + 1}.</span>
                        <Input
                            value={pair.left}
                            onChange={(e) => updatePair(idx, 'left', e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="text-gray-300">→</div>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 font-bold text-gray-400 text-xs">{String.fromCharCode(65 + idx)}.</span>
                        <Input
                            value={pair.right}
                            onChange={(e) => updatePair(idx, 'right', e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => {
                        const newPairs = [...pairs];
                        newPairs.splice(idx, 1);
                        onChange('pairs', newPairs);
                    }}>
                        <X className="h-4 w-4 text-gray-400" />
                    </Button>
                </div>
            ))}
            <Button variant="outline" onClick={addPair} size="sm" className="mt-2">
                <Plus className="mr-2 h-3 w-3" /> Add Pair
            </Button>
        </div>
    );
}

export function DescriptiveRenderer({ question, onChange }) {
    return (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <Label>Sample Answer / Key Points</Label>
            <Textarea
                placeholder="Enter key points or a model answer for evaluation..."
                value={question.answer || ''}
                onChange={(e) => onChange('answer', e.target.value)}
                className="h-32"
            />
            <div className="space-y-2">
                <Label>Word Limit</Label>
                <Input
                    type="number"
                    value={question.word_limit || ''}
                    onChange={(e) => onChange('word_limit', e.target.value)}
                    placeholder="e.g. 200 words"
                    className="w-40"
                />
            </div>
        </div>
    );
}

export function MatrixRenderer({ question, onChange }) {
    const rows = question.rows || [{ id: 'r1', text: '' }, { id: 'r2', text: '' }];
    const cols = question.cols || [{ id: 'c1', text: '' }, { id: 'c2', text: '' }];
    const answers = question.answers || {}; // { r1: ['c1'], r2: ['c2'] }

    const updateRow = (idx, val) => {
        const newRows = [...rows];
        newRows[idx].text = val;
        onChange('rows', newRows);
    };

    const updateCol = (idx, val) => {
        const newCols = [...cols];
        newCols[idx].text = val;
        onChange('cols', newCols);
    };

    const toggleMatch = (rowId, colId) => {
        const currentMatches = answers[rowId] || [];
        const isMatched = currentMatches.includes(colId);
        let newMatches;

        if (isMatched) {
            newMatches = currentMatches.filter(id => id !== colId);
        } else {
            newMatches = [...currentMatches, colId];
        }

        onChange('answers', { ...answers, [rowId]: newMatches });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-500">Row Items (Left)</Label>
                    {rows.map((row, idx) => (
                        <div key={row.id} className="flex gap-2 items-center">
                            <span className="w-6 text-sm font-bold text-gray-400">A{idx + 1}</span>
                            <Input value={row.text} onChange={(e) => updateRow(idx, e.target.value)} placeholder="Row item" />
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => onChange('rows', [...rows, { id: Date.now(), text: '' }])}>
                        <Plus className="h-3 w-3 mr-1" /> Add Row
                    </Button>
                </div>

                <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-500">Column Items (Top)</Label>
                    {cols.map((col, idx) => (
                        <div key={col.id} className="flex gap-2 items-center">
                            <span className="w-6 text-sm font-bold text-gray-400">P{idx + 1}</span>
                            <Input value={col.text} onChange={(e) => updateCol(idx, e.target.value)} placeholder="Col item" />
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => onChange('cols', [...cols, { id: Date.now(), text: '' }])}>
                        <Plus className="h-3 w-3 mr-1" /> Add Col
                    </Button>
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border">
                <Label className="mb-4 block">Correct Matches (Click intersections)</Label>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="p-2"></th>
                                {cols.map((col, cIdx) => (
                                    <th key={col.id} className="p-2 text-sm font-medium text-gray-600">P{cIdx + 1}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rIdx) => (
                                <tr key={row.id}>
                                    <td className="p-2 text-sm font-bold text-gray-600 text-right pr-4">A{rIdx + 1}</td>
                                    {cols.map((col) => {
                                        const isSelected = (answers[row.id] || []).includes(col.id);
                                        return (
                                            <td key={`${row.id}-${col.id}`} className="p-1 text-center">
                                                <div
                                                    onClick={() => toggleMatch(row.id, col.id)}
                                                    className={`w-8 h-8 mx-auto rounded border cursor-pointer flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 hover:border-indigo-400'}`}
                                                >
                                                    {isSelected && <Check className="h-4 w-4" />}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export function SequenceRenderer({ subject, section, question, onChange }: { subject: any, section: any, question: any, onChange: (key: string, value: any) => void }) {
    const items = question.items || [{ id: 1, text: '' }, { id: 2, text: '' }];

    const updateItem = (index: number, key: string, value: any) => {
        const newItems = [...items];
        newItems[index][key] = value;
        onChange('items', newItems);
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === items.length - 1) return;

        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = newItems[targetIndex];
        newItems[targetIndex] = newItems[index];
        newItems[index] = temp;
        onChange('items', newItems);
    };

    const addItem = () => {
        onChange('items', [...items, { id: Date.now(), text: '' }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        onChange('items', newItems);
    };

    return (
        <div className="space-y-3">
            <Label className="text-sm text-gray-500">Define the correct order (Top to Bottom)</Label>
            {items.map((item: any, idx: number) => (
                <div key={item.id} className="flex gap-2 items-center bg-white p-2 rounded border border-gray-200">
                    <div className="flex flex-col gap-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full"
                            disabled={idx === 0}
                            onClick={() => moveItem(idx, 'up')}
                        >
                            <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full"
                            disabled={idx === items.length - 1}
                            onClick={() => moveItem(idx, 'down')}
                        >
                            <ArrowDown className="h-3 w-3" />
                        </Button>
                    </div>
                    <div className="w-8 text-center font-bold text-gray-400">{idx + 1}</div>
                    <Input
                        value={item.text}
                        onChange={(e) => updateItem(idx, 'text', e.target.value)}
                        placeholder="Item content"
                        className="flex-1"
                    />
                    {!!item?.media_path && <SafeImage src={item?.media_path} className='max-w-[150px] border rounded-lg p-2 object-contain'>
                        <LuImageOff />
                    </SafeImage>}
                    <Btn variant={'outline'} asyncClick={async () => {
                        var image = await pickImageUrl({
                            category_name: `${subject.name} | ${section.name} | Q${question.id}`,
                            cropped: true
                        });
                        if (image) {
                            updateItem(idx, 'media_path', image)
                        }
                    }}><LuImage /> Add Image</Btn>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                        <X className="h-4 w-4 text-gray-400" />
                    </Button>
                </div>
            ))}
            <Button variant="outline" onClick={addItem} size="sm">
                <Plus className="mr-2 h-3 w-3" /> Add Item
            </Button>
        </div>
    );
}
