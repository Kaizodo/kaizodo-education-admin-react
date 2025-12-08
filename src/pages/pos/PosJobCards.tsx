import { useState, useRef, useEffect } from 'react';
import {

    Clock,
    Search,
    ChevronLeft,
    ChevronRight,
    CheckSquare,


    PanelRightClose,
    PanelRight,
    User,

    Receipt
} from 'lucide-react';
import { useForm } from '@/hooks/use-form';
import { getDefaultPaginated, PaginationType } from '@/data/pagination';
import { Link, useOutletContext } from 'react-router-dom';
import { useDebounce } from '@/hooks/use-debounce';
import { PosService } from '@/services/PosService';
import CenterLoading from '@/components/common/CenterLoading';
import { LuArrowRight, LuCheck, LuCircle, LuClock, LuListX, LuLoader, LuSettings } from 'react-icons/lu';
import moment from 'moment';
import NoRecords from '@/components/common/NoRecords';
import { MdOutlinePlaylistRemove } from 'react-icons/md';
import { calculateOrder } from './components/helpers/TaxCalculator';
import { getPhaseStatusName, ProjectPhaseStatus } from '../orders/OrderDetail';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { ProjectService } from '@/services/ProjectService';
import Btn from '@/components/common/Btn';



const TimeAgo = ({ startTime }: { startTime: number }) => {
    const [timeStr, setTimeStr] = useState("");

    useEffect(() => {
        const update = () => {
            const m = moment(startTime);

            if (!m.isValid()) {
                setTimeStr("Invalid date");
                return;
            }

            const diffMin = moment().diff(m, "minutes");

            if (diffMin < 1) setTimeStr("Just now");
            else if (diffMin < 60) setTimeStr(`${diffMin}m ago`);
            else setTimeStr(`${Math.floor(diffMin / 60)}h ${diffMin % 60}m ago`);
        };

        update();
        const timer = setInterval(update, 60000);
        return () => clearInterval(timer);
    }, [startTime]);

    return (
        <span className="text-xs font-medium opacity-80 flex items-center gap-1">
            <Clock size={10} /> {timeStr}
        </span>
    );
};


