import AppPage from "@/components/app/AppPage";
import CenterLoading from "@/components/common/CenterLoading";
import { ProjectService } from "@/services/ProjectService";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Phase } from "../orders/OrderDetail";
import { User } from "@/data/user";
import ProjectPhase from "./components/ProjectPhase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDateTime, nameLetter } from "@/lib/utils";
import Note from "@/components/common/Note";
import Btn from "@/components/common/Btn";
import { BiBoltCircle } from "react-icons/bi";
import { msg } from "@/lib/msg";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LuCircleCheck, LuMail, LuPhone } from "react-icons/lu";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
import { useForm } from "@/hooks/use-form";
import { UserOrderService } from "@/services/UserOrderService";
import SuggestEmployee from "@/components/common/suggest/SuggestEmployee";
import { Project } from "@/data/UserOrder";
import { EmployeeService } from "@/services/EmployeeService";
import { Search } from "@/components/ui/search";
import { Checkbox } from "@/components/ui/checkbox";
import Pagination from "@/components/common/Pagination";
import NoRecords from "@/components/common/NoRecords";


export type ProjectState = {
    progress: number,
    total_steps: number,
    completed_steps: number,
    all_completed: boolean,
    project: Project,
    users: User[],
    phases: Phase[]
}

export type ProjectCommonProps = {
    state: ProjectState,
    setState: React.Dispatch<React.SetStateAction<ProjectState | undefined>>
}

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



