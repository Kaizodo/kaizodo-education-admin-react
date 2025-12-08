
import { useEffect, useState } from 'react';
import { useSetValue } from '@/hooks/use-set-value';
import { ModalBody, ModalFooter } from '@/components/common/Modal';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import CenterLoading from '@/components/common/CenterLoading';
import { ApiResponseType } from '@/lib/api';
import { msg } from '@/lib/msg';
import { ExamService } from '@/services/ExamService';
import { useOrganizationId } from '@/hooks/use-organization-id';
import SuggestExamCategory from '@/components/common/suggest/SuggestExamCategory';
import { Input } from '@/components/ui/input';
import { Layers, Trash2 } from 'lucide-react';
import SuggestSection from '@/components/common/suggest/SuggestSection';
import SuggestSubject from '@/components/common/suggest/SuggestSubject';
import Radio from '@/components/common/Radio';
import { ExamTheme, ExamTypeArray } from '@/data/Exam';
import Dropdown from '@/components/common/Dropdown';

interface Props {
    id?: number,
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export default function ExamEditorDialog({ id, onSuccess, onCancel }: Props) {
    const organization_id = useOrganizationId();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<any>({
        subjects: []
    });
    const setValue = useSetValue(setForm);

    const getDetail = async () => {
        if (!id) {
            onCancel();
            return;
        }
        setLoading(true);
        var r = await ExamService.detail({ id, organization_id });
        if (r.success) {
            setForm((f: any) => ({ ...f, ...r.data }));
            setLoading(false);
        }
    }

    const save = async () => {
        setSaving(true);
        let r: ApiResponseType;
        if (id) {
            r = await ExamService.update({ ...form, organization_id });
        } else {
            r = await ExamService.create({ ...form, organization_id });
        }
        if (r.success) {
            msg.success(id ? 'Record updated successfully' : 'Record created successfully');
            onSuccess(r.data);
        }
        setSaving(false);
    }

    useEffect(() => {
        if (id) {
            getDetail();
        } else {
            setLoading(false);
        }
    }, [id])


    return (
        <>
            <ModalBody className='relative'>
                {!!loading && <CenterLoading className='absolute z-[50]' />}
                <SuggestExamCategory disabled={!!form.id} value={form.exam_category_id} onChange={setValue('exam_category_id')} selected={{ id: form.exam_category_id, name: form.exam_category_name }} />
                <TextField value={form.name} onChange={setValue('name')} placeholder='Enter name'>Name</TextField>
                <TextField value={form.description} onChange={setValue('description')} placeholder='Enter description' multiline>Description</TextField>
                <Radio value={form.theme} onChange={setValue('theme')} options={[{ id: ExamTheme.ION, name: 'ION' }, { id: ExamTheme.NTA, name: 'NTA' }]}>Theme</Radio>

                <div className='grid grid-cols-2 gap-3'>
                    <TextField type="number" min={0} value={form.duration_minutes} onChange={setValue('duration_minutes')} placeholder='Enter duration in minutes'>Duration(Minutes)</TextField>
                    <Dropdown
                        disabled={!!form.id}
                        placeholder='Select exam type'
                        value={form.exam_type}
                        onChange={setValue('exam_type')}
                        getOptions={async () => ExamTypeArray} selected={ExamTypeArray.find(i => i.id == form.exam_type)}
                    >Exam Type</Dropdown>

                </div>
                <div className="space-y-6">
                    {form.subjects.map((subject: any) => (
                        <div key={subject.id} className="p-2 bg-gray-50 rounded-lg border border-gray-200 relative group">
                            {!form.id && <Btn
                                variant="destructive"
                                size="xs"
                                onClick={() => setValue(`subjects[id:${subject.id}]-`)()}
                                className="absolute top-2 right-4   opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Btn>}

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
                                            {!!form.id && <span>{section.total_question}</span>}
                                            {!form.id && <Input
                                                type="number"
                                                min="1"
                                                value={section.total_question}
                                                onChange={(e) => setValue(`subjects[id:${subject.id}].sections[id:${section.id}].total_question`)(e.target.value)}
                                                className="h-8 w-20"
                                            />}
                                        </div>
                                        {!form.id && <Btn
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setValue(`subjects[id:${subject.id}].sections[id:${section.id}]-`)()}
                                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Btn>}
                                    </div>
                                ))}

                                {!form.id &&
                                    <div className='flex flex-row items-end gap-3 p-3 bg-sky-50 border-sky-600 border rounded-lg '>
                                        <div className='flex-1'>
                                            <SuggestSection exclude_ids={subject.sections.map((i: any) => i.section_id)} value={form[`subject_${subject.id}_section_id`]} onChange={setValue(`subject_${subject.id}_section_id`)} onSelect={setValue('section')} />
                                        </div>
                                        <Btn variant={'outline'} disabled={!form[`subject_${subject.id}_section_id`]} onClick={() => setValue(`subjects[id:${subject.id}].sections[]`, `subject_${subject.id}_section_id`)({ ...form.section, section_id: form.section.id })}>Add Subject</Btn>
                                    </div>}

                            </div>
                        </div>
                    ))}
                    {!form.id && <div className='flex flex-row items-end gap-3 p-3 bg-green-50 border-green-600 border rounded-lg '>
                        <div className='flex-1'>
                            <SuggestSubject exclude_ids={form.subjects.map((i: any) => i.id)} value={form.subject_id} onChange={setValue('subject_id')} onSelect={setValue('subject')} />
                        </div>
                        <Btn variant={'outline'} disabled={!form.subject_id} onClick={() => setValue('subjects[]', 'subject_id', 'subject')({ ...form.subject, sections: [] })}>Add Subject</Btn>
                    </div>}
                </div>
            </ModalBody>
            {!loading && <ModalFooter className='gap-4'>
                <Btn onClick={onCancel} variant={'outline'}>Cancel</Btn>
                <Btn onClick={save} loading={saving} disabled={!form.subjects.length}>Save Details</Btn>
            </ModalFooter>}

        </>
    );
};

