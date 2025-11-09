import AppCard from '@/components/app/AppCard';
import Btn from '@/components/common/Btn';
import CenterLoading from '@/components/common/CenterLoading';
import NoRecords from '@/components/common/NoRecords';
import SuggestClass from '@/components/common/suggest/SuggestClass';
import SuggestSection from '@/components/common/suggest/SuggestSection';
import { useSetValue } from '@/hooks/use-set-value';
import { UserService } from '@/services/UserService';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LuLoader } from 'react-icons/lu';

const ClassChip = ({
    classItem,
    user_id,
    onClasses,
}: {
    classItem: any;
    user_id: number;
    onClasses: (classes: any[]) => void;
}) => {
    const [removing, setRemoving] = useState(false);
    const removeClass = async () => {
        if (removing) return;
        setRemoving(true);

        const r = await UserService.unassignClassSection({
            user_id: user_id,
            class_id: classItem.class_id,
            section_id: classItem.section_id,
        });

        if (r.success) {
            onClasses(r.data);
        }

        setRemoving(false);
    };

    const label = classItem.section_name
        ? `${classItem.class_name} - ${classItem.section_name}`
        : `${classItem.class_name}`;

    return (
        <div
            onClick={removeClass}
            className="inline-flex items-center bg-sky-200 hover:bg-sky-300 cursor-pointer select-none rounded-full py-2 px-3 text-sm"
        >
            {label}
            {!removing && <X className="ml-1 w-3 h-3" />}
            {removing && <LuLoader className="ml-1 w-3 h-3 animate-spin" />}
        </div>
    );
};



export default function UserClassCard({ id }: { id: number }) {
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState<any[]>([]);

    const [assignForm, setAssignForm] = useState<any>({
        class_id: 0,
        user_id: id,
    });
    const setAssignValue = useSetValue(setAssignForm);
    const [assigning, setAssigning] = useState(false);

    const assignClass = async () => {
        if (assigning) return;
        setAssigning(true);
        const r = await UserService.assignClassSection(assignForm);
        if (r.success) {
            setClasses(r.data);
        }
        setAssigning(false);
    };

    const load = async () => {
        setLoading(true);

        var r = await UserService.loadAssignedClasses(id);
        if (r.success) {
            setClasses(r.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, [id])


    return (
        <AppCard
            title="Classes"
            actions={
                <div className="flex flex-row gap-3 items-end px-3">
                    <SuggestClass
                        children=""
                        value={assignForm.class_id}
                        onChange={setAssignValue('class_id')}
                    />
                    <SuggestSection
                        children=""
                        value={assignForm?.section_id}
                        onChange={setAssignValue('section_id')}
                        class_id={assignForm.class_id}
                    />
                    <Btn onClick={assignClass} loading={assigning}>
                        Assign
                    </Btn>
                </div>
            }
        >
            {loading && <CenterLoading className="relative h-[400px]" />}
            {!loading && !classes.length && <NoRecords title="No Classes Found" subtitle="Try assigning some classes" />}

            <div className="p-3 flex flex-row gap-3 flex-wrap">
                {classes?.map((classItem: any) => (
                    <ClassChip
                        key={'class_' + classItem.class_id + '_' + (classItem.section_id || '0')}
                        user_id={id}
                        classItem={classItem}
                        onClasses={setClasses}
                    />
                ))}
            </div>
        </AppCard>
    );
}
