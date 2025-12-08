import { useEffect, useState } from 'react';
import {
    ArrowLeft,
    CheckCircle,
    ChevronRight,
    Circle,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ExamQuestionGroupQuestionForm, { QuestionType } from './components/ExamQuestionGroupQuestionForm';
import ExamQuestionGroupQuestionNavigator from './components/ExamQuestionGroupQuestionNavigator';
import CenterLoading from '@/components/common/CenterLoading';
import { useNavigate, useParams } from 'react-router-dom';
import { ExamQuestionGroupService } from '@/services/ExamQuestionGroupService';
import { useOrganizationId } from '@/hooks/use-organization-id';
import { useForm } from '@/hooks/use-form';
import NoRecords from '@/components/common/NoRecords';
import Btn from '@/components/common/Btn';
import { msg } from '@/lib/msg';
import { LuSave, LuWandSparkles } from 'react-icons/lu';
import { Modal } from '@/components/common/Modal';

import AiQuestionGenerator from './components/AiQuestionGenerator';



export default function ExamQuestionGroupEditor() {
    const organization_id = useOrganizationId();
    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [state, setStateValue, setState] = useForm<any>({
        wizard: false,
        questions: [],
        subjects: []
    });

    const navigate = useNavigate();
    const load = async () => {
        setLoading(true);
        var r = await ExamQuestionGroupService.detail({ id, organization_id });
        if (!r.success) {
            navigate(-1);
            return;
        } else {
            var first_subject = r.data.subjects[0];
            var first_section = first_subject?.sections?.[0];
            var first_question = r.data.questions.find((q: any) => q.subject_id == first_subject?.id && q.exam_section_id == first_section?.id);


            setState((s: any) => ({ ...s, ...r.data, current_subject_id: first_subject?.id, current_exam_section_id: first_section?.id, current_question_id: first_question?.id }));
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id && organization_id) {
            load();
        }
    }, [id, organization_id])






    if (loading) {
        return <CenterLoading className="h-screen w-full relative z-10" />
    }

    const currentSubject = state.subjects.find((s: any) => s.id == state.current_subject_id);
    const currentSection = currentSubject?.sections.find((s: any) => s.id == state.current_exam_section_id);
    const currentQuestion = state?.questions.find((q: any) => q.id == state.current_question_id);




    return (
        <div className="h-screen flex flex-col  overflow-hidden">
            {/* Top Bar */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Button>
                    <div>
                        <h2 className="font-semibold text-gray-900">{state?.record?.name}</h2>
                        {!!currentSubject && <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="uppercase tracking-wider font-medium">{currentSubject?.name}</span>
                            <ChevronRight className="h-3 w-3" />
                            <span>{currentSection?.name}</span>
                        </div>}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 mr-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> Completed</span>
                        <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div> Pending</span>
                    </div>

                    <Btn variant={'outline'} size={'sm'} onClick={() => {
                        Modal.show({
                            title: 'Use AI',
                            subtitle: 'Use AI to generate questions',
                            maxWidth: 600,
                            content: () => <AiQuestionGenerator state={state} setStateValue={setStateValue} />
                        })
                    }}><LuWandSparkles />Use AI</Btn>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Structure Navigation */}
                <div className="w-64 border-r border-gray-200 bg-gray-50/50 flex flex-col shrink-0">
                    <div className="p-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Structure</h3>
                        <div className="space-y-6">
                            {state.subjects.map((subject: any) => (
                                <div key={subject.id}>
                                    <button
                                        onClick={() => {

                                            var first_section = subject.sections[0];
                                            var first_question = state.questions.find((q: any) => q.subject_id == subject.id && q.exam_section_id == first_section?.id);

                                            setStateValue('current_subject_id', 'current_exam_section_id', 'current_question_id')(subject.id, first_section?.id, first_question?.id);

                                        }}
                                        className={`text-sm font-medium mb-2 flex items-center gap-2 w-full text-left transition-colors ${state.current_subject_id === subject.id ? 'text-indigo-700' : 'text-gray-700 hover:text-gray-900'
                                            }`}
                                    >
                                        {state.current_subject_id === subject.id && <div className="w-1 h-4 bg-indigo-600 rounded-full" />}
                                        {subject.name}
                                    </button>

                                    {state.current_subject_id === subject.id && (
                                        <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-3">
                                            {subject.sections.map((section: any) => (
                                                <button
                                                    key={section.id}
                                                    onClick={() => {

                                                        var first_question = state.questions.find((q: any) => q.subject_id == subject.id && q.exam_section_id == section?.id);

                                                        setStateValue('current_exam_section_id', 'current_question_id')(section.id, first_question?.id);

                                                    }}
                                                    className={`block text-xs py-1.5 w-full text-left transition-colors ${state.current_exam_section_id === section.id
                                                        ? 'text-indigo-600 font-medium'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                        }`}
                                                >
                                                    {section.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                        </div>


                    </div>

                </div>

                {/* Center - Question Editor */}
                <div className="flex-1 bg-white  flex flex-col">
                    <div className=" p-8   overflow-y-auto flex-1 w-full">
                        {!currentQuestion && <NoRecords title='Select Question' subtitle='Select a question from right side menu to begin with.' />}
                        {!!currentQuestion && <ExamQuestionGroupQuestionForm

                            key={currentQuestion?.id}
                            question_number={state.questions.filter((q: any) => q.subject_id == state.current_subject_id && q.exam_section_id == state.current_exam_section_id).indexOf(currentQuestion) + 1}
                            question={currentQuestion}
                            subject={currentSubject}
                            section={currentSection}
                            onUpdate={q => {
                                switch (q.question_type) {
                                    case QuestionType.MCQ:
                                    case QuestionType.MULTI_SELECT:
                                        q.pairs = null;
                                        q.rows = null;
                                        q.cols = null;
                                        q.items = null;
                                        break;

                                    case QuestionType.SEQUENCE:
                                        q.options = null;
                                        q.pairs = null;
                                        q.rows = null;
                                        q.cols = null;
                                        break;

                                    case QuestionType.TRUE_FALSE:
                                    case QuestionType.FILL_BLANKS:
                                    case QuestionType.NUMERICAL:
                                    case QuestionType.DESCRIPTIVE:
                                        q.options = null;
                                        q.pairs = null;
                                        q.rows = null;
                                        q.cols = null;
                                        q.items = null;
                                        break;

                                    case QuestionType.MATCHING:
                                        q.options = null;
                                        q.rows = null;
                                        q.cols = null;
                                        q.items = null;
                                        break;

                                    case QuestionType.MATRIX:
                                        q.options = null;
                                        q.pairs = null;
                                        q.items = null;
                                        break;
                                }
                                setStateValue(`questions[id:${currentQuestion.id}]`)(q);
                            }}
                        />}
                    </div>
                    <div className="flex items-center justify-end gap-3 p-3 border-t">


                        <Btn
                            onClick={() =>
                                setStateValue(`questions[id:${currentQuestion?.id}].is_completed`)(
                                    !currentQuestion?.is_completed ? 1 : 0
                                )
                            }
                            className={
                                currentQuestion?.is_completed
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-gray-500 hover:bg-gray-600 text-white"
                            }
                        >
                            {currentQuestion?.is_completed ? (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Completed
                                </>
                            ) : (
                                <>
                                    <Circle className="mr-2 h-4 w-4" /> Mark as Done
                                </>
                            )}
                        </Btn>


                        <Btn asyncClick={async () => {
                            var r = await ExamQuestionGroupService.saveQuestion({ ...currentQuestion, organization_id });
                            if (r.success) {
                                var filtered = state.questions.filter((q: any) => q.subject_id == state.current_subject_id && q.exam_section_id == state.current_exam_section_id);
                                var next_index = filtered.indexOf(currentQuestion) + 1;
                                var found = filtered[next_index];
                                if (found) {
                                    setStateValue('current_question_id')(found.id);
                                } else if (filtered[0]) {
                                    setStateValue('current_question_id')(filtered[0].id);
                                }
                                msg.success('Question saved successfuly');
                            }
                            return r.success;
                        }} variant={'outline'}><LuSave /> Save & Next</Btn>
                    </div>
                </div>

                {/* Right Sidebar - Question Navigator */}
                <div className="w-72 border-l border-gray-200 bg-gray-50/30 flex flex-col shrink-0">
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <h3 className="text-sm font-medium text-gray-900">Question Palette</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {currentSubject?.name} - {currentSection?.name}
                        </p>
                    </div>
                    <ScrollArea className="flex-1">
                        <ExamQuestionGroupQuestionNavigator
                            questions={state?.questions.filter((q: any) => q.subject_id == state.current_subject_id && q.exam_section_id == state.current_exam_section_id)}
                            question_id={state.current_question_id}
                            onSelect={setStateValue('current_question_id')}
                        />
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}