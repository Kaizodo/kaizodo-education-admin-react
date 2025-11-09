import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { LuClock, LuPencil } from 'react-icons/lu';
import { getColorShade } from '@/lib/utils';
import { Phase, PhaseStep, ProjectPhaseStatusArray } from '@/pages/orders/OrderDetail';
import { ProjectState } from '../ProjectDetail';
import { useForm } from '@/hooks/use-form';
import Dropdown from '@/components/common/Dropdown';
import Radio from '@/components/common/Radio';
import Btn from '@/components/common/Btn';
import TextField from '@/components/common/TextField';



// Helper function to map status to Tailwind colors
// const getStatusColor = (status: any) => {
//     switch (status) {
//         case 'completed':
//             return 'text-green-600 bg-green-100 border-green-400';
//         case 'in-progress':
//             return 'text-yellow-600 bg-yellow-100 border-yellow-400';
//         case 'pending':
//         default:
//             return 'text-gray-500 bg-gray-100 border-gray-300';
//     }
// };


const PhaseStepEditor = ({ step, state, is_last, is_first }: { state: ProjectState, step: PhaseStep, is_last: boolean, is_first: boolean }) => {
    const [form, setValue] = useForm();
    const [showForm, setShowForm] = useState(false);
    const dotCenterOffset = '22px';
    const gapBetweenItems = '1.5rem';

    const colorClasses = '';

    var status = 'in-progress';
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
                    <LuClock />
                </div>
            </div>

            <div className={`flex-1 mt-1 p-3 rounded-xl shadow-sm transition-all duration-300 bg-white border border-gray-200 hover:shadow-md`}>
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm text-gray-800">{step.name}</h3>
                    <span className={`text-[0.6rem] font-medium px-2 py-0.5 rounded-full whitespace-nowrap  ${status === 'completed' ? 'bg-green-50 text-green-700' :
                        status === 'in-progress' ? 'bg-yellow-50 text-yellow-700' :
                            'bg-gray-50 text-gray-700'}`}
                    >
                        Pending
                    </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                <p className="text-[0.65rem] text-gray-400 mt-2 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Due:
                </p>
                {!showForm && <Btn variant={'outline'} size={'xs'} onClick={() => setShowForm(true)}><LuPencil />Add Update</Btn>}
                {showForm && <div className='flex flex-col gap-3'>
                    <TextField value={form.remarks} onChange={setValue('remarks')} placeholder='Enter remarks' multiline>Remarks</TextField>
                    <Dropdown searchable={false} value={form.user_id} onChange={setValue('user_id')} placeholder='Select a team member' getOptions={async () => {
                        return state.users.filter(u => state.project.project_user_ids.includes(u.id)).map(u => ({
                            id: u.id,
                            name: u.first_name + ' ' + u.last_name,
                        }))
                    }}>Team Member</Dropdown>
                    <Radio size={'sm'} value={form.status} onChange={setValue('status')} options={ProjectPhaseStatusArray}>Status</Radio>
                    <Btn variant={'outline'} size={'sm'}>Submit</Btn>
                </div>}
            </div>
        </div>
    );
}

const PhaseStep = ({ phase, state }: { state: ProjectState, phase: Phase }) => {


    return (
        <>
            {!phase.is_active && <div className='flex flex-col justify-center items-center py-6 bg-red-50 border-red-400 border rounded-lg mt-6'>
                <span className='text-sm font-medium'>Not Required</span>
                <span className='text-xs italic'>Project have no requirenments for {phase.name} </span>
            </div>}
            {!!phase.is_active && <div className="relative px-4 py-4">
                {phase.steps.map((step, index) => {
                    return <PhaseStepEditor key={step.id} state={state} is_first={index === 0} is_last={index === phase.steps.length - 1} step={step} />
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

export default function ProjectPhase({ state }: { state: ProjectState, setState: React.Dispatch<React.SetStateAction<ProjectState | undefined>> }) {
    return (
        <div className="flex flex-row gap-4">


            {state.phases.map((phase) => (
                <div
                    key={phase.id}
                    className="min-w-[400px] max-w-sm flex-shrink-0 bg-white p-3 rounded-lg border shadow-lg"
                >
                    <PhaseHeader phase={phase} />
                    <PhaseStep state={state} phase={phase} />
                </div>
            ))}
        </div>
    );
};

