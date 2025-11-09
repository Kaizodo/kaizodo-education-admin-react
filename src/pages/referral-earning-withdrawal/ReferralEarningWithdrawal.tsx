
import { lazy, ReactNode, Suspense, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useSetValue } from '@/hooks/use-set-value';
import { useDebounce } from '@/hooks/use-debounce';
import CenterLoading from '@/components/common/CenterLoading';
import AppPage from '@/components/app/AppPage';
import Btn from '@/components/common/Btn';
import AppCard from '@/components/app/AppCard';
import NoRecords from '@/components/common/NoRecords';
import Pagination from '@/components/common/Pagination';
import { Modal } from '@/components/common/Modal';
import { ReferralEarningWithdrawalService } from '@/services/ReferralEarningWithdrawalService';
import moment from 'moment';
import TextField from '@/components/common/TextField';
import Dropdown from '@/components/common/Dropdown';
import { EarningWithdrawalStatus, EarningWithdrawalStatusArray, getEarningWithdrawalStatusName } from '@/data/user';
import { nameLetter } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LuArrowRight, LuMail, LuPhone } from 'react-icons/lu';

const LazyEditorDialog = lazy(() => import('./components/ReferralEarningWithdrawalProcessDialog'));

const DetailRow: React.FC<{ label: string, value: ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between border-b border-gray-100 px-1 last:border-b-0">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{value}</span>
    </div>
);

export default function ReferralEarningWithdrawal() {
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState<{
        debounce?: boolean,
        page: number,
        keyword: string,
        status?: EarningWithdrawalStatus
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
        var r = await ReferralEarningWithdrawalService.search(filters);
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

    const openEditor = async (record: any) => {
        const modal_id = Modal.show({
            title: 'Process Withdrwal Request',
            maxWidth: 500,
            content: () => <Suspense fallback={<CenterLoading className='h-[400px] relative' />}>
                <LazyEditorDialog
                    record={record}
                    onSuccess={() => {
                        search();
                        Modal.close(modal_id);
                    }} onCancel={() => {
                        Modal.close(modal_id);
                    }}

                />
            </Suspense>
        });
    }





    return (
        <AppPage
            title='Referral Earning Withdrawls'
            subtitle='Manage referral earning withdrawal requests'
            containerClassName="md:pt-0"
        >
            <AppCard contentClassName="p-0">

                <div className='flex flex-row items-end p-3 borer-b'>
                    <div className='grid grid-cols-4 gap-3 flex-1'>
                        <TextField placeholder='Search by name...' value={filters.keyword} onChange={v => setFilter('keyword', 'debounce')(v, true)}>Search</TextField>
                        <Dropdown searchable={false} value={filters.status} placeholder='Select a status' onChange={setFilter('status', 'debounce')} getOptions={async () => EarningWithdrawalStatusArray}>Status</Dropdown>
                    </div>
                    <Btn onClick={() => setFilters({ page: 1, keyword: '', debounce: false })}>Clear Filters</Btn>

                </div>



                <div className="overflow-x-auto">
                    {searching && <CenterLoading className='h-[400px] relative' />}
                    {!searching && <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ref No</TableHead>
                                <TableHead>Marketer</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Bank Details</TableHead>
                                <TableHead>Date Requested</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className='text-end'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.internal_reference_number}</TableCell>
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
                                                <div className='flex flex-row items-center gap-1 text-xs text-gray-500'><LuPhone /><span>{record.mobile}</span></div>
                                                <div className='flex flex-row items-center gap-1 text-xs text-gray-500'><LuMail /><span>{record.email}</span></div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>₹{record.amount}</TableCell>
                                    <TableCell>
                                        <div className='border rounded-sm'>
                                            <DetailRow label="Bank Name" value={record.bank_name} />
                                            <DetailRow label="Account No." value={record.bank_account_number} />
                                            <DetailRow label="IFSC Code" value={record.bank_ifsc_code} />
                                            <DetailRow label="Branch" value={record.bank_branch_name} />
                                        </div>
                                    </TableCell>
                                    <TableCell><span className='text-xs text-gray-500'>{moment(record.created_at).format('DD MMM, Y LT')}</span></TableCell>
                                    <TableCell>
                                        <div>
                                            <span className='font-medium text-sm'>{getEarningWithdrawalStatusName(record.status)}</span>
                                            {![
                                                EarningWithdrawalStatus.Pending,
                                                EarningWithdrawalStatus.Processing
                                            ].includes(record.status) && <div>
                                                    <span className='text-xs text-gray-500'>{moment(record.updated_at).format('DD MMM, Y LT')}</span>
                                                </div>}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {![
                                            EarningWithdrawalStatus.Pending,
                                            EarningWithdrawalStatus.Processing
                                        ].includes(record.status) && <div className='flex flex-col'>
                                                {!!record.status_remarks && <span className='text-xs text-gray-500 italic'>"{record.status_remarks}"</span>}
                                                {!!record.reference_number && <span className='font-medium  text-sm'>REF :- {record.reference_number}</span>}
                                            </div>}
                                        {[
                                            EarningWithdrawalStatus.Pending,
                                            EarningWithdrawalStatus.Processing
                                        ].includes(record.status) && <div className="flex gap-2 justify-end">
                                                <Btn variant="outline" size="sm" onClick={() => openEditor(record)}>
                                                    Process
                                                    <LuArrowRight />
                                                </Btn>
                                            </div>}
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

