import Btn from '@/components/common/Btn';
import SuggestEmployee from '@/components/common/suggest/SuggestEmployee';
import React, { ReactNode, useEffect, useState } from 'react';
import OrderPhase from './OrderPhase';
import { OrderCommonProps, OrderState } from '../OrderDetail';
import { useForm } from '@/hooks/use-form';
import { formatDateTime, nameLetter } from '@/lib/utils';
import { UserOrderService } from '@/services/UserOrderService';
import { msg } from '@/lib/msg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LuArrowRight, LuMail, LuPhone } from 'react-icons/lu';
import { EmployeeService } from '@/services/EmployeeService';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { User } from '@/data/user';
import { useSetValue } from '@/hooks/use-set-value';
import { Search } from '@/components/ui/search';
import Pagination from '@/components/common/Pagination';
import NoRecords from '@/components/common/NoRecords';
import CenterLoading from '@/components/common/CenterLoading';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

// --- 1. Type Definitions ---
interface TimelineStep {
    id: number;
    title: string;
    date?: string;
    description: string;
    status: 'completed' | 'in-progress' | 'upcoming';
}

interface TimelineItemProps {
    item: TimelineStep;
    isLast: boolean;
    children?: ReactNode
}


// --- 3. Timeline Item Component ---
const TimelineItem: React.FC<TimelineItemProps> = ({ children, item, isLast }) => {
    // Define Tailwind classes based on the item's status
    const statusClasses = {
        'completed': 'bg-emerald-500 ring-emerald-300',
        'in-progress': 'bg-sky-500 ring-sky-300 animate-pulse',
        'upcoming': 'bg-gray-400 ring-gray-200',
    };

    const lineClasses = {
        'completed': 'bg-emerald-500',
        'in-progress': 'bg-sky-500', // Line segment below an in-progress item is usually upcoming/neutral
        'upcoming': 'bg-gray-300',
    };

    // Determine line segment color based on the current item's status
    // The line segment connects the current item to the next one, so it should reflect the *next* status if not completed.
    const connectingLineColor = item.status === 'completed' ? lineClasses.completed : lineClasses.upcoming;

    return (
        <div className="flex relative">
            {/* Vertical Line */}
            {!isLast && (
                <div
                    className={`absolute left-[13px] top-4 w-0.5 h-full ${connectingLineColor}`}
                    aria-hidden="true"
                />
            )}

            {/* Circle/Dot Indicator */}
            <div className="flex flex-col justify-start items-center mr-6">
                <div
                    className={`w-7 h-7 rounded-full border-4 ring-8 z-10 
          ${statusClasses[item.status]} 
          ${item.status === 'in-progress' ? 'border-sky-700' : 'border-white'}`}
                >
                    {item.status === 'completed' && (
                        // Checkmark Icon
                        <svg
                            className="w-full h-full text-white p-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    )}
                </div>
            </div>

            {/* Content Card */}
            <div className="flex-grow pb-8">
                <div className="p-5 bg-white rounded-xl shadow-lg transition duration-300 hover:shadow-xl">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-xl text-gray-800 leading-tight mb-1">
                            {item.title}
                        </h3>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap 
              ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : ''}
              ${item.status === 'in-progress' ? 'bg-sky-100 text-sky-700' : ''}
              ${item.status === 'upcoming' ? 'bg-gray-100 text-gray-600' : ''}
            `}>
                            {item.status.toUpperCase().replace('-', ' ')}
                        </span>
                    </div>
                    {!!item.date && <p className="text-sm text-gray-500 mb-3">{formatDateTime(item.date)}</p>}
                    {!!item.description && <p className="text-gray-700">{item.description}</p>}
                    {children}
                </div>
            </div>
        </div>
    );
};


export default function OrderStatusEditor({ state, setState }: OrderCommonProps) {
    const [form, setValue, setForm] = useForm<OrderState["project"]>(state.project);

    const [subordindatePaginated, setSubordindatePaginated] = useState<PaginationType<User>>(getDefaultPaginated());

    const [assigningDeploymentManager, setAssigningDeploymentManager] = useState(false);
    const [assigningRelationshipManager, setAssigningRelationshipManager] = useState(false);
    const [assigningTeam, setAssigningTeam] = useState(false);
    const [searchingSubordindates, setSearchingSubordindates] = useState(false);
    const [subordinateFilters, setSubordindateFilters] = useState<any>({
        debounce: true,
        page: 1,
        keyword: '',
        user_id: state?.project?.deployment_manager_user_id
    });
    const setSubordindateFilter = useSetValue(setSubordindateFilters);


    const assignDeploymentManager = async () => {
        setAssigningDeploymentManager(true);
        var r = await UserOrderService.assignDeploymentManager({
            user_id: form.deployment_manager_user_id,
            project_id: state.project.id
        });
        if (r.success) {
            setState(s => (s ? {
                ...s,
                project: r.data.project,
                users: r.data.users
            } : s));
            setForm(r.data.project);
            msg.success('Manager is assigned');
        }
        setAssigningDeploymentManager(false);
    }

    const assignRelationshipManager = async () => {
        setAssigningRelationshipManager(true);
        var r = await UserOrderService.assignRelationshipManager({
            user_id: form.relationship_manager_user_id,
            project_id: state.project.id
        });
        if (r.success) {
            setState(s => (s ? {
                ...s,
                project: r.data.project,
                users: r.data.users
            } : s));
            setForm(r.data.project);
            msg.success('Manager is assigned');
        }
        setAssigningRelationshipManager(false);
    }

    const assignTeam = async () => {

        setAssigningTeam(true);
        msg.confirm('Assign team ?', 'Once team is assigned it cannot be undone', {
            onConfirm: async () => {
                var r = await UserOrderService.assignTeam({
                    user_ids: form.project_user_ids,
                    project_id: state.project.id
                });
                if (r.success) {
                    setState(s => (s ? {
                        ...s,
                        project: r.data.project,
                        users: r.data.users
                    } : s));
                    setForm(r.data.project);
                    msg.success('Team is assigned');
                }
                setAssigningTeam(false);
                return r.success;
            },
            onCancel: () => {
                setAssigningTeam(false);
            }
        })

    }

    const searchSubordinates = async () => {
        setSearchingSubordindates(true);
        var r = await EmployeeService.searchSubordinates({
            ...subordinateFilters,
            user_id: state.project.deployment_manager_user_id
        });
        if (r.success) {
            setSubordindatePaginated(r.data);
        }
        setSearchingSubordindates(false);
    }


    useEffect(() => {
        if (state?.project?.is_deployment_manager_assigned && !state?.project?.is_team_assigned) {
            searchSubordinates();
        }
    }, [state])


    var deploymentManager = state?.users?.find?.(u => u.id === state?.project?.deployment_manager_user_id) ?? undefined;
    var relationshipManager = state?.users?.find?.(u => u.id === state?.project?.relationship_manager_user_id) ?? undefined;

    return (
        <div className="relative">

            <TimelineItem
                item={{
                    id: 1,
                    title: 'Assign Manager',
                    date: form.deployment_manager_assigned_datetime,
                    description: 'Assign a manager who will be handling deployment process',
                    status: form.is_deployment_manager_assigned ? 'completed' : 'in-progress',
                }}
                isLast={false}
            >
                {!form.is_deployment_manager_assigned && <div className='max-w-sm border space-y-3 p-3 rounded-sm bg-sky-50 border-sky-300 mt-3'>
                    <SuggestEmployee value={form.deployment_manager_user_id} onChange={setValue('deployment_manager_user_id')} placeholder='Select manager' is_manager={1}>Select a manager</SuggestEmployee>
                    <Btn loading={assigningDeploymentManager} onClick={assignDeploymentManager} disabled={!form.deployment_manager_user_id}>Assign Manager</Btn>
                </div>}
                {deploymentManager && <div className='bg-sky-50 border border-sky-300 p-3 rounded-sm flex items-center self-start'>
                    <Avatar className="h-20 w-20 mr-3">
                        <AvatarImage src={deploymentManager.image} />
                        <AvatarFallback>
                            {nameLetter(deploymentManager.first_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="text-sm font-medium text-gray-900">{deploymentManager.first_name} {deploymentManager.last_name}</div>
                        <div className="text-sm text-gray-500 flex flex-row items-center gap-1">
                            <LuPhone />
                            <span>{deploymentManager.mobile}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex flex-row items-center gap-1">
                            <LuMail />
                            <span>{deploymentManager.email}</span>
                        </div>
                    </div>
                </div>}
            </TimelineItem>
            <TimelineItem
                item={{
                    id: 1,
                    title: 'Assign Team',
                    date: form.team_assigned_datetime,
                    description: 'Assign team members who will be working on the project',
                    status: form.is_team_assigned ? 'completed' : (form.is_deployment_manager_assigned ? 'in-progress' : 'upcoming'),
                }}
                isLast={false}
            >
                {state.users.filter(u => state.project.project_user_ids.includes(u.id)).length > 0 && <div className='flex flex-row gap-3 flex-wrap mt-3'>
                    {state.users.filter(u => state.project.project_user_ids.includes(u.id)).map(record => <label
                        key={record.id}
                        className="flex items-center bg-white border rounded-lg py-1 px-2 gap-2">

                        <Avatar className="h-16 w-16  ">
                            <AvatarImage src={record.image} />
                            <AvatarFallback>
                                {nameLetter(record.first_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <div className="text-sm font-medium text-gray-900">{record.first_name} {record.last_name}</div>
                            <div className="flex flex-col gap-1 text-sm">
                                {!!record.email && <div className="text-xs text-gray-500 flex flex-row items-center gap-2"><LuMail />{record.email}</div>}
                                {!!record.mobile && <div className="text-xs text-gray-500 flex flex-row items-center gap-2"><LuPhone />{record.mobile}</div>}
                            </div>
                        </div>

                    </label>)}
                </div>}

                {!form.is_team_assigned && !!form.is_deployment_manager_assigned && <>
                    <div className='flex flex-col gap-3 bg-sky-50 border-sky-300 p-3 rounded-sm border'>

                        <div>
                            <Search placeholder='Search subordindates' value={subordinateFilters.keyword} onChange={e => setSubordindateFilter('keyword', 'debounce')(e.target.value, true)} />
                        </div>
                        {!!searchingSubordindates && <CenterLoading className='relative h-[400px]' />}
                        <div className='flex flex-row gap-3 flex-wrap'>
                            {!searchingSubordindates && subordindatePaginated.records.map((record) => {
                                var checked = !!form?.project_user_ids?.find?.((i: number) => i === record.id);
                                return (<label
                                    key={record.id}
                                    className="flex items-center bg-white border rounded-lg py-1 px-2 gap-2">
                                    <Checkbox checked={checked} onCheckedChange={c => {
                                        if (c) {
                                            setValue('project_user_ids')([...(form?.project_user_ids ?? []), record.id]);
                                        } else {
                                            setValue('project_user_ids')((form?.project_user_ids ?? []).filter((i: number) => i !== record.id));
                                        }
                                    }} />
                                    <Avatar className="h-16 w-16  ">
                                        <AvatarImage src={record.image} />
                                        <AvatarFallback>
                                            {nameLetter(record.first_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='flex-1'>
                                        <div className="text-sm font-medium text-gray-900">{record.first_name} {record.last_name}</div>
                                        <div className="flex flex-col gap-1 text-sm">
                                            {!!record.email && <div className="text-xs text-gray-500 flex flex-row items-center gap-2"><LuMail />{record.email}</div>}
                                            {!!record.mobile && <div className="text-xs text-gray-500 flex flex-row items-center gap-2"><LuPhone />{record.mobile}</div>}
                                        </div>
                                    </div>

                                </label>);
                            })}
                        </div>
                        {!searchingSubordindates && subordindatePaginated.records.length == 0 && <NoRecords title='No Subordinates Found' subtitle='Try assigning some surborindates or adjusting some filters' />}
                        <Pagination className="p-3" paginated={subordindatePaginated} onChange={(page) => setSubordindateFilter('page', 'debounce')(page, false)} />

                    </div>
                    <div className=' flex flex-row gap-4 items-center mt-3'>
                        <span className='text-sm '>{(form?.project_user_ids ?? []).length} Selected</span>
                        <Btn disabled={(form?.project_user_ids ?? []).length == 0} size={'sm'} loading={assigningTeam} onClick={assignTeam}>Assign Team</Btn>
                    </div>
                </>}
            </TimelineItem>
            <TimelineItem
                item={{
                    id: 1,
                    title: 'Ready for deployment',
                    date: form.deployment_ready_datetime,
                    description: 'Deployment phase will begin from here',
                    status: form.is_ready_deployment ? 'completed' : (form.is_team_assigned ? 'in-progress' : 'upcoming'),
                }}
                isLast={false}
            >
                {!!form.is_team_assigned && <div className='flex flex-col gap-1 items-start'>
                    <span className='font-bold text-primary text-lg'>{state.project.internal_reference_number}</span>
                    <Link to={'/projects/' + state.project.internal_reference_number}>
                        <Btn variant={'outline'} size={'sm'}>View Project <LuArrowRight /></Btn>
                    </Link>
                </div>}
            </TimelineItem>
            <TimelineItem
                item={{
                    id: 1,
                    title: 'Deployment Phase',
                    date: form.deployment_phase_datetime,
                    description: 'Deployment phases',
                    status: form.is_deployment_completed ? 'completed' : (form.is_ready_deployment ? 'in-progress' : 'upcoming'),
                }}
                isLast={false}
            >
                <OrderPhase state={state} setState={setState} />
            </TimelineItem>
            <TimelineItem
                item={{
                    id: 1,
                    title: 'Deployment Completed',
                    date: form.deployment_complete_datetime,
                    description: 'Deployment phases',
                    status: form.is_deployment_completed ? 'completed' : (form.is_deployment_phase ? 'in-progress' : 'upcoming'),
                }}
                isLast={false}
            />
            <TimelineItem
                item={{
                    id: 1,
                    title: 'Assign Relationship Manager',
                    date: form.relationship_manager_assigned_datetime,
                    description: 'Assign a relationship manager who will handle after sale service requests',
                    status: form.is_relationship_manager_assigned ? 'completed' : (form.is_deployment_completed ? 'in-progress' : 'upcoming'),
                }}
                isLast={true}
            >
                {!!form.is_deployment_completed && !form.is_relationship_manager_assigned && <div className='max-w-sm border space-y-3 p-3 rounded-sm bg-sky-50 border-sky-300 mt-3'>
                    <SuggestEmployee is_manager={1}
                        value={form.relationship_manager_user_id}
                        onChange={setValue('relationship_manager_user_id')}
                        placeholder='Select manager'
                    >Relationship Manager</SuggestEmployee>
                    <Btn loading={assigningRelationshipManager} onClick={assignRelationshipManager} disabled={!form.relationship_manager_user_id}>Assign Manager</Btn>
                </div>}
                {relationshipManager && <div className='bg-sky-50 border border-sky-300 p-3 rounded-sm flex items-center self-start'>
                    <Avatar className="h-20 w-20 mr-3">
                        <AvatarImage src={relationshipManager.image} />
                        <AvatarFallback>
                            {nameLetter(relationshipManager.first_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="text-sm font-medium text-gray-900">{relationshipManager.first_name} {relationshipManager.last_name}</div>
                        <div className="text-sm text-gray-500 flex flex-row items-center gap-1">
                            <LuPhone />
                            <span>{relationshipManager.mobile}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex flex-row items-center gap-1">
                            <LuMail />
                            <span>{relationshipManager.email}</span>
                        </div>
                    </div>
                </div>}
            </TimelineItem>

        </div>
    );
};