export default function PosJobCards() {
    const { organization_id } = useOutletContext<{ organization_id: number, loadStats: (mainLoading: boolean) => void }>();
    const [searching, setSearching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [paginated, __, setPaginated] = useForm<PaginationType<any>>(getDefaultPaginated());
    const [activeInvoice, setActiveInvoiceValue, setActiveInvoice] = useForm<any>();
    const [filters, setFilter] = useForm<any>({
        organization_id,
        is_proforma: false,
        is_draft: false,
        has_project: true,
        page: 1
    });
    const debounceSearch = useDebounce(() => {
        search();
    }, 300);

    const search = async () => {
        setSearching(true);
        var r = await PosService.searchInvoices(filters);
        if (r.success) {
            setPaginated(r.data);
            if (r.data.records.length > 0) {
                load(r.data.records[0]);
            } else {
                setActiveInvoice({});
            }
        }
        setSearching(false);

    }

    const load = async (record: any) => {
        setLoading(true);
        var r = await PosService.detail({
            internal_reference_number: record.internal_reference_number,
            organization_id: organization_id
        });
        if (r.success) {
            setActiveInvoice(r.data);

        }
        setLoading(false);

    }
    const startProject = async (project_id: number) => {
        var r = await ProjectService.startProjectDeployment({
            project_id
        });
        if (r.success) {
            setActiveInvoiceValue(`project_metas[project_id:${project_id}].project.is_ready_deployment`)(1);
        }
        return r.success;
    }

    const completePhaseStep = async (project_id: number, phase_id: number, phase_step_id: number) => {

        setActiveInvoiceValue(`project_metas[project_id:${project_id}].phases[id:${phase_id}].steps[id:${phase_step_id}].saving`)(true);
        var r = await ProjectService.updatePhaseStep({
            project_id,
            phase_step_id,
            status: ProjectPhaseStatus.Completed
        });

        if (r.success) {
            setActiveInvoiceValue(
                `project_metas[project_id:${project_id}].phases[id:${phase_id}].steps[id:${phase_step_id}].status`,
                `project_metas[project_id:${project_id}].progress`,

            )(ProjectPhaseStatus.Completed, r.data.progress);

        }
        setActiveInvoiceValue(`project_metas[project_id:${project_id}].phases[id:${phase_id}].steps[id:${phase_step_id}].saving`)(false);
    }


    useEffect(() => {
        if (filters.debounce) {
            debounceSearch();
        } else {
            search();
        }
    }, [filters])


    useEffect(() => {
        setFilter('organization_id')(organization_id);
    }, [organization_id])

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const tabContainerRef = useRef<HTMLDivElement>(null);







    const scrollTabs = (direction: 'left' | 'right') => {
        if (tabContainerRef.current) {
            const scrollAmount = 200;
            tabContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };




    var calculated = calculateOrder(activeInvoice);



    return (
        <div className="flex flex-col  flex-1 h-full bg-slate-100 text-slate-800 font-sans overflow-hidden">

            <div className="bg-slate-900 text-white shadow-lg flex-none z-20">
                <div className="flex items-center p-3 border-b border-slate-700 gap-4">
                    <div className="font-bold text-lg tracking-tight flex items-center gap-2">
                        <div className="bg-indigo-500 w-8 h-8 rounded flex items-center justify-center">
                            <CheckSquare size={18} className="text-white" />
                        </div>
                        Job Cards
                    </div>

                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search active orders..."
                            value={filters.keyword}
                            onChange={(e) => setFilter('keyword', 'debounce')(e.target.value, true)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {!isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="ml-auto bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors border border-slate-700"
                        >
                            <PanelRight size={16} /> Order Details
                        </button>
                    )}
                </div>

                {/* Tabs Scroller */}
                <div className="relative flex items-center bg-slate-800">
                    <button onClick={() => scrollTabs('left')} className="p-3 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-10">
                        <ChevronLeft size={20} />
                    </button>

                    {searching && <div className='flex-1 relative text-white'><CenterLoading className="absolute text-white" /></div>}
                    {!searching && <div
                        ref={tabContainerRef}
                        className="flex-1 flex overflow-x-auto scrollbar-hide px-2 py-2 gap-2 scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {!searching && paginated.records.length == 0 && <div className="h-20 flex items-center justify-center w-full">No Job Cards</div>}

                        {paginated.records.map(record => {
                            const isActive = record.id === activeInvoice?.invoice_id;

                            return (
                                <div
                                    key={record.id}
                                    onClick={() => load(record)}
                                    className={`flex-shrink-0 min-w-[200px] cursor-pointer rounded-lg p-3 transition-all duration-200 border-l-4 flex flex-col justify-between select-none
                    ${isActive
                                            ? 'bg-white text-slate-900 border-indigo-500 shadow-lg scale-[1.02]'
                                            : 'bg-slate-700/50 text-slate-300 border-transparent hover:bg-slate-700 hover:text-white'}
                  `}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-xs font-mono font-bold ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                                            {record.internal_reference_number}
                                        </span>
                                        <LuSettings size={14} className="opacity-50" />
                                    </div>
                                    <div className="font-semibold text-sm truncate mb-1">{record.first_name}</div>
                                    <TimeAgo startTime={record.created_at} />
                                </div>
                            );
                        })}
                    </div>}


                    <button onClick={() => scrollTabs('right')} className="p-3 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-10">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>


            {loading && <CenterLoading className="flex-1 relative " />}
            {!loading && !activeInvoice && <NoRecords icon={MdOutlinePlaylistRemove} title='No Job Selected' subtitle='Try selecting a job in order to view tasks' />}
            {!!activeInvoice?.invoice_id && !loading && <div className="flex-1 flex overflow-hidden relative">

                <div className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-100 p-6">
                    <div className="h-full flex gap-6 min-w-max flex-wrap items-start">
                        {activeInvoice.project_metas.length == 0 && <NoRecords className="w-full" title='No Job Cards' subtitle='Order does not have any job cards' />}
                        {activeInvoice.project_metas.map((meta: any) => {
                            var item = activeInvoice.products.find((p: any) => p.id == meta.project.product_price_id);
                            if (!item) {
                                return null;
                            }
                            var is_completed = meta.progress === 100;
                            return (
                                <div key={item.id} className={"w-80   flex flex-col relative"}>
                                    {!meta.project.is_ready_deployment && <div className='absolute w-full h-full bg-black bg-opacity-55 z-50 rounded-lg flex flex-col justify-center items-center'>
                                        <span className='text-white mb-3 flex'>Haven't started yet</span>
                                        <Btn size={'sm'} variant={'outline'} asyncClick={async () => await startProject(meta.project.id)}>Start Job</Btn>
                                    </div>}
                                    <div className={` p-3 rounded-t-xl border-t relative border-l border-r  ${is_completed ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>

                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                                            <Badge>{meta.project.quantity}</Badge>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${is_completed ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                {meta.project.internal_reference_number}
                                            </span>
                                            <div className='flex flex-row w-full mt-2 items-center gap-3'>
                                                <div className='flex-1'>
                                                    <Progress value={meta.progress} className='flex-1 w-full h-2' />
                                                </div>
                                                <span className='text-xs'>{meta.progress}%</span>
                                            </div>
                                        </div>
                                    </div>


                                    <div className={`flex-1 overflow-y-auto p-2 bg-slate-50 border-x border-b border-slate-200 rounded-b-xl space-y-2 ${is_completed ? 'bg-green-50 border-green-200' : ''}`}>
                                        {item.notes && (
                                            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-sm border border-yellow-200 shadow-sm mb-2">
                                                <span className="font-bold block text-xs uppercase mb-1 opacity-70">Note</span>
                                                {item.notes}
                                            </div>
                                        )}

                                        {meta.phases.map((phase: any) => (
                                            <div
                                                key={phase.id}
                                                className="rounded-xl p-3 shadow-sm border bg-white space-y-3"
                                            >
                                                <h2 className="text-lg font-medium">{phase.name}</h2>

                                                <div className="space-y-1">
                                                    {phase.steps.map((step: any) => (<div
                                                        key={step.id}
                                                        className="flex items-center gap-2 text-xs hover:bg-accent rounded-lg p-1 cursor-pointer"
                                                        onClick={() => step.status == ProjectPhaseStatus.Completed ? {} : completePhaseStep(meta.project_id, phase.id, step.id)}
                                                    >
                                                        {!step.saving && step.status == ProjectPhaseStatus.Pending && <LuCircle className='text-xl' />}
                                                        {!step.saving && step.status == ProjectPhaseStatus.Progress && <LuClock className='text-xl' />}
                                                        {!step.saving && step.status == ProjectPhaseStatus.Completed && <LuCheck className='text-xl' />}
                                                        {step.saving && <LuLoader className='animate-spin' />}
                                                        <div className='flex-1'>
                                                            <span>{step.name}</span>
                                                            {!!step.remarks && (
                                                                <div className="text-xs text-gray-500">{step.remarks}</div>
                                                            )}
                                                        </div>
                                                        <Badge
                                                            className={cn(
                                                                'text-xs',
                                                                step.status === ProjectPhaseStatus.Pending && "bg-yellow-50 border-yellow-300 text-yellow-900",
                                                                step.status === ProjectPhaseStatus.Progress && "bg-blue-50 border-blue-300 text-blue-900",
                                                                step.status === ProjectPhaseStatus.Completed && "bg-green-50 border-green-300 text-green-900"
                                                            )}
                                                        >
                                                            {getPhaseStatusName(step.status)}
                                                        </Badge>

                                                    </div>))}
                                                </div>
                                            </div>
                                        ))}



                                    </div>
                                </div>
                            );
                        })}



                    </div>
                </div>


                {activeInvoice?.invoice_id && (
                    <div className={`
            ${isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full'} 
            flex-shrink-0 bg-white border-l border-slate-200 shadow-xl z-30 transition-all duration-300 ease-in-out relative flex flex-col
          `}>
                        <div className="w-80 h-full flex flex-col absolute left-0 top-0">

                            {/* Sidebar Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Receipt size={18} className="text-slate-400" /> Order Details
                                </h2>
                                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-700">
                                    <PanelRightClose size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {/* Customer Info Card */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="font-bold text-slate-900">{activeInvoice.customer?.first_name} {activeInvoice.customer?.last_name}</div>
                                        <User size={16} className="text-slate-400 mt-1" />
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono mb-2">{activeInvoice.referenceNumber}</div>
                                    {activeInvoice.contactInfo && (
                                        <div className="text-sm text-slate-600 border-t border-slate-200 pt-2 mt-2">
                                            {activeInvoice.contactInfo}
                                        </div>
                                    )}
                                    <div className="mt-3 flex gap-2 text-xs">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold uppercase">{activeInvoice.status}</span>
                                        <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold"><TimeAgo startTime={activeInvoice.startTime} /></span>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider">Order Summary</h3>
                                    <div className="space-y-3">
                                        {calculated.product_calcs.map(item => (
                                            <div key={item.id} className="flex justify-between items-start text-sm group">
                                                <div className="flex items-start gap-2">
                                                    {/* <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${is_completed ? 'bg-green-500' : item.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-300'}`} /> */}
                                                    <span className={'text-slate-700'}>{item.name} ({item.quantity}x)</span>
                                                </div>
                                                <span className="font-mono text-slate-500">{activeInvoice.currency_symbol}{item.total.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals Section */}
                                <div className="border-t-2 border-dashed border-slate-100 pt-4 mt-auto">
                                    <div className="flex justify-between text-sm text-slate-500 mb-2">
                                        <span>Subtotal</span>
                                        <span>{activeInvoice.currency_symbol}{calculated.order_totals.base.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-500 mb-4">
                                        <span>Tax</span>
                                        <span>{activeInvoice.currency_symbol}{calculated.order_totals.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold text-slate-800">
                                        <span>Total</span>
                                        <span>{activeInvoice.currency_symbol}{calculated.order_totals.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Footer Actions */}
                            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">

                                <Link to={'/pos/job-cards/' + activeInvoice.internal_reference_number}>
                                    <button className="w-full py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-colors">
                                        Update Or Collect Payment <LuArrowRight />
                                    </button>
                                </Link>
                            </div>

                        </div>
                    </div>
                )}

            </div>}

            {!searching && paginated.records.length == 0 && <NoRecords icon={LuListX} title='No Job Cards' subtitle='Currency there are no job cards' />}

        </div>
    );
}