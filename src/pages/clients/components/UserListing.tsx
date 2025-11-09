
import { lazy, Suspense, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Edit, Eye, MessageCircle } from 'lucide-react';
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
import { getModuleModifierMeta, getRelationName, ModuleModifier, UserSearchFilters, UserType } from '@/data/user';
import { UserService } from '@/services/UserService';
import UserFilters from './UserFilters';
import { LuBookHeart, LuCalendarCheck, LuEllipsisVertical, LuFilter, LuIndianRupee, LuListChecks } from 'react-icons/lu';
import { nameLetter } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Radio from '@/components/common/Radio';
import { FaEnvelope, FaPhone } from 'react-icons/fa6';
import { openThread } from '@/pages/messaging/utils/ThreadUtils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LazyEditorDalog = lazy(() => import('./UserEditorDialog'));
const LazyUserProfile = lazy(() => import('./UserProfile'));
const LazyEmployeeProfile = lazy(() => import('./EmployeeProfile'));
const LazyUserBorrowedBooks = lazy(() => import('./UserBorrowedBooks'));
const LazyUserAttendance = lazy(() => import('./UserAttendance'));

const LazyFeeCollectionDialog = lazy(() => import('@/pages/fee-collection/components/FeeCollectionDialog'));

type Props = {
    modifier: ModuleModifier,
    title: string,
    subtitle: string,
    user_types: UserType[]
}

