import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trash2, Layers } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from '@/hooks/use-form';
import { useParams } from 'react-router-dom';
import SuggestSubject from '@/components/common/suggest/SuggestSubject';
import Btn from '@/components/common/Btn';
import { msg } from '@/lib/msg';
import SuggestSection from '@/components/common/suggest/SuggestSection';

export default function ExamQuestionGroupSetupWizard({ state, onComplete }: { state: any, onComplete: (state: any) => void }) {
    const { id } = useParams<{ id: string }>();
    const [form, setValue] = useForm<any>({
        subjects: state.subjects
    });
    const [loading, setLoading] = useState(true);

    const load = async () => { }

    const save = async () => {
        return new Promise<void>((resolve) => {
            msg.confirm('Confirm Subject Setup', 'Once saved you cannot update or add new subjects so please make sure you have added all required details properly.', {
                onConfirm: async () => {

                },
                onCancel: () => resolve()
            })
        })
    }







    useEffect(() => { }, [id])

    return (
        <div className="max-w-3xl mx-auto w-full py-12 px-4 overflow-y-auto">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900">Setup Question Set</h2>
                <p className="text-gray-500 mt-2">Define the structure of your exam before adding questions.</p>
            </div>

            <Card className="border-0 shadow-xl ring-1 ring-gray-200">
                <CardContent className="p-8">

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="space-y-6">
                            {form.subjects.map((subject: any) => (
                                <div key={subject.id} className="p-2 bg-gray-50 rounded-lg border border-gray-200 relative group">
                                    <Btn
                                        variant="destructive"
                                        size="xs"
                                        onClick={() => {
                                            msg.confirm(`Attention!! \n Remove subject ?`, 'Removing a subject will also remove all added questions so be careful.', {
                                                onConfirm: () => {
                                                    setValue(`subjects[id:${subject.id}]-`)();
                                                }
                                            })
                                        }}
                                        className="absolute top-2 right-4   opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Btn>

                                    <div className="flex items-start   mb-4 font-medium flex-col">
                                        <span className='text-xs font-normal text-gray-600'>Subject</span>
                                        <span>{subject.name}</span>
                                    </div>

                                    <div className="space-y-3 pl-11">
                                        {subject.sections.map((section: any) => (
                                            <div key={section.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                                <Layers className="h-4 w-4 text-gray-400" />
                                                <div className="flex items-start    flex-col">
                                                    <span className='text-xs font-normal text-gray-600'>Section</span>
                                                    <span className='text-sm'>{section.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
                                                    <span>Questions:</span>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={section.total_question}
                                                        onChange={(e) => setValue(`subjects[id:${subject.id}].sections[id:${section.id}].total_question`)(e.target.value)}
                                                        className="h-8 w-20"
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        msg.confirm(`Attention!! \n Remove section ?`, 'Removing a section will also remove all added questions so be careful.', {
                                                            onConfirm: () => {
                                                                setValue(`subjects[id:${subject.id}].sections[id:${section.id}]-`)();
                                                            }
                                                        })


                                                    }}
                                                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}


                                        <div className='flex flex-row items-end gap-3 p-3 bg-sky-50 border-sky-600 border rounded-lg '>
                                            <div className='flex-1'>
                                                <SuggestSection exclude_ids={subject.sections.map((i: any) => i.section_id)} value={form[`subject_${subject.id}_section_id`]} onChange={setValue(`subject_${subject.id}_section_id`)} onSelect={setValue('section')} />
                                            </div>
                                            <Btn variant={'outline'} disabled={!form[`subject_${subject.id}_section_id`]} onClick={() => setValue(`subjects[id:${subject.id}].sections[]`, `subject_${subject.id}_section_id`)({ ...form.section, section_id: form.section.id })}>Add Subject</Btn>
                                        </div>

                                    </div>
                                </div>
                            ))}
                            <div className='flex flex-row items-end gap-3 p-3 bg-green-50 border-green-600 border rounded-lg '>
                                <div className='flex-1'>
                                    <SuggestSubject exclude_ids={form.subjects.map((i: any) => i.id)} value={form.id} onChange={setValue('subject_id')} onSelect={setValue('subject')} />
                                </div>
                                <Btn variant={'outline'} disabled={!form.subject_id} onClick={() => setValue('subjects[]', 'subject_id', 'subject')({ ...form.subject, sections: [] })}>Add Subject</Btn>
                            </div>
                        </div>

                        <div className="flex justify-between pt-6 border-t border-gray-100">

                            <div className="flex gap-3">
                                <Btn
                                    asyncClick={save}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Save & Upload Questions <ArrowRight className="ml-2 h-4 w-4" />
                                </Btn>
                            </div>
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
        </div>
    );
}