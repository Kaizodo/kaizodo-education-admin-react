import { useEffect, useState } from 'react';
import CenterLoading from '@/components/common/CenterLoading';
import { useForm } from '@/hooks/use-form';
import { LuArrowRight } from 'react-icons/lu';
import { formatDateTime, nameLetter } from '@/lib/utils';
import AppPage from '@/components/app/AppPage';
import { Search } from '@/components/ui/search';
import Dropdown from '@/components/common/Dropdown';
import Btn from '@/components/common/Btn';
import { Badge } from '@/components/ui/badge';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { ProjectService } from '@/services/ProjectService';
import { UserOrderStatus } from '@/data/order';
import { useNavigate } from 'react-router-dom';
import { Project } from '../orders/OrderDetail';
import { AvatarGroup, AvatarGroupTooltip } from '@/components/ui/avatar-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';



export default function ProjectListing() {
    const navigate = useNavigate();
    const [searching, setSeraching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<Project>>(getDefaultPaginated());
    const [filters, setFilter] = useForm({
        page: 1,
        keyword: ''
    });

    const search = async () => {
        setSeraching(true);
        var r = await ProjectService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSeraching(false);
    }

    useEffect(() => {
        search();
    }, [filters])




    return (
        <AppPage
            title='Projects'
            subtitle='Track projects and their progress'
        >
            <div className='border bg-white rounded-lg p-3 shadow flex flex-row items-end gap-3 mb-6'>
                <div className='flex-1'>
                    <Search placeholder='Search project' value={filters.keyword} onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)} />
                </div>
                {/* <div>
                    <Dropdown
                        value={filters.status}
                        onChange={setFilter('status', 'debounce')}
                        placeholder='Select a status'
                        getOptions={async () => [
                            { id: UserOrderStatus.Pending, name: 'Awaiting Payment' },
                            { id: UserOrderStatus.Active, name: 'Active Order' },

                        ]}>Order Status</Dropdown>
                </div> */}
            </div>

            <div className="space-y-6">
                {searching && <CenterLoading className="relative h-[400px]" />}
                {!searching && paginated.records.map((project) => {

                    const deployment_manager = project.users.find(u => u.id == project.deployment_manager_user_id);
                    const relationship_manager = project.users.find(u => u.id == project.relationship_manager_user_id);


                    return (
                        <div
                            key={project.id}
                            className="relative flex flex-col sm:flex-row gap-3 bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl border border-gray-100"
                        >
                            <div className="p-6 flex-1 sm:border-e">
                                <div className="flex  flex-row items-center mb-4 gap-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-indigo-700">{project.internal_reference_number}</h3>

                                        {<p className="text-sm text-gray-500 mt-1">Manager Assigned : {formatDateTime(project.deployment_manager_assigned_datetime)}</p>}
                                        <p className="text-sm text-gray-500 mt-1">Team Assigned : {formatDateTime(project.team_assigned_datetime)}</p>
                                    </div>
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
                                    {!!project.is_ready_deployment && <Badge className='ms-auto self-start'>In Deployment Phase</Badge>}
                                    {!project.is_ready_deployment && <Badge className='ms-auto self-start bg-orange-400'>New Project</Badge>}
                                </div>


                                <div className='flex flex-row items-center border-t gap-3'>
                                    <span className='font-medium'>Team :- </span>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4  pt-4 flex-1">
                                        <AvatarGroup variant="motion" className="h-12 -space-x-3">
                                            {project.users.filter(u => project.project_user_ids.includes(u.id)).map((user, index: number) => (
                                                <Avatar key={index} className="size-12 border-3 border-background">
                                                    <AvatarImage src={user.image} />
                                                    <AvatarFallback>{nameLetter(user.first_name)}</AvatarFallback>
                                                    <AvatarGroupTooltip>
                                                        <p>{user.first_name} {user.last_name}</p>
                                                    </AvatarGroupTooltip>
                                                </Avatar>
                                            ))}
                                        </AvatarGroup>
                                    </div>



                                    {<div className="flex flex-row items-center gap-3">
                                        <Btn variant={'outline'} onClick={() => navigate('/projects/' + project.internal_reference_number)}>View Details <LuArrowRight /></Btn>

                                    </div>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AppPage>
    );
};

