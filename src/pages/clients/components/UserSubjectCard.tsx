import AppCard from '@/components/app/AppCard';
import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import NoRecords from '@/components/common/NoRecords';
import SuggestSubject from '@/components/common/suggest/SuggestSubject';
import { useSetValue } from '@/hooks/use-set-value';
import { UserService } from '@/services/UserService';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react'
import { LuLoader } from 'react-icons/lu';


const SubjectChip = ({ subject, onSubjects, user_id }: { subject: any, user_id: number, onSubjects: (subjects: any[]) => void }) => {
    const [removing, setRemoving] = useState(false);
    const removeSubject = async () => {
        if (removing) {
            return;
        }
        setRemoving(true);
        var r = await UserService.unassignSubject({
            subject_id: subject.id,
            user_id: user_id
        });
        if (r.success) {
            onSubjects(r.data);
        }
        setRemoving(false);
    }
    return (<div
        onClick={removeSubject}
        key={'subject' + subject.id}
        className="inline-flex items-center bg-sky-200 hover:bg-sky-300 cursor-pointer select-none rounded-full py-2 px-3 text-sm"
    >
        {subject.name}
        {!removing && <X className="ml-1 w-3 h-3" />}
        {removing && <LuLoader className="ml-1 w-3 h-3 animate-spin" />}
    </div>);
}


export default function UserSubjectCard({ id }: { id: number }) {
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState<any[]>([]);

    const load = async () => {
        setLoading(true);

        var r = await UserService.loadAssignedSubjects(id);
        if (r.success) {
            setSubjects(r.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, [id])

    return (
        <AppCard title='Subjects' actions={(() => {
            const [assignForm, setAssignForm] = useState({
                subject_id: 0,
                user_id: id
            });
            const setAssignValue = useSetValue(setAssignForm);
            const [assigning, setAssigning] = useState(false);
            const assignSubject = async () => {
                setAssigning(true);
                var r = await UserService.assignSubject(assignForm);
                if (r.success) {
                    setSubjects(r.data);
                }
                setAssigning(false);
            }
            return (<div className='flex flex-row gap-3 items-end px-3'>
                <SuggestSubject children='' value={assignForm.subject_id} onChange={setAssignValue('subject_id')} />
                <Btn onClick={assignSubject} loading={assigning}>Assign</Btn>
            </div>)
        })()}>
            {loading && <CenterLoading className="relative h-[400px]" />}

            {!loading && !subjects.length && <NoRecords title='No Subjects Found' subtitle='Try assigning some subjects' />}
            {!loading && <div className='p-3 flex flex-row gap-3 flex-wrap'>
                {subjects.map((subject: any) => <SubjectChip key={'subject_' + subject.id} user_id={id} subject={subject} onSubjects={setSubjects} />)}
            </div>}
        </AppCard>
    )
}
