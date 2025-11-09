import AppPage from "@/components/app/AppPage";
import CenterLoading from "@/components/common/CenterLoading";
import { ProjectService } from "@/services/ProjectService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Phase, Project } from "../orders/OrderDetail";
import { User } from "@/data/user";
import ProjectPhase from "./components/ProjectPhase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameLetter } from "@/lib/utils";


export type ProjectState = {
    project: Project,
    users: User[],
    phases: Phase[]
}

export default function ProjectDetail() {
    const { internal_reference_number } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [state, setState] = useState<ProjectState>();


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
                <ProjectPhase state={state} setState={setState} />
            </>}
        </AppPage>
    )
}
