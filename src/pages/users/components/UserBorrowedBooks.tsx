import Btn from "@/components/common/Btn";
import CenterLoading from "@/components/common/CenterLoading";
import DateTimeField from "@/components/common/DateTimeField";
import Dropdown from "@/components/common/Dropdown";
import { ModalBody, ModalFooter } from "@/components/common/Modal";
import NoRecords from "@/components/common/NoRecords";
import Pagination from "@/components/common/Pagination";
import TextField from "@/components/common/TextField";
import { getDefaultPaginated, PaginationType } from "@/data/pagination";
import { getUserItemIssueStatusName, UserItemIssueStatus } from "@/data/user";
import { useDebounce } from "@/hooks/use-debounce";
import { useSetValue } from "@/hooks/use-set-value";
import { InventoryService } from "@/services/InventoryService";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import moment from "moment";

type Props = {
    user_id: number
}

export default function UserBorrowedBooks({ user_id }: Props) {
    const [searching, setSearching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilters] = useState({
        debounce: true,
        page: 1,
        is_book: 1,
        keyword: '',
        user_id: user_id,
        date_from: '',
        date_to: '',
        quick_filters: ''
    });
    const setFilter = useSetValue(setFilters);

    const debounceSearch = useDebounce(() => {
        search();
    }, 300, 1);


    const search = async () => {
        setSearching(true);
        var r = await InventoryService.issueSearch(filters);
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


    const getStatusColor = (status: UserItemIssueStatus) => {
        switch (status) {
            case UserItemIssueStatus.Pending:
                return 'bg-yellow-100 text-yellow-800';
            case UserItemIssueStatus.Approved:
                return 'bg-blue-100 text-blue-800';
            case UserItemIssueStatus.Issued:
                return 'bg-green-100 text-green-800';
            case UserItemIssueStatus.Rejected:
                return 'bg-red-100 text-red-800';
            case UserItemIssueStatus.Cancelled:
                return 'bg-gray-100 text-gray-800';
            case UserItemIssueStatus.Submitted:
                return 'bg-indigo-100 text-indigo-800';
            case UserItemIssueStatus.ReIssue:
                return 'bg-purple-100 text-purple-800';
            case UserItemIssueStatus.NotSubmitted:
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    return (
        <>
            <ModalBody>
                <div className='flex flex-row items-end px-6 gap-6'>
                    <div className='grid grid-cols-4 gap-6 w-full'>
                        <TextField
                            value={filters.keyword}
                            onChange={v => setFilter('keyword', 'debounce')(v, true)}
                            placeholder='Search by Student Name or Reference Number'
                        >
                            Keyword
                        </TextField>



                        <DateTimeField
                            value={filters.date_from}
                            onChange={v => setFilter('date_from', 'debounce')(v, false)}
                            placeholder='Select start date'
                            mode='date'
                        >
                            Due Date From
                        </DateTimeField>

                        <DateTimeField
                            value={filters.date_to}
                            onChange={v => setFilter('date_to', 'debounce')(v, false)}
                            placeholder='Select end date'
                            mode='date'
                        >
                            Due Date To
                        </DateTimeField>

                        <Dropdown
                            searchable={false}
                            value={filters.quick_filters}
                            onChange={v => setFilter('quick_filters', 'debounce')(v, false)}
                            placeholder='Select Quick Filter'
                            getOptions={async () => [
                                { id: 'due_date_za', name: 'Due Date: Newest First' },
                                { id: 'due_date_az', name: 'Due Date: Oldest First' },
                                { id: 'issue_date_za', name: 'Issue Date: Newest First' },
                                { id: 'issue_date_az', name: 'Issue Date: Oldest First' },
                                { id: '2_days_due', name: 'Due in 2 Days' },
                                { id: '1_day_due', name: 'Due in 1 Day' },
                                { id: 'overdue', name: 'Overdue' },
                                { id: 'today', name: 'Due Today' }
                            ]}
                        >  Quick Filters</Dropdown>

                    </div>
                    <div>
                        <Btn onClick={() => setFilters({
                            debounce: false,
                            page: 1,
                            is_book: 1,
                            keyword: '',
                            user_id: user_id,
                            date_from: '',
                            date_to: '',
                            quick_filters: ''
                        })}>Clear Filters</Btn>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reference no</TableHead>
                                <TableHead>Books</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!searching && paginated.records.map((record) => (
                                <TableRow key={record.id}>

                                    <TableCell className="font-medium">{record.internal_reference_number}</TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-1 mt-2">
                                            {record.items.map((item: any) => (
                                                <div
                                                    className="flex flex-row items-center border rounded-sm p-1"
                                                    key={`item-${record.id}-${item.id}`}
                                                >
                                                    <div className="text-xs text-gray-900">{item.name}</div>
                                                </div>
                                            ))}
                                        </div>

                                    </TableCell>
                                    <TableCell className="space-y-1 text-sm">
                                        <div className="text-gray-500">
                                            <span className="font-medium">Requested:</span> {moment(record.created_at).format('DD MMM Y')}
                                        </div>
                                        {moment(record.issue_date).isValid() && <div className="text-blue-600">
                                            <span className="font-medium">Issued:</span> {moment(record.issue_date).format('DD MMM Y')}
                                        </div>}

                                        <div className="text-red-600">
                                            <span className="font-medium">Due Date:</span> {moment(record.due_date).format('DD MMM Y')}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge className={getStatusColor(record.status)}>
                                            {getUserItemIssueStatusName(record.status)}
                                        </Badge>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {!searching && paginated.records.length < 1 && (
                        <NoRecords />
                    )}
                    {searching && <CenterLoading className='relative h-[400px]' />}

                </div>
            </ModalBody>
            {paginated.pages > 1 && <ModalFooter>
                {!searching && <Pagination paginated={paginated} onChange={(page) => setFilter('page', 'debounce')(page, false)} />}
            </ModalFooter>}
        </>
    )
}
