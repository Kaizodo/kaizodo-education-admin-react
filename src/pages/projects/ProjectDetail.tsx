import AppPage from "@/components/app/AppPage";
import CenterLoading from "@/components/common/CenterLoading";
import { ProjectService } from "@/services/ProjectService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Phase, Project } from "../orders/OrderDetail";
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
import { LuCircleCheck } from "react-icons/lu";


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

export default function ProjectDetail() {
    const { internal_reference_number } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [state, setState] = useState<ProjectState>();
    const [starting, setStarting] = useState(false);
    const [finishing, setFinishing] = useState(false);

    const load = async () => {
        if (!internal_reference_number) {
            navigate('/projects');
            return;
        }
        setLoading(true);
        var r = await ProjectService.detail(internal_reference_number);
        if (r.success) {
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


    useEffect(() => {
        load();
    }, [])

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
                                {state.users.filter(u => state.project.project_user_ids.includes(u.id)).map(user => <div key={user.id} className="flex items-center bg-white border rounded-lg p-2">
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

                {!!state.all_completed && !state.project.is_deployment_completed && <Note
                    title="Finish Deployment"
                    subtitle="All steps of the deployment are completed you can now mark project as completed"

                ><Btn variant={'destructive'} size={'sm'} loading={finishing} onClick={finish}>Finish Deployment <LuCircleCheck /></Btn></Note>}
                {!state.all_completed && !!state.project.is_ready_deployment && <div className="flex flex-row items-center gap-3 max-w-2xl bg-white rounded-lg p-2">
                    <div className="flex flex-col text-xs">
                        <span>Total Steps :- {state.total_steps}</span>
                        <span>Completed :- {state.completed_steps}</span>
                    </div>
                    <div className="flex-1">
                        <Progress value={state.progress} />
                    </div>
                    <Badge>{state.progress.toFixed(0)}%</Badge>
                </div>}
                {!state.project.is_ready_deployment && <Note
                    title="Start Project Deployment"
                    subtitle="Project deployment has not started yet, once deployment is started updates on phases will be allowed"

                ><Btn variant={'destructive'} size={'sm'} loading={starting} onClick={start}>Start Deployment <BiBoltCircle /></Btn></Note>}
                <div className={
                    cn("relative w-full", !state.project.is_ready_deployment && "overflow-hidden")
                }>
                    {!state.project.is_ready_deployment && <div className="bg-gray-950 bg-opacity-65 absolute top-0 right-0 left-0 bottom-0   h-full z-50 rounded-lg text-white flex items-center justify-center">

                        <span className="font-medium text-2xl">Project not ready for deployment</span>
                    </div>}
                    <ProjectPhase state={state} setState={setState} />
                </div>
            </>}
        </AppPage>
    )
}