export default function ProjectDetail() {
    const { internal_reference_number } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [state, setState] = useState<ProjectState>();
    const [starting, setStarting] = useState(false);
    const [finishing, setFinishing] = useState(false);
    const [form, setValue, setForm] = useForm<any>({});
    const [subordindatePaginated, setSubordindatePaginated] = useState<PaginationType<User>>(getDefaultPaginated());
    const [assigningDeploymentManager, setAssigningDeploymentManager] = useState(false);
    const [assigningRelationshipManager, setAssigningRelationshipManager] = useState(false);
    const [assigningTeam, setAssigningTeam] = useState(false);
    const [searchingSubordindates, setSearchingSubordindates] = useState(false);
    const [subordinateFilters, setSubordindateFilter] = useForm<any>({
        debounce: true,
        page: 1,
        keyword: '',
        user_id: state?.project?.deployment_manager_user_id
    });
    const load = async () => {
        if (!internal_reference_number) {
            navigate('/projects');
            return;
        }
        setLoading(true);
        var r = await ProjectService.detail(internal_reference_number);
        if (r.success) {
            setForm(r.data.project);
            setState(r.data);
            setLoading(false);
        } else {
            navigate('/projects');
        }
    }

    const start = async () => {
        setStarting(true);
        msg.confirm('Start project deployment ?', 'Once started its status cannot be changed.', {
            onConfirm: async () => {
                var r = await ProjectService.startProjectDeployment({ project_id: state?.project.id });
                if (r.success) {
                    msg.success('Project deployment started');
                    setState(r.data);
                }
                setStarting(false);
                return r.success;
            },
            onCancel: () => {
                setStarting(false);
            }
        })
    }

    const finish = async () => {
        setFinishing(true);
        msg.confirm('Finish project deployment ?', 'Once finished its status cannot be changed.', {
            onConfirm: async () => {
                var r = await ProjectService.finishProjectDeployment({ project_id: state?.project.id });
                if (r.success) {
                    msg.success('Project deployment finished');
                    setState(r.data);
                }
                setFinishing(false);
                return r.success;
            },
            onCancel: () => {
                setFinishing(false);
            }
        })
    }

    const assignDeploymentManager = async () => {
        setAssigningDeploymentManager(true);
        var r = await UserOrderService.assignDeploymentManager({
            user_id: form.deployment_manager_user_id,
            project_id: state?.project.id
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
            project_id: state?.project.id
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
                    project_id: state?.project.id
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
            user_id: state?.project.deployment_manager_user_id
        });
        if (r.success) {
            setSubordindatePaginated(r.data);
        }
        setSearchingSubordindates(false);
    }



    useEffect(() => {
        load();
    }, [])

    useEffect(() => {
        if (state?.project?.is_deployment_manager_assigned && !state?.project?.is_team_assigned) {
            searchSubordinates();
        }
    }, [state])

    const deployment_manager = state?.users?.find?.(u => u.id == state?.project?.deployment_manager_user_id);
    const relationship_manager = state?.users?.find?.(u => u.id == state?.project?.relationship_manager_user_id);



    return (
        <AppPage
            enableBack={true}
            backRoute={'/projects'}
            title="Project Details"
            subtitle={internal_reference_number}
            actions={<div className="bg-white rounded-lg p-1 border flex flex-col">
                {!!state?.project.is_ready_deployment && <div>
                    <span className="text-sm font-medium">Started :- </span>
                    <span className="text-xs text-gray-400">{formatDateTime(state?.project.deployment_ready_datetime ?? '')}</span>
                </div>}
                {!!state?.project.is_deployment_completed && <div>
                    <span className="text-sm font-medium">Finished :- </span>
                    <span className="text-xs text-gray-400">{formatDateTime(state?.project.deployment_complete_datetime ?? '')}</span>
                </div>}
            </div>}
        >
            {loading && <CenterLoading className="relative h-[400px]" />}
            {!loading && <div className="relative">

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
                    {deployment_manager && <div className='bg-sky-50 border border-sky-300 p-3 rounded-sm flex items-center self-start'>
                        <Avatar className="h-20 w-20 mr-3">
                            <AvatarImage src={deployment_manager.image} />
                            <AvatarFallback>
                                {nameLetter(deployment_manager.first_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-sm font-medium text-gray-900">{deployment_manager.first_name} {deployment_manager.last_name}</div>
                            <div className="text-sm text-gray-500 flex flex-row items-center gap-1">
                                <LuPhone />
                                <span>{deployment_manager.mobile}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex flex-row items-center gap-1">
                                <LuMail />
                                <span>{deployment_manager.email}</span>
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
                    {state && state?.users?.filter(u => state?.project?.project_user_ids?.includes(u.id)).length > 0 && <div className='flex flex-row gap-3 flex-wrap mt-3'>
                        {state?.users.filter(u => state?.project.project_user_ids.includes(u.id)).map(record => <label
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


                    {!state?.project.is_ready_deployment && <Note
                        title="Start Project Deployment"
                        subtitle="Project deployment has not started yet, once deployment is started updates on phases will be allowed"

                    ><Btn variant={'destructive'} size={'sm'} loading={starting} onClick={start}>Start Deployment <BiBoltCircle /></Btn></Note>}
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
                    {!loading && !!state && <>
                        <div className="bg-white border p-3 rounded-lg flex flex-row">
                            <div className="flex flex-row items-center gap-3">
                                {deployment_manager && <div>
                                    <span className='font-bold text-primary'>Deployment Manager</span>
                                    <div className="flex items-center bg-white border rounded-lg p-2">
                                        <Avatar className="h-10 w-10 mr-3">
                                            <AvatarImage src={deployment_manager.image} />
                                            <AvatarFallback>
                                                {nameLetter(deployment_manager.first_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col flex-1">
                                            <div className="text-sm font-medium text-gray-900">{deployment_manager.first_name} {deployment_manager.last_name}</div>
                                            <span className="text-xs text-gray-500">Email :- {deployment_manager.email}</span>
                                            <span className="text-xs text-gray-500">Mobile : {deployment_manager.mobile}</span>
                                        </div>
                                    </div>
                                </div>}
                                {relationship_manager && <div>
                                    <span className='font-bold text-primary'>Relationship Manager</span>
                                    <div className="flex items-center bg-white border rounded-lg p-2">
                                        <Avatar className="h-10 w-10 mr-3">
                                            <AvatarImage src={relationship_manager.image} />
                                            <AvatarFallback>
                                                {nameLetter(relationship_manager.first_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col flex-1">
                                            <div className="text-sm font-medium text-gray-900">{relationship_manager.first_name} {relationship_manager.last_name}</div>
                                            <span className="text-xs text-gray-500">Email :- {relationship_manager.email}</span>
                                            <span className="text-xs text-gray-500">Mobile : {relationship_manager.mobile}</span>
                                        </div>
                                    </div>
                                </div>}
                                <div className="bg-sky-50 border-sky-400 p-2 rounded-lg flex flex-col border">
                                    <span className='font-bold text-primary'>Team Members</span>
                                    <div className=" flex flex-row flex-wrap gap-3">
                                        {state?.users.filter(u => state?.project.project_user_ids.includes(u.id)).map(user => <div key={user.id} className="flex items-center bg-white border rounded-lg p-2">
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
                                        </div>)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-[500px] my-3">
                            {!!state?.all_completed && !state?.project.is_deployment_completed && <Note
                                title="Finish Deployment"
                                subtitle="All steps of the deployment are completed you can now mark project as completed"
                            >
                                <Btn variant={'destructive'} size={'sm'} loading={finishing} onClick={finish}>Finish Deployment <LuCircleCheck /></Btn>
                            </Note>}
                        </div>
                        {!state?.all_completed && !!state?.project.is_ready_deployment && <div className="flex flex-row items-center gap-3 max-w-2xl bg-white rounded-lg p-2">
                            <div className="flex flex-col text-xs">
                                <span>Total Steps :- {state?.total_steps}</span>
                                <span>Completed :- {state?.completed_steps}</span>
                            </div>
                            <div className="flex-1">
                                <Progress value={state?.progress} />
                            </div>
                            <Badge>{state?.progress.toFixed(0)}%</Badge>
                        </div>}

                        <div className={
                            cn("relative w-full", !state?.project.is_ready_deployment && "overflow-hidden")
                        }>
                            {!state?.project.is_ready_deployment && <div className="bg-gray-950 bg-opacity-65 absolute top-0 right-0 left-0 bottom-0   h-full z-50 rounded-lg text-white flex items-center justify-center">

                                <span className="font-medium text-2xl">Project not ready for deployment</span>
                            </div>}
                            <ProjectPhase state={state} setState={setState} />
                        </div>
                    </>}
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
                    {relationship_manager && <div className='bg-sky-50 border border-sky-300 p-3 rounded-sm flex items-center self-start'>
                        <Avatar className="h-20 w-20 mr-3">
                            <AvatarImage src={relationship_manager.image} />
                            <AvatarFallback>
                                {nameLetter(relationship_manager.first_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-sm font-medium text-gray-900">{relationship_manager.first_name} {relationship_manager.last_name}</div>
                            <div className="text-sm text-gray-500 flex flex-row items-center gap-1">
                                <LuPhone />
                                <span>{relationship_manager.mobile}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex flex-row items-center gap-1">
                                <LuMail />
                                <span>{relationship_manager.email}</span>
                            </div>
                        </div>
                    </div>}
                </TimelineItem>

            </div>}

        </AppPage>
    )
}
