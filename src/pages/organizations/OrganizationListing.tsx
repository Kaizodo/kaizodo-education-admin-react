
import { lazy, Suspense, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, Trash2, GraduationCap } from 'lucide-react';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { useDebounce } from '@/hooks/use-debounce';
import { msg } from '@/lib/msg';
import CenterLoading from '@/components/common/CenterLoading';
import AppPage from '@/components/app/AppPage';
import Btn from '@/components/common/Btn';
import { FaPlus } from 'react-icons/fa';
import AppCard from '@/components/app/AppCard';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { OrganizationService } from '@/services/OrganizationService';
import { useNavigate } from 'react-router-dom';
import { LuCloudLightning, LuUpload } from 'react-icons/lu';
import { Modal, ModalBody, ModalFooter } from '@/components/common/Modal';


export default function OrganizationListing() {
    const navigate = useNavigate();
    const [searching, setSearching] = useState(true);
    const [deploying, setDeploying] = useState(false);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string
    }>({
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
        var r = await OrganizationService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSearching(false);
    }


    const deploy = async (record: any) => {
        msg.confirm("Deploy " + record.name, `This will deploy ${record.name} at ${record.domain}.edu.kaizodo.in`, {
            onConfirm: async () => {
                setDeploying(true);
                var r = await OrganizationService.deploy(record.id);
                if (r.success) {
                    const modal_id = Modal.show({
                        title: `${record.name} is deployed successfuly`,
                        subtitle: `${record.name}`,
                        content: () => {
                            return (<>
                                <ModalBody>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="font-semibold">Admin Panel</TableCell>
                                                <TableCell>
                                                    <a
                                                        href={`https://${record.admin_panel_url}.${record.domain}.edu.kaizodo.in`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {record.admin_panel_url}.{record.domain}.edu.kaizodo.in
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-semibold">Parent Panel</TableCell>
                                                <TableCell>
                                                    <a
                                                        href={`https://${record.parent_panel_url}.${record.domain}.edu.kaizodo.in`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {record.parent_panel_url}.{record.domain}.edu.kaizodo.in
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-semibold">Student Panel</TableCell>
                                                <TableCell>
                                                    <a
                                                        href={`https://${record.student_panel_url}.${record.domain}.edu.kaizodo.in`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {record.student_panel_url}.{record.domain}.edu.kaizodo.in
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="font-semibold">Employee Panel</TableCell>
                                                <TableCell>
                                                    <a
                                                        href={`https://${record.employee_panel_url}.${record.domain}.edu.kaizodo.in`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {record.employee_panel_url}.{record.domain}.edu.kaizodo.in
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </ModalBody>
                                <ModalFooter>
                                    <Btn size={'sm'} variant={'outline'} onClick={() => Modal.close(modal_id)}>Close</Btn>
                                </ModalFooter>
                            </>);
                        }
                    })
                }
                setDeploying(false);

                return r.success;
            }
        })

    }

    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }

    }, [filters]);





    return (
        <AppPage title='Organizations' subtitle='Manage institutions and create new one'>
            <AppCard title='Organizations List' actions={<div className='me-4'><Btn size={'sm'} onClick={() => navigate('/organizations/create')}><FaPlus />Add New</Btn></div>}>
                <div className="flex flex-col sm:flex-row gap-4 px-6">
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
                                <TableHead></TableHead>
                                <TableHead>Organization</TableHead>
                                <TableHead>Domain</TableHead>
                                <TableHead className='text-end'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>
                                        <img src={record.logo_short} className='border rounded-sm' style={{
                                            width: 50
                                        }} />
                                    </TableCell>
                                    <TableCell>{record.name}</TableCell>
                                    <TableCell>{record.domain}</TableCell>
                                    <TableCell>

                                        <div className="flex gap-2 justify-end">
                                            <Btn size={'sm'} onClick={() => deploy(record)} disabled={deploying}><LuCloudLightning />Deploy</Btn>
                                            <Btn variant="outline" size="sm" onClick={() => navigate('/organizations/update/' + record.id)}>
                                                <Edit className="h-4 w-4" />
                                            </Btn>
                                            <Btn onClick={() => {
                                                msg.confirm('Delete ' + record.name, 'Are you sure you want to delete ' + record.name + '? this action cannot be undone.', {
                                                    onConfirm: async () => {
                                                        var r = await OrganizationService.delete(record.id);
                                                        if (r.success) {
                                                            search();
                                                        }
                                                        return r.success;
                                                    }
                                                })
                                            }} variant="outline" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Btn>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>}
                    {!searching && paginated.records.length == 0 && <NoRecords />}
                    <div className='p-3'>
                        <Pagination paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />

                    </div>
                </div>
            </AppCard>
        </AppPage>
    );
};