export default function UserListing({ user_types, title, subtitle, modifier }: Props) {
    const meta = getModuleModifierMeta(modifier);
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<UserSearchFilters>({
        debounce: true,
        page: 1,
        keyword: '',
        user_type: user_types.length == 1 && user_types.includes(UserType.Parent) ? UserType.Parent : undefined,
        user_types: user_types
    });
    const setFilter = useSetValue(setFilters);



    const debounceSearch = useDebounce(() => {
        search();
    }, 300, 1);

    const search = async () => {
        setSearching(true);
        var r = await UserService.search(filters);
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
            title: id ? meta.update_title : meta.create_title,
            maxWidth: 1000,
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyEditorDalog id={id} modifier={modifier} onSuccess={() => {
                    search();
                }} onCancel={() => {
                    Modal.close(modal_id);
                }} />
            </Suspense>
        });
    }

    const openFeeDialog = async (record: any) => {
        const modal_id = Modal.show({
            title: 'Fee Details',
            subtitle: `${record.first_name} ${record.last_name} - ${record.code}`,
            maxWidth: `90%`,
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyFeeCollectionDialog
                    id={record.id}
                    mode='collector'
                    onSuccess={() => {
                        search();
                        Modal.close(modal_id);
                    }} onCancel={() => {
                        Modal.close(modal_id);
                    }} />
            </Suspense>
        });
    }

    const openBorrowedBooksDialog = async (record: any) => {
        Modal.show({
            title: 'Borrowed Books',
            subtitle: `${record.first_name} ${record.last_name} - ${record.code}`,
            maxWidth: `90%`,
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyUserBorrowedBooks user_id={record.id} />
            </Suspense>
        });
    }

    const openAttendanceDialog = async (record: any) => {
        Modal.show({
            title: 'Monthly Attedance',
            subtitle: `${record.first_name} ${record.last_name} - ${record.code}`,
            maxWidth: `90%`,
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyUserAttendance user_id={record.id} user_type={record.user_type} />
            </Suspense>
        });
    }


    return (
        <AppPage
            title={title}
            subtitle={subtitle}
            actions={<Btn onClick={() => openEditor()}><FaPlus />Add New</Btn>}
            containerClassName="pt-0 md:pt-0"
        >
            <AppCard>
                {modifier == 'employee' && <div className='px-6 mb-3'>
                    <Radio value={filters.user_type} onChange={(v) => setFilter('user_type', 'debounce')(v, false)} options={[
                        { id: undefined, name: 'All Employees' },
                        { id: UserType.Teacher, name: 'Teachers' },
                        { id: UserType.Driver, name: 'Drivers' },
                        { id: UserType.Doctor, name: 'Doctors' },
                        { id: UserType.Nurse, name: 'Nurses' },
                        { id: UserType.Employee, name: 'Other Non Teaching' }
                    ]} />
                </div>}
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
                    <Btn variant="outline" onClick={() => setShowFilters(!showFilters)}><LuFilter className="h-4 w-4 mr-2" /> Filters</Btn>
                </div>
                {showFilters && (
                    <div className="mt-4 pt-4 border-t p-6">
                        <UserFilters filters={filters} setFilters={setFilters} />
                    </div>
                )}
                <div className="overflow-x-auto">
                    {searching && <CenterLoading className='h-[400px] relative' />}
                    {!searching && <Table>
                        <TableHeader>
                            <TableRow>
                                {modifier === 'student' && <>
                                    <TableHead>Student</TableHead>
                                    <TableHead className="hidden sm:table-cell">Admission No</TableHead>
                                    <TableHead className="hidden md:table-cell">Class/Section</TableHead>
                                    <TableHead className="hidden md:table-cell">Parents</TableHead>
                                    <TableHead className="hidden lg:table-cell">Contact Information</TableHead>
                                    <TableHead className='text-end'>Actions</TableHead>
                                </>}
                                {modifier === 'parent' && <>
                                    <TableHead>Parent</TableHead>
                                    <TableHead className="hidden sm:table-cell">Parent Code</TableHead>
                                    <TableHead className="hidden md:table-cell">Children</TableHead>
                                    <TableHead className="hidden lg:table-cell">Contact Information</TableHead>
                                    <TableHead className='text-end'>Actions</TableHead>
                                </>}
                                {modifier === 'admin' && <>
                                    <TableHead>Administrator</TableHead>
                                    <TableHead className="hidden sm:table-cell">Employee Id</TableHead>
                                    <TableHead className="hidden md:table-cell">Role</TableHead>
                                    <TableHead className="hidden lg:table-cell">Contact Information</TableHead>
                                    <TableHead className='text-end'>Actions</TableHead>
                                </>}
                                {modifier === 'employee' && <>
                                    <TableHead>Employee</TableHead>
                                    <TableHead className="hidden sm:table-cell">Employee Id</TableHead>
                                    <TableHead className="hidden md:table-cell">Designation</TableHead>
                                    <TableHead className="hidden lg:table-cell">Contact Information</TableHead>
                                    <TableHead className='text-end'>Actions</TableHead>
                                </>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Avatar className="h-10 w-10 mr-3">
                                                <AvatarImage src={record.image} />
                                                <AvatarFallback>
                                                    {nameLetter(record.first_name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{record.first_name} {record.last_name}</div>
                                                {modifier == 'student' && <div className="text-sm text-gray-500">Roll No: {record.roll_no}</div>}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant="secondary">{record.code}</Badge>
                                    </TableCell>
                                    {modifier == 'student' && <TableCell className="hidden md:table-cell">
                                        <Badge variant="outline">{[record.class_name, record.section_name].filter(Boolean).join(' - ')}</Badge>
                                    </TableCell>}
                                    {modifier == 'student' && <TableCell className="hidden md:table-cell">
                                        {record.relatives && <div className="flex flex-col gap-1">
                                            {record.relatives.map((relative: any) => <div className='flex flex-row items-center border rounded-sm p-1' key={'relative' + record.id + '_' + relative.id}>
                                                <Avatar className="h-6 w-6 mr-3">
                                                    <AvatarImage src={relative.image} />
                                                    <AvatarFallback>
                                                        {nameLetter(relative.first_name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className='flex gap-2 items-center'>
                                                    <div className="text-xs  text-gray-900">{relative.first_name} {relative.last_name}</div>
                                                    <Badge variant={'outline'}>{getRelationName(relative.relation)}</Badge>
                                                </div>
                                            </div>)}
                                        </div>}
                                    </TableCell>}
                                    {modifier == 'parent' && <TableCell className="hidden md:table-cell">
                                        {record.children && <div className="flex flex-col gap-1">
                                            {record.children.map((child: any) => <div className='flex flex-row items-center border rounded-sm p-1' key={'relative' + record.id + '_' + child.id}>
                                                <Avatar className="h-6 w-6 mr-3">
                                                    <AvatarImage src={child.image} />
                                                    <AvatarFallback>
                                                        {nameLetter(child.first_name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className='flex gap-2 items-center'>
                                                    <div className="text-xs  text-gray-900">{child.first_name} {child.last_name}</div>
                                                </div>
                                            </div>)}
                                        </div>}
                                    </TableCell>}
                                    {['admin', 'employee'].includes(modifier) && <TableCell className="hidden md:table-cell">
                                        <Badge variant="outline">{record.designation_name}</Badge>
                                    </TableCell>}
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex flex-col gap-1 text-sm">
                                            {!!record.email && <div className="text-sm text-gray-500 flex flex-row items-center gap-2"><FaEnvelope />{record.email}</div>}
                                            {!!record.mobile && <div className="text-sm text-gray-500 flex flex-row items-center gap-2"><FaPhone />{record.mobile}</div>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 justify-end">
                                            <Btn size={'sm'} variant={'outline'} onClick={() => openThread({
                                                user_id: record.id
                                            })}><MessageCircle /></Btn>

                                            <Btn
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    const isStudent = modifier === 'student';
                                                    const title = `${record.first_name} ${record.last_name} ${record.code ? `- ${record.code}` : ""}`;
                                                    const subtitle = record.email;

                                                    Modal.show({
                                                        title,
                                                        subtitle,
                                                        maxWidth: 1000,
                                                        content: () => (
                                                            <Suspense fallback={<CenterLoading className="h-[400px] relative" />}>
                                                                {isStudent ? (
                                                                    <LazyUserProfile id={record.id} modifier="student" />
                                                                ) : (
                                                                    <LazyEmployeeProfile id={record.id} />
                                                                )}
                                                            </Suspense>
                                                        ),
                                                    });
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Btn>
                                            <Btn variant="outline" size="sm" onClick={() => openEditor(record.id)}>
                                                <Edit className="h-4 w-4" />
                                            </Btn>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger >
                                                    <Btn variant="outline" size="sm">
                                                        <LuEllipsisVertical />
                                                    </Btn>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {(record.user_type === UserType.Teacher || record.user_type === UserType.Student) && (
                                                        <DropdownMenuItem onClick={() => openBorrowedBooksDialog(record)}>
                                                            <LuBookHeart className="me-1" /> View Borrowed Books
                                                        </DropdownMenuItem>
                                                    )}
                                                    {record.user_type == UserType.Teacher && (
                                                        <DropdownMenuItem onClick={() => console.log("exam-list")}>
                                                            <LuListChecks className="me-1" /> View Exams List
                                                        </DropdownMenuItem>
                                                    )}
                                                    {record.user_type == UserType.Student && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => openFeeDialog(record)}>
                                                                <LuIndianRupee className="me-1" /> View Fee Details
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem onClick={() => openAttendanceDialog(record)}>
                                                                <LuCalendarCheck className="me-1" /> View Attendance
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>




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

