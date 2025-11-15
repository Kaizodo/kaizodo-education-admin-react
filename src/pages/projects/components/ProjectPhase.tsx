import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { LuCircleCheck, LuClock, LuPencil } from 'react-icons/lu';
import { formatDateTime, getColorShade, nameLetter } from '@/lib/utils';
import { getPhaseStatusName, Phase, PhaseStep, ProjectPhaseStatus, ProjectPhaseStatusArray } from '@/pages/orders/OrderDetail';
import { ProjectCommonProps } from '../ProjectDetail';
import { useForm } from '@/hooks/use-form';
import Dropdown from '@/components/common/Dropdown';
import Radio from '@/components/common/Radio';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';
import { ProjectService } from '@/services/ProjectService';
import { msg } from '@/lib/msg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TbProgressBolt } from 'react-icons/tb';



const getStatusColor = (status: ProjectPhaseStatus) => {
    switch (status) {
        case ProjectPhaseStatus.Completed:
            return 'text-green-600 bg-green-100 border-green-400';
        case ProjectPhaseStatus.Progress:
            return 'text-yellow-600 bg-yellow-100 border-yellow-400';
        case ProjectPhaseStatus.Pending:
        default:
            return 'text-gray-500 bg-gray-100 border-gray-300';
    }
};


