
import { lazy, Suspense, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit } from 'lucide-react';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { useDebounce } from '@/hooks/use-debounce';
import CenterLoading from '@/components/common/CenterLoading';
import AppPage from '@/components/app/AppPage';
import Btn from '@/components/common/Btn';
import { FaPlus } from 'react-icons/fa';
import AppCard from '@/components/app/AppCard';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { Modal } from '@/components/common/Modal';
import { User, UserSearchFilters } from '@/data/user';
import { TeamService } from '@/services/TeamService';
import { nameLetter } from '@/lib/utils';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import {
    AvatarGroup,
    AvatarGroupTooltip,
} from '@/components/ui/avatar-group';
import moment from 'moment';


const LazyEditorDialog = lazy(() => import('./components/TeamEditorDialog'));
const LazyTeamWorkDialog = lazy(() => import('./components/TeamWorkDialog'));



export default function Teams() {
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState<UserSearchFilters>({
        debounce: true,
        page: 1,
        keyword: '',
    });
    const setFilter = useSetValue(setFilters);



    const debounceSearch = useDebounce(() => {
        search();
    }, 300, 1);

    const search = async () => {
        setSearching(true);
        var r = await TeamService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }

    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }

    }, [filters]);

    const openEditor = async (id?: number) => {
        const modal_id = Modal.show({
            title: id ? 'Edit Team' : 'Add New Team',
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyEditorDialog id={id} onSuccess={(data) => {
                    teamWorkDialog(data);
                    search();
                    Modal.close(modal_id);
                }} onCancel={() => {
                    Modal.close(modal_id);
                }} />
            </Suspense>
        });
    }
    const teamWorkDialog = async (team: any) => {
        const modal_id = Modal.show({
            title: team.name + ' Work & Tasks',
            subtitle: 'Manage work and tasks assigned to team',
            maxWidth: 1200,
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyTeamWorkDialog
                    id={team.id}
                    onSuccess={() => {
                        search();
                        Modal.close(modal_id);
                    }} onCancel={() => {
                        Modal.close(modal_id);
                    }} />
            </Suspense>
        });
    }


    return (
        <AppPage
            title={'Team Management'}
            subtitle={'Manage teams which will be handling assigned tasks'}
            actions={<Btn onClick={() => openEditor()}><FaPlus />Add New</Btn>}
            containerClassName="pt-0 md:pt-0"
        >
            <AppCard>

                <div className="flex flex-col sm:flex-row gap-4 px-6 pt-6">

                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search..."
                            value={filters.keyword}
                            onChange={(e) => setFilter('keyword', 'debounce')(e.target.value, true)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {searching && <CenterLoading className='h-[400px] relative' />}
                    {!searching && <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Team</TableHead>
                                <TableHead>Managers</TableHead>
                                <TableHead>Subbordinates</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className='text-end'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.name}</TableCell>
                                    <TableCell>
                                        <AvatarGroup variant="motion" className="h-12 -space-x-3">
                                            {record.managers.map((user: User, index: number) => (
                                                <Avatar key={index} className="size-12 border-3 border-background">
                                                    <AvatarImage src={user.image} />
                                                    <AvatarFallback>{nameLetter(user.first_name)}</AvatarFallback>
                                                    <AvatarGroupTooltip>
                                                        <p>{user.first_name} {user.last_name}</p>
                                                    </AvatarGroupTooltip>
                                                </Avatar>
                                            ))}
                                        </AvatarGroup>
                                    </TableCell>
                                    <TableCell>
                                        <AvatarGroup variant="motion" className="h-12 -space-x-3">
                                            {record.subordinates.map((user: User, index: number) => (
                                                <Avatar key={index} className="size-12 border-3 border-background">
                                                    <AvatarImage src={user.image} />
                                                    <AvatarFallback>{nameLetter(user.first_name)}</AvatarFallback>
                                                    <AvatarGroupTooltip>
                                                        <p>{user.first_name} {user.last_name}</p>
                                                    </AvatarGroupTooltip>
                                                </Avatar>
                                            ))}
                                        </AvatarGroup>
                                    </TableCell>
                                    <TableCell>{moment(record.created_at).format('DD MMM, Y LT')}</TableCell>

                                    <TableCell>
                                        <div className="flex gap-2 justify-end">
                                            <Btn size={'sm'} onClick={() => teamWorkDialog(record)}>Work & Tasks</Btn>
                                            <Btn variant="outline" size="sm" onClick={() => openEditor(record.id)}>
                                                <Edit className="h-4 w-4" /> Edit
                                            </Btn>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>}
                    {!searching && paginated.records.length == 0 && <NoRecords />}
                    <Pagination className="p-3" paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />
                </div>
            </AppCard>
        </AppPage>
    );
};

