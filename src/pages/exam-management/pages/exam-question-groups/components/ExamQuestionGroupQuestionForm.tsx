import {
    CheckCircle,
    AlignLeft,
    ListChecks,
    Table2,
} from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    MCQRenderer,
    TrueFalseRenderer,
    FillBlanksRenderer,
    MatchingRenderer,
    NumericalRenderer,
    DescriptiveRenderer,
    MatrixRenderer,
    SequenceRenderer
} from './QuestionRenderers';


import Dropdown from '@/components/common/Dropdown';
import SuggestChapter from '@/components/common/suggest/SuggestChapter';
import TextField from '@/components/common/TextField';
import { LuImageMinus, LuImageOff, LuImagePlus } from 'react-icons/lu';
import Btn from '@/components/common/Btn';
import { pickImageUrl } from '@/components/common/SimpleMediaPicker';
import SafeImage from '@/components/common/SafeImage';


export const enum QuestionType {
    MCQ = 0,
    MULTI_SELECT = 1,
    FILL_BLANKS = 2,
    TRUE_FALSE = 3,
    MATCHING = 4,
    NUMERICAL = 5,
    DESCRIPTIVE = 6,
    ASSERTION = 7,
    MATRIX = 8,
    SEQUENCE = 9,
}




const QUESTION_TYPES = [
    { id: QuestionType.MCQ, name: 'Multiple Choice', icon: ListChecks },
    { id: QuestionType.MULTI_SELECT, name: 'Multiple Answer', icon: CheckCircle },
    { id: QuestionType.FILL_BLANKS, name: 'Fill in Blanks', icon: AlignLeft },
    { id: QuestionType.TRUE_FALSE, name: 'True / False', icon: CheckCircle },
    { id: QuestionType.MATCHING, name: 'Column Matching', icon: Table2 },
    { id: QuestionType.NUMERICAL, name: 'Numerical / Integer', icon: Table2 },
    { id: QuestionType.DESCRIPTIVE, name: 'Descriptive', icon: AlignLeft },
    { id: QuestionType.ASSERTION, name: 'Assertion Reason', icon: ListChecks },
    { id: QuestionType.MATRIX, name: 'Matrix / Table', icon: Table2 },
    { id: QuestionType.SEQUENCE, name: 'Ordering / Sequence', icon: ListChecks },
];



export default function ExamQuestionGroupQuestionForm({ subject, section, question_number, question, onUpdate }: { subject: any, section: any, question_number: number, question: any, onUpdate: (question: any) => void }) {

    const handleChange = (field: any, value: any) => {
        onUpdate({ ...question, [field]: value });
    };

    const renderTypeEditor = () => {
        switch (Number(question?.question_type)) {
            case QuestionType.MCQ:
            case QuestionType.MULTI_SELECT:
            case QuestionType.ASSERTION:
                return (
                    <MCQRenderer
                        subject={subject}
                        section={section}
                        question={question}
                        onChange={handleChange}
                        multiSelect={question?.question_type === QuestionType.MULTI_SELECT}
                    />
                );

            case QuestionType.TRUE_FALSE:
                return <TrueFalseRenderer question={question} onChange={handleChange} />;

            case QuestionType.FILL_BLANKS:
                return <FillBlanksRenderer question={question} onChange={handleChange} />;

            case QuestionType.MATCHING:
                return <MatchingRenderer question={question} onChange={handleChange} />;

            case QuestionType.NUMERICAL:
                return <NumericalRenderer question={question} onChange={handleChange} />;

            case QuestionType.DESCRIPTIVE:
                return <DescriptiveRenderer question={question} onChange={handleChange} />;

            case QuestionType.MATRIX:
                return <MatrixRenderer question={question} onChange={handleChange} />;

            case QuestionType.SEQUENCE:
                return <SequenceRenderer
                    subject={subject}
                    section={section}
                    question={question}
                    onChange={handleChange} />;

            default:
                return (
                    <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        This question type editor is under construction.
                    </div>
                );
        }
    };


    return (
        <div className="space-y-6 animate-in fade-in duration-300">



            <div className=' bg-gray-50 p-4   rounded-lg border border-gray-100 flex flex-col gap-3'>

                <div className="flex items-end gap-3">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">
                            {question_number}
                        </div>
                        <Dropdown
                            searchable={false}
                            value={question?.question_type}
                            onChange={(val) => {
                                handleChange('question_type', val);

                            }}
                            placeholder='Select question type'
                            selected={QUESTION_TYPES.find(q => q.id == question?.question_type)}
                            getOptions={async () => QUESTION_TYPES}
                        >Question Type</Dropdown>
                        <SuggestChapter
                            value={question?.chapter_id}
                            onChange={(val) => handleChange('chapter_id', val)}
                            subject_id={question?.subject_id}
                            selected={{ id: question?.chapter_id, name: question?.chapter_name }}
                        />

                    </div>

                    <div className="flex items-center gap-4 ms-auto max-w-[150px]">
                        <TextField
                            type="number"
                            value={question?.positive_marks}
                            onChange={(e) => handleChange('positive_marks', parseFloat(e))}
                            className="text-center pe-0"
                        >Marks</TextField>
                        <TextField
                            type="number"
                            value={question?.negative_marks}
                            onChange={(e) => handleChange('negative_marks', parseFloat(e))}
                            className="text-red-500 text-center pe-0"
                        ><span className='text-red-500'>Negative</span></TextField>

                    </div>
                </div>

            </div>



            {/* Question Text */}
            <div className="space-y-2">
                <Label className="text-base font-medium">Question Text</Label>
                <Textarea
                    placeholder="Type your question here... (Supports Markdown)"
                    value={question?.question}
                    onChange={(e) => handleChange('question', e.target.value)}
                    className="min-h-[120px] text-lg p-4 font-serif leading-relaxed resize-y"
                />
                <Btn variant="outline" asyncClick={async () => {
                    var image = await pickImageUrl({
                        category_name: `${subject.name} | ${section.name} | Q${question.id}`,
                        cropped: true
                    });
                    if (image) {
                        handleChange('media_path', image)
                    }
                }}>{!!question?.media_path ? <><LuImageMinus /> Change Image</> : <><LuImagePlus /> Add Image</>}</Btn>
                {!!question?.media_path && <SafeImage src={question?.media_path} className='max-w-[150px] border rounded-lg p-2 object-contain'>
                    <LuImageOff />
                </SafeImage>}
            </div>

            {/* Dynamic Answer Section */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Answer & Options</Label>

                </div>

                <div className="bg-white rounded-lg">
                    {renderTypeEditor()}
                </div>
            </div>

            {/* Explanation */}
            <div className="space-y-2 pt-6 border-t border-gray-100">
                <Label className="text-sm font-medium text-gray-600">Solution / Explanation (Optional)</Label>
                <Textarea
                    placeholder="Explain the correct answer..."
                    value={question?.explanation}
                    onChange={(e) => handleChange('explanation', e.target.value)}
                    className="h-24 bg-gray-50/50"
                />
            </div>

            {/* Status Toggle */}

        </div>
    );
}