const PhaseStepEditor = ({ step, setState, state, is_last, is_first }: ProjectCommonProps & { step: PhaseStep, is_last: boolean, is_first: boolean }) => {
    const [saving, setSaving] = useState(false);
    const [form, setValue] = useForm({
        user_id: step.user_id,
        status: step.status == ProjectPhaseStatus.Pending ? ProjectPhaseStatus.Progress : ProjectPhaseStatus.Completed
    });
    const [showForm, setShowForm] = useState(false);
    const dotCenterOffset = '22px';
    const gapBetweenItems = '1.5rem';

    const colorClasses = getStatusColor(step.status);



    const save = async () => {
        setSaving(true);
        var r = await ProjectService.updatePhaseStep({
            ...form,
            project_id: state.project.id,
            phase_step_id: step.id
        });

        if (r.success) {
            setState(r.data);
            setValue('status')(ProjectPhaseStatus.Completed);
            msg.success('Status updated');
            setShowForm(false);
        }
        setSaving(false);
    }

    var user = state.users.find(u => u.id == step.user_id);
    return (
        <div className="mb-6 flex items-stretch">

            <div className="relative w-12 flex-shrink-0">

                <div
                    className={`absolute left-1/2 w-1 bg-gray-200 transform -translate-x-1/2`}
                    style={{
                        top: is_first ? dotCenterOffset : '0',
                        height: is_last
                            ? dotCenterOffset
                            : is_first
                                ? `calc(100% + ${gapBetweenItems} - ${dotCenterOffset})`
                                : `calc(100% + ${gapBetweenItems})`,
                    }}
                />
                <div
                    className={`absolute left-1/2 transform -translate-x-1/2 p-2 rounded-full shadow-lg border-4 z-20  ${colorClasses}`}
                    style={{ top: '0' }}
                >
                    {step.status == ProjectPhaseStatus.Pending && <LuClock />}
                    {step.status == ProjectPhaseStatus.Progress && <TbProgressBolt />}
                    {step.status == ProjectPhaseStatus.Completed && <LuCircleCheck />}
                </div>
            </div>

            <div className={`flex-1 mt-1 p-3 rounded-xl shadow-sm transition-all duration-300 bg-white border border-gray-200 hover:shadow-md`}>
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm text-gray-800">{step.name}</h3>
                    <span className={`text-[0.6rem] font-medium px-2 py-0.5 rounded-full whitespace-nowrap  ${step.status == ProjectPhaseStatus.Completed ? 'bg-green-50 text-green-700' :
                        step.status == ProjectPhaseStatus.Progress ? 'bg-yellow-50 text-yellow-700' :
                            'bg-gray-50 text-gray-700'}`}
                    >
                        {getPhaseStatusName(step.status)}
                    </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                {!!user && <div className="flex items-center bg-white border rounded-lg p-2">
                    <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>
                            {nameLetter(user.first_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1">
                        <div className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                        <span className="text-xs text-gray-500">Email :- {user.email}</span>
                        <span className="text-xs text-gray-500">Mobile : {user.mobile}</span>
                    </div>
                </div>}
                {!!step.remarks && <div className='bg-sky-50 border border-sky-300 p-2 rounded-lg mt-3 text-xs italic'>{step.remarks}</div>}
                {step.has_update && <p className="text-[0.65rem] text-gray-400 mt-2 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Started at : {formatDateTime(step.created_at)}
                </p>}
                {step.has_update && !!step.updated_at && <p className="text-[0.65rem] text-gray-400 mt-2 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Completed at : {formatDateTime(step.updated_at)}
                </p>}
                {!showForm && step.status !== ProjectPhaseStatus.Completed && <Btn variant={'outline'} size={'xs'} onClick={() => setShowForm(true)}><LuPencil />Add Update</Btn>}
                {showForm && <div className='flex flex-col gap-3'>
                    <TextField value={form.remarks} onChange={setValue('remarks')} placeholder='Enter remarks' multiline>Remarks</TextField>

                    {step.status == ProjectPhaseStatus.Pending && <>
                        <Dropdown searchable={false} value={form.user_id} onChange={setValue('user_id')} placeholder='Select a team member' getOptions={async () => {
                            return state.users.filter(u => state.project.project_user_ids.includes(u.id)).map(u => ({
                                id: u.id,
                                name: u.first_name + ' ' + u.last_name,
                            }))
                        }}>Team Member</Dropdown>
                        <Radio size={'sm'} value={form.status} onChange={setValue('status')} options={ProjectPhaseStatusArray.filter(s => s.id !== ProjectPhaseStatus.Pending)}>Status</Radio>
                    </>}
                    <Btn variant={'outline'} size={'sm'} onClick={save} loading={saving}>
                        {form.status == ProjectPhaseStatus.Completed ? 'Mark Completed' : 'Submit'}
                    </Btn>
                </div>}
            </div>
        </div>
    );
}

const PhaseStep = ({ phase, state, setState }: ProjectCommonProps & { phase: Phase }) => {


    return (
        <>
            {!phase.is_active && <div className='flex flex-col justify-center items-center py-6 bg-red-50 border-red-400 border rounded-lg mt-6'>
                <span className='text-sm font-medium'>Not Required</span>
                <span className='text-xs italic'>Project have no requirenments for {phase.name} </span>
            </div>}
            {!!phase.is_active && <div className="relative px-4 py-4">
                {phase.steps.map((step, index) => {
                    return <PhaseStepEditor key={step.id} state={state} setState={setState} is_first={index === 0} is_last={index === phase.steps.length - 1} step={step} />
                })}
            </div>}
        </>

    );
};


const PhaseHeader = ({ phase }: { phase: Phase }) => {

    const backgroundColor = phase.color;
    const color = getColorShade(backgroundColor, 'dark');
    const borderColor = getColorShade(backgroundColor, 'light');
    return (
        <div className="relative flex flex-col items-start flex-1 min-w-full px-1">
            <div
                className={`relative z-10 w-full p-2 rounded-xl shadow-lg border   transition-all duration-300 transform`}
                style={{
                    backgroundColor,
                    borderColor,
                    color
                }}
            >
                <div className="flex items-center space-x-3">

                    <div className="flex-1 overflow-hidden">
                        <h3 className="text-lg font-bold truncate">{phase.name}</h3>
                        <p className="text-xs font-medium opacity-90">
                            {phase.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ProjectPhase({ state, setState }: ProjectCommonProps) {
    return (
        <div className="flex flex-row gap-4 relative">



            {state.phases.map((phase) => (
                <div
                    key={phase.id}
                    className="min-w-[400px] max-w-sm flex-shrink-0 bg-white p-3 rounded-lg border shadow-lg"
                >
                    <PhaseHeader phase={phase} />
                    <PhaseStep state={state} setState={setState} phase={phase} />
                </div>
            ))}
        </div>
    );
};

