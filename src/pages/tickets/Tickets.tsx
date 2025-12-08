import { useEffect, useState } from 'react';
import { Search, Sliders } from 'lucide-react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import { cn, nameLetter } from '@/lib/utils';
import { useForm } from '@/hooks/use-form';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { TicketService } from '@/services/TicketService';
import CenterLoading from '@/components/common/CenterLoading';
import NoRecords from '@/components/common/NoRecords';
import { LuMessageCircleX } from 'react-icons/lu';
import Pagination from '@/components/common/Pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import moment from 'moment';
import { getTicketCategoryActionName, TicketPriorityArray, TicketStatusArray } from '@/data/Ticket';




const TicketListItem = ({ ticket, internal_reference_number }: { ticket: any, internal_reference_number?: string }) => {
    const bgColor = internal_reference_number == ticket.internal_reference_number ? 'bg-sky-50 border-primary' : 'hover:bg-gray-50';



    var status = TicketStatusArray.find(t => t.id == ticket.status);
    var priority = TicketPriorityArray.find(t => t.id == ticket.priority);
    return (
        <NavLink to={'/tickets/' + ticket.internal_reference_number}>
            <div className={`p-3 cursor-pointer transition duration-150 border rounded-lg   ${bgColor}`}>
                <div className='flex flex-row items-center justify-between'>
                    <span className='text-xs text-gray-400 mb-1 flex'>{ticket.internal_reference_number}</span>
                </div>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={ticket?.user?.image} />
                            <AvatarFallback>{nameLetter(ticket?.user?.first_name ?? '')}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <p className="font-medium text-gray-900 text-sm">{ticket?.user?.first_name}  {ticket?.user?.last_name}</p>
                            <span className='text-xs text-red-500'>{getTicketCategoryActionName(ticket.ticket_category_type)}</span>
                        </div>
                    </div>
                    <span className="text-xs text-gray-500">{moment(ticket.updated_at ?? ticket.created_at).format('LT')}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 truncate">{ticket.remarks}</p>
                <div className='flex flex-row items-center gap-3'>
                    <span className={`${status?.bg} ${status?.fg} text-xs rounded-full border p-1 leading-none`}>{status?.name}</span>
                    <span className={`${priority?.bg} ${priority?.fg} text-xs rounded-full border p-1 leading-none`}>{priority?.name}</span>
                </div>
            </div>
        </NavLink>
    );
};
export default function Tickets() {
    const { internal_reference_number } = useParams<{ internal_reference_number: string }>()
    const [searching, setSeraching] = useState(true);
    const [paginated, setPaginated] = useState<PaginationType<any>>(getDefaultPaginated());
    const [filters, setFilter] = useForm({
        page: 1,
        keyword: ''
    });

    const debounceSearch = useDebounce(() => {
        search();
    }, 300);

    const search = async () => {
        setSeraching(true);
        var r = await TicketService.search(filters);
        if (r.success) {
            setPaginated(r.data);
        }
        setSeraching(false);
    }

    useEffect(() => {
        if (!filters.debounce) {
            search();
        } else {
            debounceSearch();
        }
    }, [filters])

    return (
        <div className="max-w-7xl mx-auto py-3" >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6  ">
                <div className="lg:col-span-3">
                    <div className={cn(`bg-white rounded-xl shadow-lg `)}>
                        <div className='p-3'>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Tickets</h2>
                            <div className="flex items-center border border-gray-200 rounded-lg p-2 mb-4">
                                <Search className="w-4 h-4 text-gray-400 ml-1" />
                                <input
                                    type="text"
                                    placeholder="Search tickets"
                                    className="flex-grow ml-2 outline-none text-sm text-gray-700"
                                    value={filters.keyword}
                                    onChange={e => setFilter('keyword', 'debounce')(e.target.value, true)}
                                />
                                <button className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                                    <Sliders className="w-5 h-5" />
                                </button>
                            </div>
                            <h3 className="text-sm font-medium text-gray-700 ">Support Tickets {paginated.records.length > 0 && !searching ? `(${paginated.records.length})` : ''}</h3>
                        </div>
                        {searching && <CenterLoading className='relative h-[500px]' />}
                        {!searching && paginated.records.length == 0 && <NoRecords icon={LuMessageCircleX} title='No Tickets Found' subtitle='Try adjusting your search or filter criteria.' />}
                        {!searching && paginated.records.length > 0 && <div className="space-y-2 overflow-y-auto custom-scrollbar p-2">
                            {paginated.records.map((ticket) => (
                                <TicketListItem
                                    key={ticket.id}
                                    ticket={ticket}
                                    internal_reference_number={internal_reference_number}
                                />
                            ))}
                        </div>}
                        <Pagination paginated={paginated} onChange={setFilter('page', 'debounce')} range={1} />
                    </div>

                </div>

                <div className='lg:col-span-9 grid grid-cols-1 lg:grid-cols-9 gap-6'>
                    {!internal_reference_number && <div className='w-full h-full flex items-center justify-center text-center   col-span-9 min-h-[400px]'>
                        <span className='text-gray-400 italic text-xs'>Select a support ticket</span>
                    </div>}
                    {!!internal_reference_number && <Outlet />}
                </div>
            </div>
        </div>
    );
}
